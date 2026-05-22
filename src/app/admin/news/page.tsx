import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import { admin } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { News } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select(
      "id, slug, title, content, cover_image_url, published, published_at, created_at",
    )
    .order("created_at", { ascending: false });

  const posts = (data as News[] | null) ?? [];

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">{admin.manageNews}</h1>
      {/* TODO: server action + dialog to create/edit news posts (validate
          with `newsSchema`). On publish, set published=true and stamp
          published_at = now(). */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Гарчиг</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Огноо</TableHead>
              <TableHead>Төлөв</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell className="font-mono text-xs">{p.slug}</TableCell>
                <TableCell className="text-xs">
                  {formatDate(p.published_at ?? p.created_at)}
                </TableCell>
                <TableCell>
                  <Badge variant={p.published ? "default" : "secondary"}>
                    {p.published ? "Нийтлэгдсэн" : "Ноорог"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
