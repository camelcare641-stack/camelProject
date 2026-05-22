import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { partners as t } from "@/lib/content";
import type { Partner } from "@/types/database";

interface PartnerGridProps {
  partners: Partner[];
}

export function PartnerGrid({ partners }: PartnerGridProps) {
  if (partners.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">{t.empty}</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {partners.map((p) => (
        <Card key={p.id}>
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            {p.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.logo_url}
                alt={p.name}
                className="h-16 w-16 object-contain"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-md bg-muted text-xs text-muted-foreground">
                {p.name.slice(0, 2)}
              </div>
            )}
            <div className="space-y-1">
              <div className="font-medium">{p.name}</div>
              {p.description ? (
                <div className="text-xs text-muted-foreground">
                  {p.description}
                </div>
              ) : null}
            </div>
            {p.website_url ? (
              <Link
                href={p.website_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs underline"
              >
                {t.visitSite}
              </Link>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
