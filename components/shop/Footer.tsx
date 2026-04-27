import Link from "next/link";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <p className="font-serif text-xl tracking-widest uppercase text-offwhite mb-4">
              The Vintage Prague
            </p>
            <p className="text-muted text-sm leading-relaxed mb-6">
              High-end clothing and accessories carefully curated from Japan and across Asia —
              brought to the heart of Prague.
            </p>
            <a
              href="https://www.instagram.com/thevintageprague/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted text-xs tracking-widest uppercase hover:text-offwhite transition-colors"
            >
              <InstagramIcon />
              <span>Instagram</span>
            </a>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-offwhite mb-4">Shop</p>
            <ul className="space-y-2">
              {["Bags", "Clothing", "Shoes", "Wallets"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat.toLowerCase()}`}
                    className="text-muted text-sm hover:text-offwhite transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-offwhite mb-4">Info</p>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-muted text-sm hover:text-offwhite transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-muted text-sm hover:text-offwhite transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted text-sm hover:text-offwhite transition-colors">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted text-sm hover:text-offwhite transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-offwhite mb-4">Contact</p>
            <ul className="space-y-3">
              <li className="text-muted text-sm leading-relaxed">
                Truhlářská 1110/4<br />
                Prague 1
              </li>
              <li>
                <a
                  href="tel:+420777216736"
                  className="text-muted text-sm hover:text-offwhite transition-colors tracking-wide"
                >
                  +420 777 216 736
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/thevintageprague/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted text-sm hover:text-offwhite transition-colors"
                >
                  <InstagramIcon />
                  <span>@thevintageprague</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <p className="text-muted text-xs tracking-widest">
              &copy; {new Date().getFullYear()} The Vintage Prague. All rights reserved.
            </p>
            <Link href="/privacy" className="text-muted text-xs hover:text-offwhite transition-colors">
              Privacy Policy
            </Link>
          </div>
          <a
            href="https://www.instagram.com/thevintageprague/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-offwhite transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
