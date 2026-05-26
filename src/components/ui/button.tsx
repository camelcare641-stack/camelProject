import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2",
    "rounded-sm border border-transparent bg-clip-padding",
    "font-semibold uppercase tracking-[0.12em] no-underline",
    "transition-[background-color,color,border-color,box-shadow,transform] outline-none select-none",
    "focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/30",
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "hover:no-underline",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-clay text-white hover:bg-clay-dark",
        cta: "bg-teal text-white hover:bg-teal-dark focus-visible:border-teal focus-visible:ring-teal/30",
        outline:
          "border-border text-charcoal hover:border-charcoal hover:bg-paper",
        secondary:
          "bg-paper text-charcoal hover:bg-paper hover:text-clay",
        ghost: "text-charcoal hover:text-clay",
        link: "rounded-none border-0 px-0 text-clay normal-case tracking-normal underline-offset-4 hover:underline",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-5 text-[12px]",
        sm: "h-9 px-4 text-[11px]",
        lg: "h-14 px-8 text-[13px]",
        xl: "h-14 px-9 text-sm",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  nativeButton,
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  // When rendering as a non-button element (e.g. <Link>), Base UI requires
  // `nativeButton={false}` to drop native <button> semantics. Auto-default to
  // false whenever a `render` prop is supplied so callers don't have to remember.
  const resolvedNativeButton = nativeButton ?? render === undefined;
  return (
    <ButtonPrimitive
      data-slot="button"
      nativeButton={resolvedNativeButton}
      render={render}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
