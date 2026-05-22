"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { donateForm } from "@/lib/content";
import { cn, formatMNT } from "@/lib/utils";

interface AmountSelectorProps {
  value: number | "";
  onChange: (value: number | "") => void;
  presets?: readonly number[];
}

export function AmountSelector({
  value,
  onChange,
  presets = donateForm.presetAmounts,
}: AmountSelectorProps) {
  const isPreset = typeof value === "number" && presets.includes(value);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {presets.map((p) => (
          <Button
            key={p}
            type="button"
            variant={value === p ? "default" : "outline"}
            onClick={() => onChange(p)}
          >
            {formatMNT(p)}
          </Button>
        ))}
      </div>
      <Input
        type="number"
        min={1000}
        step={1000}
        placeholder={donateForm.customAmountPlaceholder}
        value={!isPreset && typeof value === "number" ? value : ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? "" : Number(v));
        }}
        className={cn(isPreset && "text-muted-foreground")}
      />
    </div>
  );
}
