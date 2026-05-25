"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Item = { q: string; a: string };

export function FAQ({ items }: { items: Item[] }) {
  return (
    <Accordion
      defaultValue={["0"]}
      className="divide-y divide-border border-y border-border"
    >
      {items.map((it, i) => (
        <AccordionItem
          key={i}
          value={String(i)}
          className="border-b-0"
        >
          <AccordionTrigger className="py-5 font-display text-base font-semibold text-charcoal hover:no-underline sm:text-lg">
            {it.q}
          </AccordionTrigger>
          <AccordionContent className="pr-8 pb-6 text-base leading-relaxed text-charcoal-muted">
            {it.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
