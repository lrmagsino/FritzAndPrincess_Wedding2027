import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Control | Fritz & Princess",
  robots: { index: false, follow: false },
};

export default function OwnerWishesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
