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

interface WishEmailLoginProps {
  redirectPath: string;
  buttonLabel?: string;
  intro?: string;
}

export function WishEmailLogin({
  redirectPath,
  buttonLabel = "Email me a secure sign-in link",
  intro = "Enter your email and we’ll send you a secure sign-in link. No password is needed.",
}: WishEmailLoginProps) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || cooldown > 0) return;

    setBusy(true);
    setNotice(null);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setNotice({ kind: "error", text: "Wishes authentication is not configured yet." });
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
          text: "Too many sign-in emails were requested. Please wait a minute before trying again, and check your inbox and spam folder for an earlier link.",
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
      {notice ? (
        <p
          className={notice.kind === "success" ? "form-success" : "form-error"}
          role={notice.kind === "success" ? "status" : "alert"}
        >
          {notice.text}
        </p>
      ) : null}
      <button className="btn btn-solid" type="submit" disabled={busy || cooldown > 0}>
        {busy ? "Sending link…" : cooldown > 0 ? `Please wait ${cooldown}s` : buttonLabel}
      </button>
    </form>
  );
}
