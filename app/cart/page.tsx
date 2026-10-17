import type { Metadata } from "next";
import { CartContents } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "Your Collection",
  description: "The pieces in your bag, ready for secure checkout.",
};

/** The bag as a page (the drawer is the usual way in). */
export default function CartPage() {
  return (
    <div className="gutter mx-auto flex max-w-3xl flex-col pt-[calc(var(--header-h)+8vh)] pb-24">
      <CartContents page />
    </div>
  );
}
