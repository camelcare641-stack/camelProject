"use client";

import { useState } from "react";
import Image from "next/image";
import { MenuIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminNav } from "@/features/admin/components/admin-nav";
import { signOut } from "@/features/admin/actions";

export function AdminMobileBar({ email }: { email?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2.5">
        <Image
          src="/logo-mark.png"
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
        />
        <span className="font-display text-base font-bold tracking-tight text-charcoal">
          Удирдлага
        </span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Цэс">
              <MenuIcon className="size-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="flex w-full max-w-xs flex-col">
          <SheetTitle className="sr-only">Удирдлагын цэс</SheetTitle>
          <div className="flex items-center gap-2.5 px-4 pb-4 pt-5">
            <Image
              src="/logo-mark.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="font-display text-lg font-bold tracking-tight text-charcoal">
              Удирдлага
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-3">
            <AdminNav onNavigate={() => setOpen(false)} />
          </div>
          <div className="border-t border-border px-4 py-4">
            {email && (
              <p className="mb-2 truncate text-xs text-charcoal-muted">{email}</p>
            )}
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm" className="w-full">
                <LogOut className="size-4" />
                Гарах
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
