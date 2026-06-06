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
