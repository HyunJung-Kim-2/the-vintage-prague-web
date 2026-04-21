export default function ShippingPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <p className="text-xs tracking-[0.4em] uppercase text-muted mb-6">Policies</p>
        <h1 className="font-serif text-4xl md:text-5xl text-offwhite mb-16 leading-tight">
          Shipping &amp; Returns
        </h1>

        <div className="space-y-12">
          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">Shipping</p>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>We ship across Europe. Orders are carefully packed and dispatched within 2–3 business days.</p>
              <p>Standard delivery: <span className="text-offwhite">3–7 business days</span></p>
              <p>Express delivery: <span className="text-offwhite">1–3 business days</span> (available at checkout)</p>
              <p>Free shipping on orders over <span className="text-offwhite">€150</span>.</p>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">Returns</p>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                As a curated vintage shop, each piece is one of a kind. We describe the condition
                of every item as accurately as possible.
              </p>
              <p>
                Returns are accepted within <span className="text-offwhite">14 days</span> of
                delivery if the item significantly differs from its description.
                Please contact us before returning.
              </p>
              <p>Items must be returned in the same condition as received.</p>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">Condition Grades</p>
            <ul className="space-y-3 text-sm">
              {[
                { grade: "New", desc: "Brand new, never worn, with or without tags." },
                { grade: "S Grade", desc: "Like new. Minimal to no signs of use." },
                { grade: "A Grade", desc: "Gently used. Light wear, no notable flaws." },
                { grade: "B Grade", desc: "Visible signs of wear. Minor flaws noted in the product description." },
              ].map(({ grade, desc }) => (
                <li key={grade} className="flex gap-4">
                  <span className="text-offwhite w-20 shrink-0">{grade}</span>
                  <span className="text-muted">{desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">Questions?</p>
            <p className="text-sm text-muted leading-relaxed">
              Reach us at{" "}
              <a href="tel:+420777216736" className="text-offwhite hover:text-burgundy-vivid transition-colors">
                +420 777 216 736
              </a>
              {" "}or visit us in store at Truhlářská 1110/4, Prague 1.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
