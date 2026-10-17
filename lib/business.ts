import { copy } from "@/copy/en";

/**
 * The business's real-world details, set in Vercel (see DEPLOY.md). Pages
 * show each one only when it's filled in, so nothing invented ever appears.
 */
export const business = {
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || "",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  gstin: process.env.NEXT_PUBLIC_GSTIN || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || copy.contact.whatsapp,
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
};
