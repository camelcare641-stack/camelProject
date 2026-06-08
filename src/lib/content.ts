// All visible Mongolian (Cyrillic) UI strings live here.

export const site = {
  name: "ТЭМЭЭ",
  org: "“Дадал Тэнцвэр” ТББ",
  fullName: "“ТЭМЭЭ” хүүхэд хөгжлийн төсөл",
  slogan: "Тэнцвэртэй нийгэм — Гэрэлтэй ирээдүй",
  hook: "Нэг тэмээ — Нэг хүүхдийн ирээдүй",
  description:
    "“ТЭМЭЭ” хүүхэд хөгжлийн төсөл, хотын захын хорооллын болон эмзэг бүлгийн хүүхдүүдийн боловсрол, сэтгэлзүй, хөгжлийг хамтдаа дэмжье.",
  unitPrice: 25000,
} as const;

// Default home-page content (headings, body, images). These are the fallbacks for
// the `home_*` keys in the `site_settings` table; an admin overrides any of them on
// the "Нүүр хуудас" admin page. A genuinely missing row falls back here; a seeded-
// yet-blank value renders blank (empty-means-empty), exactly like the other settings.
// Keys are flat (db key shape) so they map 1:1 to site_settings and the admin form.
export const homeDefaults = {
  // Hero
  home_hero_title: "Нэг тэмээ,\nнэг хүүхдийн ирээдүй.",
  home_hero_subtitle:
    "Хотын захын хорооллын болон зорилтот бүлгийн хүүхдүүдийн боловсрол, сэтгэлзүй, хөгжлийг хамтдаа бүтээе.",
  home_hero_image_url: "/camel-charm.png",
  // About — problem (paragraphs separated by a newline)
  home_problem_eyebrow: "Тулгамдсан асуудал",
  home_problem_title: "Хотын захын олон хүүхэд дэмжлэггүй өсөж байна.",
  home_problem_body:
    "Сэтгэлзүйн дарамт, гэр бүлийн хүчирхийлэл, боловсролын тэгш бус байдал, өөртөө итгэх итгэл сул, хөгжлийн боломж хомс, цахим болон нийгмийн сөрөг нөлөөлөл — эдгээр нь хотын захын хорооллын болон зорилтот бүлгийн хүүхдүүдийн өдөр тутмын бодит байдал.\nТэдэнд зөвхөн материаллаг тусламж бус, сэтгэлзүйн дэмжлэг, хөгжлийн орчин, хайр халамж, сонсох хүн хамгийн их хэрэгтэй.",
  home_problem_image_url: "",
  // About — solution (heading stays the org full name)
  home_solution_eyebrow: "Бидний шийдэл",
  home_solution_body:
    "Гар урлалын “Тэмээ” бэлэгдэл нь нэг хүүхдийн сургалт, сэтгэлзүйн зөвлөгөө, хөгжлийн үйл ажиллагаа, хамгаалал, урлаг спортын оролцоонд хүрэх дэмжлэг.",
  home_solution_price: "25,000₮",
  home_solution_price_caption: "= нэг хүүхдийн боломж",
  home_solution_image_url: "",
  // Camel section
  home_camel_eyebrow: "“Тэмээ” гэж юу вэ?",
  home_camel_title: "Гар урлалын бэлгэдэл, нэг хүүхдийн ирээдүйг гэрэлтүүлнэ.",
  home_camel_note:
    "25,000₮ ба түүнээс дээш хандивлавал бид таны тэмээг хүргэж болно.",
  home_camel_image_1_url: "/camel-charm.png",
  home_camel_image_2_url: "/bagCamel-bg.png",
  // News strip
  home_news_eyebrow: "Мэдээ",
  home_news_title: "Сүүлийн үеийн мэдээ",
  // Testimonials
  home_testimonials_eyebrow: "Дэмжигчид",
  home_testimonials_title: "Дэмжигчдийн үг",
  // Donate (bank transfer) section
  home_donate_eyebrow: "Өөр сонголт",
  home_donate_title: "Дансаар шилжүүлэх",
  home_donate_intro:
    "QPay биш, банкны аппаар шилжүүлэх боломжтой. Шилжүүлэг хийсний дараа доорх формоор нэрээ бүртгүүлснээр хандивлагчдын жагсаалтад нэгдэнэ.",
  home_qr_image_url: "",
  home_qr_caption:
    "QR кодыг өөрийн банкны аппаар уншуулан шилжүүлэг хийнэ үү.",
} as const;

export const nav = [
  { href: "/", label: "Нүүр" },
  { href: "/about", label: "Төслийн тухай" },
  { href: "/activities", label: "Үйл ажиллагаа" },
  { href: "/news", label: "Мэдээ" },
  { href: "/contact", label: "Холбоо барих" },
] as const;

export const howItWorks = [
  {
    step: 1,
    title: "“Тэмээ”-гээ сонгох",
    body: "Хэдэн “Тэмээ” авах вэ — тооцоологчийг ашиглан өөрийн дэмжлэгийн хэмжээг тогтооно. Нэг тэмээ 25,000₮.",
  },
  {
    step: 2,
    title: "Шилжүүлэг хийх",
    body: "Манай дансан дугаар руу шилжүүлэг хийнэ. Гүйлгээний утганд өөрийн нэр + утасны дугаараа бичнэ.",
  },
  {
    step: 3,
    title: "Нэрээ бүртгүүлэх",
    body: "Богино формоор нэрээ бүртгүүлснээр та хандивлагчдын жагсаалтад нэгдэж, төслийн дэмжигч болно.",
  },
] as const;

export const cta = {
  donate: "Хандив өгөх",
  details: "Дэлгэрэнгүй",
  activities: "Үйл ажиллагаа",
  copy: "Хуулах",
  copied: "Хууллаа",
  send: "Илгээх",
  sending: "Илгээж байна…",
  generateQr: "QR үүсгэх",
  generating: "Үүсгэж байна…",
  bankTransfer: "Дансаар шилжүүлэх",
  close: "Хаах",
  back: "Буцах",
} as const;

export const pagination = {
  prev: "Өмнөх",
  next: "Дараах",
  // e.g. "1 / 5" — товч, mobile-first
  page: (current: number, total: number) => `${current} / ${total}`,
} as const;

export const modal = {
  title: "Хандив өгөх",
  subtitle: "QPay-аар хандивлаж бэлгэдлийн тэмээгээ авна уу.",
  amountLabel: "Хандивын дүн",
  amountHint: "25,000₮ ба түүнээс дээш хандивлавал бэлгэдлийн тэмээ хүргэнэ.",
  amountPresets: [10_000, 25_000, 50_000, 100_000] as const,
  nameLabel: "Нэр",
  emailLabel: "И-мэйл",
  emailHint: "Баталгаажуулсан мэдээллийг энэ хаяг руу илгээнэ.",
  phoneLabel: "Утасны дугаар",
  phoneOptional: "(заавал биш)",
  phoneRequired: "(заавал — тэмээ хүргэхэд хэрэгтэй)",
  messageLabel: "Мессеж",
  messagePlaceholder: "Захиа үлдээх (заавал биш)",
  anonymousLabel: "Нэр нийтэд харуулахгүй",
  bankFallback: "Дансаар шилжүүлэх үү?",
  qrTitle: "QPay-аар төлөх",
  qrInstruction: "QPay аппаа нээж доорх QR кодыг уншуулна уу.",
  waiting: "Төлбөрийг хүлээж байна…",
  checkNow: "Төлбөрийг шалгах",
  checking: "Шалгаж байна…",
  stillPending: "Төлбөр хараахан ирээгүй байна. Дахин оролдоно уу.",
  successTitle: "Танд баярлалаа!",
  successBody: "Таны хандив амжилттай хүлээн авагдлаа.",
  successCharm: "Бид 3 хоногийн дотор танд утсаар холбогдон хүргэлтийн хаягийг тогтооно.",
  successMarquee: "Таны нэр хандивлагчдын жагсаалтад нэмэгдлээ.",
  expired: "QR кодын хугацаа дууссан. Шинээр үүсгэнэ үү.",
  failed: "Алдаа гарлаа. Дахин оролдоно уу.",
} as const;

export const bank = {
  name: "Хаан банк",
  holder: '"Дадал Тэнцвэр" ТББ',
  account: "[REPLACE — дансны дугаар]",
  note: "Гүйлгээний утганд өөрийн нэр + утасны дугаараа бичээрэй.",
} as const;

export const contactInfo = {
  phone: "[REPLACE — утас]",
  email: "[REPLACE — и-мэйл]",
  address: "[REPLACE — хаяг]",
} as const;

export const errors = {
  generic: "Алдаа гарлаа. Дахин оролдоно уу.",
  required: "Заавал бөглөнө үү.",
  nameShort: "Нэрээ бүрэн бичнэ үү.",
  contactShort: "Холбоо барих мэдээлэл оруулна уу.",
  bodyShort: "Зурвасаа бичнэ үү.",
} as const;
