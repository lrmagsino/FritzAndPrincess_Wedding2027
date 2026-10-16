"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { AirplaneTransition } from "./hero/AirplaneTransition";
import { OpenInvitationButton } from "./hero/OpenInvitationButton";
import { SplashAtmosphere, SplashLogoArtwork } from "./hero/SplashTravelEffects";
import { useReducedMotion } from "@/lib/motion";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOwnerRoute = pathname.startsWith("/owner/");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [visible, setVisible] = useState(!isOwnerRoute);
  const [departing, setDeparting] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const reducedMotion = useReducedMotion();
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
  const musicSrc = `${basePath}/audio/wedding-song.mp3`;

  useEffect(() => {
    if (isOwnerRoute) return;
    if (!visible) {
      window.scrollTo({ top: 0, behavior: "auto" });
      document.getElementById("top")?.focus({ preventScroll: true });
      return;
    }

    const dialog = dialogRef.current;
    dialog?.querySelector("button")?.focus();
  }, [isOwnerRoute, visible]);

  const finish = useCallback(() => {
    dialogRef.current?.close();
    setVisible(false);
  }, []);

  const openInvitation = () => {
    if (departing) return;
    const audio = audioRef.current;
    if (audio) {
      setMusicError(false);
      void audio.play().catch((error: unknown) => {
        console.error("Unable to play the wedding music.", error);
        setMusicPlaying(false);
        setMusicError(true);
      });
    }
    if (reducedMotion) {
      setDeparting(true);
      window.setTimeout(finish, 220);
      return;
    }
    setDeparting(true);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setMusicPlaying(false);
      return;
    }

    setMusicError(false);
    void audio.play().catch((error: unknown) => {
      console.error("Unable to play the wedding music.", error);
      setMusicPlaying(false);
      setMusicError(true);
    });
  };

  const keepFocusInCover = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab") return;

    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable.item(0);
    const last = focusable.item(focusable.length - 1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={musicSrc}
        preload="auto"
        onPlay={() => {
          setMusicPlaying(true);
          setMusicError(false);
        }}
        onPause={() => setMusicPlaying(false)}
        onEnded={() => setMusicPlaying(false)}
        onError={() => {
          console.error("The wedding music file could not be loaded.");
          setMusicPlaying(false);
          setMusicError(true);
        }}
      />
      <div inert={visible} aria-hidden={visible || undefined}>
        {children}
      </div>
      {!visible && !isOwnerRoute ? (
        <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2">
          {musicError ? (
            <p
              className="max-w-64 border border-silver-400 bg-burgundy-950 px-3 py-2 text-xs text-ivory"
              role="status"
            >
              Music could not be played. You can try again.
            </p>
          ) : null}
          <button
            type="button"
            className="label min-h-11 border border-silver-400 bg-burgundy-950 px-4 text-ivory"
            onClick={toggleMusic}
            aria-label={musicPlaying ? "Pause wedding music" : "Play wedding music"}
          >
            {musicPlaying ? "Pause music" : "Play music"}
          </button>
        </div>
      ) : null}
      {visible ? (
        <dialog
          ref={dialogRef}
          open
          className={`splash${departing ? " splash--leaving" : ""}`}
          aria-labelledby="splash-title"
          aria-describedby="splash-caption"
          aria-modal="true"
          onKeyDown={keepFocusInCover}
        >
          <SplashAtmosphere />
          <div className="splash-content">
            <p className="label splash-kicker">A celebration of love &amp; a life in motion</p>
            <SplashLogoArtwork />
            <h1 id="splash-title" className="sr-only">
              Fritz and Princess wedding invitation
            </h1>
            <p id="splash-caption" className="display splash-caption">
              A journey to forever begins here.
            </p>
            <OpenInvitationButton
              label={departing ? "Opening invitation" : "Tap to open invitation"}
              onClick={openInvitation}
              className="splash-open"
            />
          </div>
          {departing ? <AirplaneTransition onComplete={finish} /> : null}
          <p className="label splash-date">April 23, 2027 · Antipolo, Rizal</p>
        </dialog>
      ) : null}
    </>
  );
}
