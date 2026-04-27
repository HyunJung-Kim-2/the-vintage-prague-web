export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <p className="text-xs tracking-[0.4em] uppercase text-muted mb-6">Legal</p>
        <h1 className="font-serif text-4xl md:text-5xl text-offwhite mb-16 leading-tight">
          Privacy Policy
        </h1>

        <div className="space-y-10 text-sm text-muted leading-relaxed">

          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-offwhite mb-4">Who We Are</p>
            <p>
              The Vintage Prague is a curated vintage clothing and accessories shop located at
              Truhlářská 1110/4, Prague 1, Czech Republic. When you use our website or make
              a purchase, we collect and process certain personal data. This policy explains
              what we collect, why, and your rights under the GDPR.
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-offwhite mb-4">What We Collect</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><span className="text-offwhite">Account data</span> — name and email address when you create an account.</li>
              <li><span className="text-offwhite">Order data</span> — shipping address, items purchased, and payment details. Payment is processed securely by Stripe; we do not store card numbers.</li>
              <li><span className="text-offwhite">Usage data</span> — anonymous page view statistics via Vercel Analytics (no cookies, no personal identifiers).</li>
              <li><span className="text-offwhite">Cookies</span> — essential cookies only: your shopping cart and login session. No advertising or tracking cookies.</li>
            </ul>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-offwhite mb-4">Why We Use It</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>To fulfil and ship your orders.</li>
              <li>To send order confirmation and shipping notifications.</li>
              <li>To maintain your account and order history.</li>
              <li>To comply with legal obligations (accounting, tax).</li>
            </ul>
            <p className="mt-4">
              We do not sell, rent, or share your personal data with third parties for
              marketing purposes.
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-offwhite mb-4">Third-Party Services</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><span className="text-offwhite">Stripe</span> — payment processing. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-offwhite/60 hover:text-offwhite transition-colors underline">Stripe Privacy Policy</a></li>
              <li><span className="text-offwhite">Supabase</span> — database and authentication, hosted in the EU.</li>
              <li><span className="text-offwhite">Vercel</span> — website hosting and anonymous analytics.</li>
            </ul>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-offwhite mb-4">Your Rights (GDPR)</p>
            <p className="mb-3">As an EU resident you have the right to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data ("right to be forgotten").</li>
              <li>Object to or restrict processing.</li>
              <li>Data portability.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact us at{" "}
              <a href="tel:+420777216736" className="text-offwhite hover:text-burgundy-vivid transition-colors">
                +420 777 216 736
              </a>
              {" "}or visit us in store.
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-offwhite mb-4">Data Retention</p>
            <p>
              Order and account data is retained for 5 years to comply with Czech accounting
              law. You may request deletion of your account at any time; order records required
              for legal compliance will be anonymised rather than deleted.
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-offwhite mb-4">Changes</p>
            <p>
              We may update this policy from time to time. The current version is always
              available on this page.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
