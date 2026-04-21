export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <p className="text-xs tracking-[0.4em] uppercase text-muted mb-6">Contact</p>
        <h1 className="font-serif text-4xl md:text-5xl text-offwhite mb-8 leading-tight">
          Visit Us
        </h1>
        <p className="text-muted text-sm leading-relaxed mb-16 max-w-md">
          Come in anytime — you are always welcome to browse at your own pace.
          Collaboration and wholesale enquiries are warmly welcomed.
        </p>

        <div className="space-y-12">
          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">Address</p>
            <p className="font-serif text-xl text-offwhite leading-relaxed">
              Truhlářská 1110/4<br />
              Prague 1
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-xs tracking-[0.3em] uppercase text-muted mb-4">Phone</p>
            <a
              href="tel:+420777216736"
              className="font-serif text-xl text-offwhite hover:text-burgundy-vivid transition-colors duration-200"
            >
              +420 777 216 736
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
