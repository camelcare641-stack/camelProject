import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { status as statusLabel, anonymous } from "@/lib/content";
import { formatDate, formatMNT } from "@/lib/utils";
import type { Donation } from "@/types/database";

interface DonationsTableProps {
  donations: Donation[];
}

const variantFor = (s: Donation["status"]) =>
  s === "paid"
    ? "default"
    : s === "pending"
      ? "secondary"
      : "destructive";

export function DonationsTable({ donations }: DonationsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Огноо</TableHead>
          <TableHead>Хандивлагч</TableHead>
          <TableHead>Холбоо барих</TableHead>
          <TableHead className="text-right">Дүн</TableHead>
          <TableHead>Төлөв</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {donations.map((d) => (
          <TableRow key={d.id}>
            <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
              {formatDate(d.created_at)}
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {d.donor_name}
                {d.is_anonymous ? (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({anonymous})
                  </span>
                ) : null}
              </div>
              {d.message ? (
                <div className="text-xs text-muted-foreground">{d.message}</div>
              ) : null}
            </TableCell>
            <TableCell className="text-xs">
              {d.donor_email ? <div>{d.donor_email}</div> : null}
              {d.donor_phone ? <div>{d.donor_phone}</div> : null}
            </TableCell>
            <TableCell className="text-right font-mono">
              {formatMNT(d.amount)}
            </TableCell>
            <TableCell>
              <Badge variant={variantFor(d.status)}>
                {statusLabel[d.status]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
