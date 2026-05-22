// All user-facing Mongolian (Cyrillic) UI strings live here.
// Components must import from this file instead of hardcoding text inline.

export const site = {
  name: "Хандив",
  tagline: "Хамтдаа өөрчилье",
  description:
    "Бидний хамтын зорилгод нэгдэж, тусламж хэрэгтэй хүмүүст хүрэх боломжийг бүтээцгээе.",
} as const;

export const nav = {
  home: "Нүүр",
  donate: "Хандив өгөх",
  transparency: "Тайлан",
  partners: "Хамтрагчид",
  news: "Мэдээ",
  admin: "Удирдлага",
} as const;

export const home = {
  heroCtaDonate: "Хандив өгөх",
  heroCtaLearn: "Дэлгэрэнгүй",
  goalsTitle: "Зорилго",
  advantagesTitle: "Давуу тал",
  bankAccountTitle: "Дансны мэдээлэл",
  bankName: "Банк",
  accountNumber: "Дансны дугаар",
  accountHolder: "Хүлээн авагч",
  recentDonorsTitle: "Сүүлийн хандивлагчид",
  raised: "Цугласан",
  goal: "Зорилго",
  donorCount: "Хандивлагчид",
  progress: "Гүйцэтгэл",
} as const;

export const donateForm = {
  title: "Хандив өгөх",
  subtitle: "Таны хувь нэмэр бидний зорилгод чухал юм.",
  nameLabel: "Овог нэр",
  namePlaceholder: "Таны нэр",
  emailLabel: "И-мэйл хаяг",
  emailPlaceholder: "name@example.com",
  phoneLabel: "Утасны дугаар",
  phonePlaceholder: "9999-9999",
  amountLabel: "Хандивлах дүн",
  customAmountLabel: "Бусад дүн",
  customAmountPlaceholder: "Дүн оруулна уу",
  messageLabel: "Захиа (заавал биш)",
  messagePlaceholder: "Та сэтгэгдлээ үлдээж болно",
  anonymousLabel: "Нэрээ нууцлах",
  consentLabel:
    "Би нууцлалын бодлогыг зөвшөөрч, миний өгсөн мэдээллийг боловсруулахыг хүлээн зөвшөөрч байна.",
  submit: "Төлбөр төлөх",
  submitting: "Уншиж байна…",
  presetAmounts: [10000, 20000, 50000, 100000, 200000, 500000] as const,
  currency: "₮",
} as const;

export const invoice = {
  title: "Төлбөрөө гүйцэтгэнэ үү",
  subtitle: "QR кодыг банкны аппликейшнаар уншуулна уу.",
  checkButton: "Төлбөрийг шалгах",
  paidTitle: "Баярлалаа!",
  paidSubtitle: "Таны хандив амжилттай хүлээн авлаа.",
  pendingTitle: "Төлбөр хүлээгдэж байна",
  failedTitle: "Төлбөр амжилтгүй",
  backHome: "Нүүр хуудас руу буцах",
} as const;

export const transparency = {
  title: "Ил тод байдал",
  subtitle: "Бүх хандивыг ил тод харуулна.",
  donorColumn: "Хандивлагч",
  amountColumn: "Дүн",
  messageColumn: "Захиа",
  dateColumn: "Огноо",
  empty: "Одоогоор хандив бүртгэгдээгүй байна.",
} as const;

export const partners = {
  title: "Хамтрагчид",
  subtitle: "Бидний үйл хэрэгт дэмжлэг үзүүлж буй байгууллагууд.",
  empty: "Одоогоор хамтрагч байгууллага бүртгэгдээгүй байна.",
  visitSite: "Веб сайт",
} as const;

export const news = {
  title: "Мэдээ мэдээлэл",
  subtitle: "Сүүлийн үеийн мэдээ, үйл явдлууд.",
  empty: "Одоогоор мэдээ нийтлэгдээгүй байна.",
  readMore: "Дэлгэрэнгүй унших",
  backToList: "Бүх мэдээ рүү буцах",
} as const;

export const admin = {
  loginTitle: "Удирдлагын нэвтрэлт",
  emailLabel: "И-мэйл",
  passwordLabel: "Нууц үг",
  signIn: "Нэвтрэх",
  signOut: "Гарах",
  dashboardTitle: "Хяналтын самбар",
  totalRaised: "Нийт цугласан",
  totalDonations: "Нийт хандив",
  averageDonation: "Дундаж дүн",
  donorCount: "Хандивлагчид",
  manageCampaign: "Кампанит ажил",
  manageDonations: "Хандивууд",
  managePartners: "Хамтрагчид",
  manageNews: "Мэдээ",
  save: "Хадгалах",
  cancel: "Цуцлах",
  delete: "Устгах",
  edit: "Засах",
  create: "Шинээр нэмэх",
} as const;

export const status = {
  pending: "Хүлээгдэж буй",
  paid: "Төлсөн",
  failed: "Амжилтгүй",
} as const;

export const anonymous = "Нэрээ нууцалсан хандивлагч";

export const errors = {
  generic: "Алдаа гарлаа. Дахин оролдоно уу.",
  invalidAmount: "Дүн буруу байна.",
  invalidEmail: "И-мэйл хаяг буруу байна.",
  invalidPhone: "Утасны дугаар буруу байна.",
  required: "Заавал бөглөнө үү.",
  consent: "Нууцлалын бодлогыг зөвшөөрөх шаардлагатай.",
  contactRequired: "И-мэйл эсвэл утасны дугаар оруулна уу.",
  minAmount: "Хамгийн бага дүн 1000₮.",
} as const;

export const footer = {
  copyright: `© ${new Date().getFullYear()} ${site.name}. Бүх эрх хуулиар хамгаалагдсан.`,
  privacy: "Нууцлалын бодлого",
  terms: "Үйлчилгээний нөхцөл",
} as const;
