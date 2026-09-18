import Link from "next/link";
import { Gift, Instagram, Phone, Mail, MapPin, Clock } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/occasions", label: "Occasions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/returns", label: "Return & Refund" },
  { href: "/faq", label: "FAQ" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
];

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.12h-.01c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.14.82.84-3.06-.2-.31a8.21 8.21 0 0 1-1.26-4.32c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.82 2.42a8.16 8.16 0 0 1 2.41 5.81c0 4.54-3.69 8.2-8.14 8.2zm4.5-6.15c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29z" />
    </svg>
  );
}

const socialLinks = [
  { Icon: Instagram, href: "https://www.instagram.com/little_gifts_shop44?stkn=czQ1bmxza2p1aGJn", label: "Instagram" },
  { Icon: GoogleIcon, href: "https://share.google/6RgrIVyJj9scNkjtV", label: "Google" },
  { Icon: WhatsAppIcon, href: "https://wa.me/message/2OIB5QEVRMNMH1", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary-dark pt-16 text-white/80">
      <div className="container-x grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gold">
              <Gift size={17} />
            </span>
            <span className="font-heading text-lg font-semibold text-white">Little Gift Shop</span>
          </div>
          <p className="font-script text-lg text-lavender">Small Gifts · Big Smiles</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
            We believe that every gift tells a story. Let us help you make yours special.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-colors hover:bg-gold hover:text-primary-dark"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Customer Service
          </h4>
          <ul className="space-y-2.5 text-sm">
            {serviceLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-gold" /> 0313 2906720
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-gold" /> support@littlegiftshop.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-gold" /> Hyderabad, Pakistan
            </li>
            <li className="flex items-center gap-2">
              <Clock size={14} className="text-gold" /> Always - open
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-x flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} Little Gift Shop. All rights reserved.</span>
          <span>Made with ♥ for special moments</span>
        </div>
      </div>
    </footer>
  );
}