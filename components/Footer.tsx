import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Twitter, Facebook } from 'lucide-react'

const SHOP_LINKS = [
  { label: "Men's", href: '/shop?category=mens' },
  { label: "Women's", href: '/shop?category=womens' },
  { label: 'Kids', href: '/shop?category=kids' },
  { label: 'African Collection', href: '/shop?category=african' },
  { label: 'Active Wear', href: '/shop?category=activewear' },
  { label: 'Accessories', href: '/shop?category=accessories' },
]

const HELP_LINKS = [
  { label: 'About us', href: '/about' },
  { label: 'Contact us', href: '/contact' },
  { label: 'My account', href: '/account' },
  { label: 'Size guide', href: '/contact' },
  { label: 'FAQ', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-cgc-ink text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo.jpg"
                alt="Cary Grant Clothing"
                width={48}
                height={48}
                className="object-contain brightness-0 invert opacity-90"
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              Premium Canadian streetwear for the whole family. Est. 2002, Barrie, Ontario.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/cgclthn" target="_blank" rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors">
                <Instagram size={15} />
              </a>
              <a href="https://twitter.com/CG021" target="_blank" rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors">
                <Twitter size={15} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors">
                <Facebook size={15} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors text-xs font-bold">
                TK
              </a>
              <a href="https://snapchat.com" target="_blank" rel="noreferrer"
                aria-label="Snapchat"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors text-xs font-bold">
                SC
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(link => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Help</h4>
            <ul className="space-y-2.5">
              {HELP_LINKS.map(link => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Find us */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Find us</h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-white/60 leading-relaxed">
                54 Dunlop Street West,<br />
                Main Floor,<br />
                Barrie, Ontario
              </li>
              <li>
                <a href="tel:+17057171073"
                  className="text-sm text-white/60 hover:text-white transition-colors">
                  +1 705-717-1073
                </a>
              </li>
              <li>
                <a href="mailto:cary@carygrantclothing.com"
                  className="text-sm text-white/60 hover:text-white transition-colors">
                  cary@carygrantclothing.com
                </a>
              </li>
              <li className="text-sm text-white/60">
                Mon–Sat: 10am – 7pm<br />
                Sun: 11am – 5pm
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Cary Grant Clothing. All rights reserved.
          </p>
          <p className="text-xs text-white/30">Made in Canada 🇨🇦</p>
        </div>
      </div>
    </footer>
  )
}
