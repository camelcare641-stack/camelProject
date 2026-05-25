import "server-only";
import nodemailer from "nodemailer";
import { formatMNT } from "@/lib/utils";
import { site } from "@/lib/content";

type SendArgs = {
  to: string;
  name: string;
  amount: number;
  willShipCharm: boolean;
};

let transport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter {
  if (transport) return transport;
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transport;
}

export async function sendThankYouEmail({
  to,
  name,
  amount,
  willShipCharm,
}: SendArgs): Promise<void> {
  const from = process.env.SMTP_FROM ?? "noreply@example.com";
  const subject = `Танд баярлалаа — ${site.name}`;

  const charmNote = willShipCharm
    ? `<p>Та <strong>25,000₮ ба түүнээс дээш</strong> хандивласан тул бид танд бэлгэдлийн <strong>"Тэмээ"</strong>-г хүргэх болно. Манай ажилтан <strong>3 хоногийн дотор</strong> танд утсаар холбогдон хүргэлтийн хаягийг тогтооно.</p>`
    : `<p>Таны нэр хандивлагчдын жагсаалтад нэмэгдсэн.</p>`;

  const html = `
  <div style="font-family: 'Manrope', system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #2E2A26;">
    <h1 style="font-family: 'Alegreya', Georgia, serif; color: #9C4F22; font-size: 28px; margin: 0 0 16px;">Танд баярлалаа, ${escapeHtml(name)}!</h1>
    <p style="font-size: 16px; line-height: 1.6;">Таны <strong>${formatMNT(amount)}</strong> хандив амжилттай хүлээн авагдлаа.</p>
    ${charmNote}
    <p style="font-size: 16px; line-height: 1.6;">Энэхүү хандив тань хотын захын хорооллын болон эмзэг бүлгийн хүүхдүүдийн сэтгэлзүйн зөвлөгөө, боловсрол, хөгжлийн дэмжлэгт зарцуулагдана.</p>
    <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #E6E0D4; font-size: 14px; color: #6B6258;">
      "Нэг тэмээ — Нэг хүүхдийн ирээдүй"<br/>
      ${escapeHtml(site.org)}
    </p>
  </div>
  `;

  const text = `Танд баярлалаа, ${name}!\n\nТаны ${formatMNT(amount)} хандив амжилттай хүлээн авагдлаа.\n${willShipCharm ? "\nТа 25,000₮ ба түүнээс дээш хандивласан тул бид танд бэлгэдлийн \"Тэмээ\"-г хүргэх болно. Манай ажилтан 3 хоногийн дотор танд утсаар холбогдон хүргэлтийн хаягийг тогтооно.\n" : "\nТаны нэр хандивлагчдын жагсаалтад нэмэгдсэн.\n"}\n"Нэг тэмээ — Нэг хүүхдийн ирээдүй"\n${site.org}`;

  await getTransport().sendMail({ from, to, subject, html, text });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
