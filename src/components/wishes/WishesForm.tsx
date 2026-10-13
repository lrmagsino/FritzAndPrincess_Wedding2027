"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { createWishOwnershipToken, saveWishOwnershipToken } from "@/lib/wishOwnership";
import { getSupabaseClient } from "@/lib/supabase";

const MAX_NAME = 60;
const MAX_MESSAGE = 1000;

type FieldErrors = Partial<Record<"name" | "message", string>>;

export function WishesForm() {
  const id = useId();
  const submitting = useRef(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;

    const next: FieldErrors = {};
    const guestName = name.trim();
    const wish = message.trim();
    if (!guestName) next.name = "Please enter your name.";
    else if (guestName.length > MAX_NAME)
      next.name = `Please keep your name under ${MAX_NAME + 1} characters.`;
    if (!wish) next.message = "Please add your wish or prayer.";
    else if (wish.length > MAX_MESSAGE)
      next.message = `Please keep your message under ${MAX_MESSAGE + 1} characters.`;
    setErrors(next);
    setNotice(null);

    if (Object.keys(next).length > 0) return;
    if (honeypot) {
      setNotice({ kind: "error", text: "This message could not be submitted. Please try again." });
      return;
    }

    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (error) {
      console.error("Unable to initialize the wishes database.", error);
      setNotice({
        kind: "error",
        text: "Wishes are temporarily unavailable. Please try again later.",
      });
      return;
    }
    if (!supabase) {
      setNotice({
        kind: "error",
        text: "Wishes are temporarily unavailable. Please try again later.",
      });
      return;
    }

    submitting.current = true;
    setBusy(true);
    try {
      const token = createWishOwnershipToken();
      const { data: wishId, error } = await supabase.rpc("submit_wish", {
        p_guest_name: guestName,
        p_message: wish,
        p_author_token: token,
      });
      if (error) throw error;
      if (!wishId) throw new Error("The wishes service did not return a message ID.");

      try {
        saveWishOwnershipToken(wishId, token);
      } catch (storageError) {
        console.error("Unable to save wish ownership access in this browser.", storageError);
        setNotice({
          kind: "error",
          text: "Your message was posted, but this browser could not save your private edit access. Please allow local storage in this browser to manage your message.",
        });
        setName("");
        setMessage("");
        setHoneypot("");
        setErrors({});
        window.dispatchEvent(new CustomEvent("wedding-wish-submitted", { detail: { wishId } }));
        return;
      }

      setName("");
      setMessage("");
      setHoneypot("");
      setErrors({});
      setNotice({
        kind: "success",
        text: "Thank you for sharing your beautiful wish or prayer. It is now visible to everyone.",
      });
      window.dispatchEvent(new CustomEvent("wedding-wish-submitted", { detail: { wishId } }));
    } catch (error) {
      console.error("Unable to submit a wedding wish.", error);
      setNotice({
        kind: "error",
        text: "We could not submit your message. Please try again.",
      });
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <form className="wishes-form" onSubmit={submit} noValidate aria-label="Wishes and prayers form">
      <p className="wishes-public-note">
        Wishes appear publicly as soon as they are sent. You can manage your own messages from this
        browser.
      </p>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field blank</label>
        <input
          id={`${id}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor={`${id}-name`} className="form-label">
          Name
        </label>
        <input
          id={`${id}-name`}
          className="field"
          name="guest_name"
          type="text"
          autoComplete="name"
          maxLength={MAX_NAME}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
          disabled={busy}
        />
        {errors.name ? (
          <p className="error-text" id={`${id}-name-error`}>
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${id}-message`} className="form-label">
          Wishes and Prayers
        </label>
        <textarea
          id={`${id}-message`}
          className="field min-h-36 resize-y"
          name="message"
          rows={5}
          maxLength={MAX_MESSAGE}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`${id}-message-count${errors.message ? ` ${id}-message-error` : ""}`}
          disabled={busy}
        />
        <p className="form-hint" id={`${id}-message-count`}>
          {message.length}/{MAX_MESSAGE} characters
        </p>
        {errors.message ? (
          <p className="error-text" id={`${id}-message-error`}>
            {errors.message}
          </p>
        ) : null}
      </div>

      {notice ? (
        <p
          className={notice.kind === "success" ? "form-success" : "form-error"}
          role={notice.kind === "success" ? "status" : "alert"}
        >
          {notice.text}
        </p>
      ) : null}
      <button type="submit" className="btn btn-solid" disabled={busy}>
        {busy ? "Sending…" : "Send wish"}
      </button>
    </form>
  );
}
