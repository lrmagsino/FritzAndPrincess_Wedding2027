"use client";

import Image from "next/image";
import { useState } from "react";
import { asset } from "@/lib/assets";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

const ACCOUNT_NUMBER = "0319305276";

export function GiftSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT_NUMBER);
      setCopyStatus("copied");
    } catch (error) {
      console.error("Unable to copy the BPI account number.", error);
      setCopyStatus("error");
    }
  };

  return (
    <Section id="gifts" tone="light" eyebrow="Gifts" title="Your presence is the gift" narrow>
      <Reveal className="text-center">
        <p className="text-lg">
          Having you with us is the greatest gift. For those who wish to give, a monetary gift may
          be sent using the details below.
        </p>
        <div className="mx-auto mt-10 max-w-md">
          <button
            type="button"
            className="btn btn-solid gift-toggle"
            aria-expanded={isOpen}
            aria-controls="gift-details"
            onClick={() => {
              setIsOpen((open) => !open);
              setCopyStatus("idle");
            }}
          >
            {isOpen ? "Close gift details" : "View gift details"}
          </button>
          {isOpen ? (
            <article id="gift-details" className="card gift-details">
              <h3 className="label eyebrow mb-2">BPI · FP 042327</h3>
              <p className="muted mt-0 text-sm">
                Tap the QR code or use the button below to copy the account number.
              </p>
              <button
                type="button"
                className="gift-qr-button"
                onClick={copyAccountNumber}
                aria-label={`Copy BPI account number ${ACCOUNT_NUMBER}`}
              >
                <Image
                  src={asset("/gifts/bpi-qr.png")}
                  alt="BPI InstaPay QR code. Tapping this image copies the account number."
                  width={768}
                  height={863}
                  sizes="(max-width: 640px) 80vw, 360px"
                  className="gift-qr-image"
                />
              </button>
              <p className="label gift-account-label">Account number</p>
              <p className="display gift-account-number">{ACCOUNT_NUMBER}</p>
              <button type="button" className="btn gift-copy-button" onClick={copyAccountNumber}>
                Copy account number
              </button>
              <p className="gift-copy-status" role="status" aria-live="polite">
                {copyStatus === "copied"
                  ? "Account number copied."
                  : copyStatus === "error"
                    ? "Could not copy automatically. You can select and copy the account number above."
                    : ""}
              </p>
              <p className="muted gift-fee-note">Transfer fees may apply.</p>
            </article>
          ) : null}
        </div>
      </Reveal>
    </Section>
  );
}
