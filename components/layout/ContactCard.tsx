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
      <div className="mt-6 border-t border-line pt-5">
        <p className="label text-fg-muted">{copy.contactPage.businessTitle}</p>
        <p className="mt-3 text-sm">{copy.contactPage.brandOf(business.legalName)}</p>
        <address className="mt-3 text-sm not-italic text-fg-muted">
          <span className="block font-medium text-fg">{business.legalName}</span>
          {business.address && <span className="block">{business.address}</span>}
          {business.gstin && <span className="block">GSTIN {business.gstin}</span>}
        </address>
      </div>
    </div>
  );
}
