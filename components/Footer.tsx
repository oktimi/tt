import Link from 'next/link';
import { getTranslations } from '@/lib/i18n';

const t = getTranslations('zh');

const footerLinks = {
  categories: [
    { label: t.nav.football, href: '/category/football' },
    { label: t.nav.basketball, href: '/category/basketball' },
    { label: t.nav.tennis, href: '/category/tennis' },
  ],
  leagues: [
    { label: 'NBA', href: '/league/nba' },
    { label: 'Premier League', href: '/league/premier-league' },
    { label: 'La Liga', href: '/league/la-liga' },
  ],
  about: [
    { label: t.footer.aboutUs, href: '/about' },
    { label: t.footer.contact, href: '/contact' },
  ],
  social: [
    { label: t.footer.weibo, href: '#' },
    { label: t.footer.wechat, href: '#' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-light dark:border-border-dark mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="section-title mb-4">{t.footer.categories}</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nav-link text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-title mb-4">{t.footer.leagues}</h3>
            <ul className="space-y-3">
              {footerLinks.leagues.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nav-link text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-title mb-4">{t.footer.about}</h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nav-link text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-title mb-4">{t.footer.followUs}</h3>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="nav-link text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-horizontal mt-12 mb-8" />

        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          {currentYear} {t.site.name}. {t.footer.copyright}.
        </div>
      </div>
    </footer>
  );
}
