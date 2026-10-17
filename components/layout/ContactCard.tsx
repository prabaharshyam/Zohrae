import { WhatsAppIcon } from "@/components/ui/icons";
import { copy } from "@/copy/en";
import { business } from "@/lib/business";
import { whatsappHref } from "@/lib/format";

/** The studio's contact details; each line appears only once it's configured. */
export function ContactCard() {
  return (
    <div className="border border-line p-6">
      <p className="label text-fg-muted">{copy.contactPage.cardTitle}</p>
      <a
        href={whatsappHref(copy.footer.conciergeMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="label mt-5 inline-flex items-center gap-2 border-b border-current/40 pb-1 hover:border-current"
      >
        <WhatsAppIcon width={16} height={16} />
        {copy.footer.concierge}
      </a>
      {business.email && (
        <p className="mt-4 text-sm">
          <a href={`mailto:${business.email}`} className="border-b border-current/30 hover:border-current">
            {business.email}
          </a>
        </p>
      )}
      <p className="mt-4 text-sm text-fg-muted">{copy.contactPage.hours}</p>
      {(business.legalName || business.address) && (
        <address className="mt-4 text-sm not-italic text-fg-muted">
          {business.legalName && <span className="block">{business.legalName}</span>}
          {business.address}
        </address>
      )}
      {business.gstin && <p className="mt-2 text-xs text-fg-muted">GSTIN {business.gstin}</p>}
    </div>
  );
}
