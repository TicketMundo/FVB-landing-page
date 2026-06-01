import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const socials = [
  { Icon: Facebook, href: "https://www.facebook.com/ticketmundo", label: "Facebook" },
  { Icon: Instagram, href: "https://instagram.com/ticketmundo_ve", label: "Instagram" },
  { Icon: Twitter, href: "https://twitter.com/Ticketmundo_ve", label: "X" },
  { Icon: Youtube, href: "https://www.youtube.com/@TicketmundoVe", label: "YouTube" },
];

export function FooterSection() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 py-5 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0D0D0D]">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Left: socials + support */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
            {/* TikTok — Lucide doesn't have it, render text link */}
            <a
              href="https://www.tiktok.com/@ticketmundo_ve"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors text-[13px] sm:text-sm font-bold"
              aria-label="TikTok"
            >
              TikTok
            </a>
          </div>
          <span className="text-gray-300 dark:text-white/20 hidden sm:block">|</span>
          <a
            href="/help"
            className="text-[13px] sm:text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Soporte al Cliente
          </a>
        </div>

        {/* Right: TM logo — light/dark variants */}
        <img
          src="/images/ticketmundo-by-yummy.svg"
          alt="Ticketmundo by Yummy"
          className="h-8 w-auto opacity-80 dark:hidden"
        />
        <img
          src="/images/ticketmundo-by-yummy-b.svg"
          alt="Ticketmundo by Yummy"
          className="h-8 w-auto opacity-80 hidden dark:block"
        />
      </div>
    </footer>
  );
}
