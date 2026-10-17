import { copy } from "@/copy/en";

/**
 * A slow marquee of true brand facts. (Customer reviews go here once real
 * ones exist; invented testimonials would mislead buyers.)
 */
export function ValuesBand() {
  const items = copy.home.values;
  return (
    <section aria-label="Why Zohraé" className="overflow-hidden border-y border-line py-6">
      <div data-skew className="flex w-max">
        <div className="marquee flex w-max gap-12 motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center">
          {[0, 1].map((copyIndex) => (
            <ul key={copyIndex} className="flex shrink-0 gap-12" aria-hidden={copyIndex === 1}>
              {items.map((v) => (
                <li
                  key={v}
                  className="font-display flex items-center gap-12 whitespace-nowrap text-2xl italic md:text-3xl"
                >
                  {v}
                  <span className="text-ochre not-italic">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
