import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="font-serif text-xl tracking-widest uppercase text-offwhite mb-4">
              The Vintage Prague
            </p>
            <p className="text-muted text-sm leading-relaxed">
              Curated vintage fashion from the heart of Prague.
              Each piece tells a story.
            </p>
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
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted text-xs tracking-widest">
            &copy; {new Date().getFullYear()} The Vintage Prague. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
