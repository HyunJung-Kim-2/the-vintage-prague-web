const items = [
  "New Arrivals",
  "Vintage Japan",
  "The Vintage Prague",
  "Curated in Asia",
  "Bags · Clothing · Shoes",
  "Truhlářská 1110/4",
];

export default function Marquee() {
  const text = [...items, ...items]; // duplicate for seamless loop

  return (
    <div className="overflow-hidden border-y border-border py-3 my-0 select-none">
      <div className="flex whitespace-nowrap marquee-track">
        {text.map((item, i) => (
          <span key={i} className="text-[10px] tracking-[0.4em] uppercase text-muted mx-8">
            {item}
            <span className="mx-8 text-burgundy-vivid">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
