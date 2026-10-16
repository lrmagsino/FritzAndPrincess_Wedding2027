"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";

export interface WishAuthState {
  user: User | null;
  loading: boolean;
  configured: boolean;
  error: boolean;
}

type AuthNotice = { kind: "success" | "error"; text: string };

export function useWishAuth(): WishAuthState {
  const [auth, setAuth] = useState<WishAuthState>({
    user: null,
    loading: true,
    configured: true,
    error: false,
  });

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};
    void (async () => {
      await Promise.resolve();
      let supabase;
      try {
        supabase = getSupabaseClient();
      } catch (error) {
        console.error("Unable to initialize wishes authentication.", error);
        if (active) setAuth({ user: null, loading: false, configured: true, error: true });
        return;
      }

      if (!supabase) {
        if (active) setAuth({ user: null, loading: false, configured: false, error: false });
        return;
      }

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) {
          setAuth({ user: session?.user ?? null, loading: false, configured: true, error: false });
        }
      });
      unsubscribe = () => data.subscription.unsubscribe();
      if (!active) {
        unsubscribe();
        return;
      }
      void supabase.auth
        .getSession()
        .then(({ data: sessionData, error }) => {
          if (error) throw error;
          if (active) {
            setAuth({
              user: sessionData.session?.user ?? null,
              loading: false,
              configured: true,
              error: false,
            });
          }
        })
        .catch((error: unknown) => {
          console.error("Unable to restore wishes sign-in.", error);
          if (active) setAuth({ user: null, loading: false, configured: true, error: true });
        });
    })();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return auth;
}

interface WishOwnerLoginProps {
  redirectPath: string;
  intro?: string;
}

export function WishOwnerLogin({
  redirectPath,
  intro = "Enter your email and we’ll send you a secure sign-in link. No password is needed.",
}: WishOwnerLoginProps) {
  const [method, setMethod] = useState<"password" | "email">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<AuthNotice | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || (method === "email" && cooldown > 0)) return;

    setBusy(true);
    setNotice(null);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setNotice({ kind: "error", text: "Wishes authentication is not configured yet." });
        return;
      }
      if (method === "password") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          setNotice({
            kind: "error",
            text: "We could not sign you in with that email and password. Check your details, or use an email sign-in link if you have not set a password yet.",
          });
          return;
        }
        return;
      }

      const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
      const redirectTo = new URL(`${basePath}${redirectPath}`, window.location.origin).toString();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
      });
      if (error) throw error;
      setNotice({
        kind: "success",
        text: "Check your email for a secure sign-in link. You can return here after signing in.",
      });
    } catch (error) {
      const authError =
        typeof error === "object" && error !== null
          ? (error as { status?: unknown; code?: unknown; message?: unknown })
          : null;
      const status = typeof authError?.status === "number" ? authError.status : 0;
      const code = typeof authError?.code === "string" ? authError.code.toLowerCase() : "";
      const message = typeof authError?.message === "string" ? authError.message.toLowerCase() : "";
      const rateLimited =
        status === 429 ||
        code.includes("rate_limit") ||
        code.includes("rate-limit") ||
        (message.includes("email") && message.includes("rate limit"));

      if (rateLimited) {
        setCooldown(60);
        setNotice({
          kind: "error",
          text: "Supabase has temporarily rate-limited sign-in emails. Wait before requesting another link and check your inbox and spam folder for one already sent. Supabase’s built-in email service is limited to 2 emails per hour; configure custom SMTP in Supabase for reliable sign-in delivery.",
        });
        return;
      }

      console.error("Unable to send a wishes sign-in link.", error);
      setNotice({
        kind: "error",
        text: "We could not send a sign-in link. Check the email address and try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="wishes-auth-form" onSubmit={submit}>
      <p className="muted">{intro}</p>
      <div className="owner-auth-methods" role="group" aria-label="Sign-in method">
        <button
          className={`btn${method === "password" ? " btn-solid" : ""}`}
          type="button"
          aria-pressed={method === "password"}
          onClick={() => {
            setMethod("password");
            setNotice(null);
          }}
        >
          Password
        </button>
        <button
          className={`btn${method === "email" ? " btn-solid" : ""}`}
          type="button"
          aria-pressed={method === "email"}
          onClick={() => {
            setMethod("email");
            setNotice(null);
          }}
        >
          Email link
        </button>
      </div>
      <div>
        <label className="form-label" htmlFor="wishes-auth-email">
          Email address
        </label>
        <input
          className="field"
          id="wishes-auth-email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={busy}
        />
      </div>
      {method === "password" ? (
        <div>
          <label className="form-label" htmlFor="wishes-auth-password">
            Password
          </label>
          <input
            className="field"
            id="wishes-auth-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={busy}
          />
        </div>
      ) : null}
      {notice ? (
        <p
          className={notice.kind === "success" ? "form-success" : "form-error"}
          role={notice.kind === "success" ? "status" : "alert"}
        >
          {notice.text}
        </p>
      ) : null}
      <button
        className="btn btn-solid"
        type="submit"
        disabled={busy || (method === "email" && cooldown > 0)}
      >
        {busy
          ? method === "password"
            ? "Signing in…"
            : "Sending link…"
          : method === "password"
            ? "Sign in with password"
            : cooldown > 0
              ? `Please wait ${cooldown}s`
              : "Email me a secure sign-in link"}
      </button>
    </form>
  );
}

export function WishPasswordSettings() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<AuthNotice | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (password !== confirmation) {
      setNotice({ kind: "error", text: "The passwords do not match." });
      return;
    }

    setBusy(true);
    setNotice(null);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("The wishes database is not configured.");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setConfirmation("");
      setNotice({ kind: "success", text: "Your password has been saved." });
    } catch (error) {
      console.error("Unable to update the owner password.", error);
      setNotice({
        kind: "error",
        text: "We could not update your password. Please check the password requirements and try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="owner-password-settings" aria-labelledby="owner-password-title">
      <button
        className="btn"
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((value) => !value);
          setNotice(null);
        }}
      >
        {open ? "Cancel password update" : "Set or change password"}
      </button>
      {open ? (
        <form id="owner-password-form" className="wishes-auth-form mt-4" onSubmit={submit}>
          <div>
            <h2 id="owner-password-title">Owner account password</h2>
            <p className="muted mt-2">
              Choose a password to sign in on this or another device without requesting an email
              link.
            </p>
          </div>
          <div>
            <label className="form-label" htmlFor="owner-new-password">
              New password
            </label>
            <input
              className="field"
              id="owner-new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={busy}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="owner-confirm-password">
              Confirm new password
            </label>
            <input
              className="field"
              id="owner-confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              disabled={busy}
            />
          </div>
          {notice ? (
            <p
              className={notice.kind === "success" ? "form-success" : "form-error"}
              role={notice.kind === "success" ? "status" : "alert"}
            >
              {notice.text}
            </p>
          ) : null}
          <button className="btn btn-solid" type="submit" disabled={busy}>
            {busy ? "Saving password…" : "Save password"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
