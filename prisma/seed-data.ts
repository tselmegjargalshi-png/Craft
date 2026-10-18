type P = [string, string]; // [tr, en]

export type SeedPackage = {
  name: P;
  price: number | null;
  desc: P;
  features: P[];
  highlight?: boolean;
  note?: P;
};
export type SeedService = {
  slug: string;
  icon: "web" | "menu" | "nfc" | "webapp" | "app";
  title: P;
  tagline: P;
  desc: P;
  what: P;
  who: { tr: string[]; en: string[] };
  build: { tr: string[]; en: string[] };
  metaDesc: P;
  packages: SeedPackage[];
};

const QUOTE_CTA = "Teklif Al";

export const services: SeedService[] = [
  {
    slug: "web-sitesi",
    icon: "web",
    title: ["Web Sitesi", "Website"],
    tagline: ["Markanız için profesyonel bir vitrin", "A professional storefront for your brand"],
    desc: [
      "Markanızı, işletmenizi veya kişisel projenizi profesyonel bir dijital deneyime dönüştürüyoruz.",
      "We turn your brand, business or personal project into a professional digital experience.",
    ],
    what: [
      "Web siteniz, müşterinizin sizi ilk gördüğü yerdir. Telefonda hızlı açılan, markanızı doğru anlatan ve ziyaretçiyi size ulaşmaya yönlendiren bir site hazırlıyoruz. Tek sayfalık tanıtım sitesinden çok sayfalı kurumsal siteye kadar ihtiyacınıza göre ölçeklenir.",
      "Your website is where customers meet you first. We build sites that load fast on a phone, tell your brand's story clearly and guide visitors to get in touch. From a one-page landing site to a multi-page corporate site, it scales with your needs.",
    ],
    who: {
      tr: ["Yeni bir işe başlayan girişimciler", "Yerel işletmeler ve esnaf", "Freelancer ve uzmanlar", "Markasını güçlendirmek isteyen şirketler"],
      en: ["Entrepreneurs starting something new", "Local businesses and shops", "Freelancers and specialists", "Companies strengthening their brand"],
    },
    build: {
      tr: [
        "Tanıtım sitesi — Tek sayfada işinizi, hizmetlerinizi ve iletişim bilgilerinizi anlatın",
        "Kurumsal site — Hakkımızda, hizmetler, referanslar ve blog ile güçlü bir çevrimiçi varlık",
        "Portfolyo — Çalışmalarınızı etkileyici bir şekilde sergileyin",
        "Özel proje — Rezervasyon, ödeme veya üyelik gibi gelişmiş ihtiyaçlar",
      ],
      en: [
        "Landing site — Present your business, services and contact details on one page",
        "Corporate site — About, services, references and blog for a strong online presence",
        "Portfolio — Showcase your work beautifully",
        "Custom project — Advanced needs like bookings, payments or memberships",
      ],
    },
    metaDesc: [
      "Mobil uyumlu, hızlı ve modern web sitesi paketleri. Starter'dan Premium'a net fiyatlar, teklif için hemen yazın.",
      "Fast, mobile-friendly and modern website packages. Clear prices from Starter to Premium. Request a quote today.",
    ],
    packages: [
      {
        name: ["Starter", "Starter"],
        price: 9900,
        desc: ["Bireyler ve basit tanıtım sayfaları için.", "For individuals and simple landing pages."],
        features: [
          ["1 sayfa", "1 page"],
          ["Mobil uyumlu tasarım", "Responsive design"],
          ["Modern arayüz", "Modern UI"],
          ["İletişim bölümü", "Contact section"],
          ["WhatsApp butonu", "WhatsApp button"],
          ["Temel SEO", "Basic SEO"],
          ["SSL sertifikası", "SSL certificate"],
          ["Yayına alma", "Deployment"],
        ],
      },
      {
        name: ["Business", "Business"],
        price: 16900,
        desc: ["Küçük işletmeler için.", "For small businesses."],
        features: [
          ["5 sayfaya kadar", "Up to 5 pages"],
          ["Size özel tasarım", "Custom design"],
          ["Mobil uyumlu tasarım", "Responsive design"],
          ["İletişim formu", "Contact form"],
          ["WhatsApp entegrasyonu", "WhatsApp integration"],
          ["Google Haritalar", "Google Maps"],
          ["Temel SEO", "Basic SEO"],
          ["Sosyal medya entegrasyonu", "Social media integration"],
          ["Yayına alma", "Deployment"],
        ],
      },
      {
        name: ["Professional", "Professional"],
        price: 24900,
        highlight: true,
        desc: ["Daha güçlü bir çevrimiçi varlık isteyen işletmeler için.", "For businesses that need a stronger online presence."],
        features: [
          ["8 sayfaya kadar", "Up to 8 pages"],
          ["Özel UI/UX tasarımı", "Custom UI/UX"],
          ["Gelişmiş animasyonlar", "Advanced animations"],
          ["SEO yapısı", "SEO structure"],
          ["Blog / haber bölümü", "Blog / news section"],
          ["İletişim sistemi", "Contact system"],
          ["Analitik entegrasyonu", "Analytics integration"],
          ["Sosyal medya entegrasyonu", "Social media integration"],
          ["Performans optimizasyonu", "Performance optimization"],
          ["Yayına alma", "Deployment"],
        ],
      },
      {
        name: ["Premium", "Premium"],
        price: 34900,
        desc: ["Premium bir web sitesi isteyen markalar için.", "For brands that want a premium website."],
        features: [
          ["12 sayfaya kadar", "Up to 12 pages"],
          ["Premium UI/UX tasarımı", "Premium UI/UX"],
          ["Gelişmiş etkileşimler", "Advanced interactions"],
          ["Özel animasyonlar", "Custom animations"],
          ["İçerik yönetimine hazır yapı", "CMS-ready structure"],
          ["Gelişmiş SEO", "Advanced SEO"],
          ["Analitik", "Analytics"],
          ["Performans optimizasyonu", "Performance optimization"],
          ["WhatsApp ve formlar", "WhatsApp and forms"],
          ["Yayına alma + 30 gün destek", "Deployment + 30 days support"],
        ],
      },
      {
        name: ["Custom", "Custom"],
        price: null,
        desc: ["Karmaşık web siteleri için size özel çözüm.", "A tailored solution for complex websites."],
        features: [
          ["Özel mimari", "Custom architecture"],
          ["Gelişmiş işlevler", "Advanced functionality"],
          ["Veritabanı", "Database"],
          ["Kullanıcı girişi (kimlik doğrulama)", "Authentication"],
          ["API entegrasyonları", "API integrations"],
          ["Özel yönetim paneli", "Custom dashboard"],
          ["Ödeme entegrasyonları", "Payment integrations"],
          ["Gelişmiş animasyonlar", "Advanced animations"],
        ],
      },
    ],
  },
  {
    slug: "dijital-menu",
    icon: "menu",
    title: ["Dijital Menü", "Digital Menu"],
    tagline: ["QR ile açılan, her an güncel menü", "A QR menu that's always up to date"],
    desc: [
      "Restoran, kafe ve oteller için QR ile açılan, fiyatı ve ürünü dakikalar içinde güncellenebilen dijital menüler.",
      "QR-based digital menus for restaurants, cafes and hotels, where prices and products update in minutes.",
    ],
    what: [
      "Müşteriniz masadaki QR kodu okutur, menünüz telefonunda açılır. Basılı menüyü yeniden bastırmak yerine fiyat, ürün ve fotoğraflarınızı kendiniz saniyeler içinde güncellersiniz.",
      "Guests scan the QR code on the table and your menu opens on their phone. No more reprinting: update prices, products and photos yourself in seconds.",
    ],
    who: {
      tr: ["Restoran ve lokantalar", "Kafe ve barlar", "Oteller ve pansiyonlar", "Pastane ve fırınlar", "Fast food işletmeleri"],
      en: ["Restaurants and eateries", "Cafes and bars", "Hotels and guesthouses", "Bakeries and patisseries", "Fast food businesses"],
    },
    build: {
      tr: [
        "QR menü — Masaya koyduğunuz kodla anında açılan mobil menü",
        "Fotoğraflı ürünler — İştah açan görseller, açıklamalar ve fiyatlar",
        "Çok dilli menü — Turistler için Türkçe ve İngilizce menü",
        "Kampanya ve öne çıkanlar — Günün ürünü ve özel tekliflerinizi vurgulayın",
      ],
      en: [
        "QR menu — A mobile menu that opens instantly from the code on your table",
        "Photo products — Appetising visuals, descriptions and prices",
        "Multi-language menu — Turkish and English for tourists",
        "Offers and highlights — Feature the dish of the day and special deals",
      ],
    },
    metaDesc: [
      "Restoran, kafe ve oteller için QR dijital menü paketleri. Hızlı kurulum, kolay güncelleme, net fiyatlar.",
      "QR digital menu packages for restaurants, cafes and hotels. Quick setup, easy updates, clear prices.",
    ],
    packages: [
      {
        name: ["Starter", "Starter"],
        price: 4900,
        desc: ["Hızlıca dijital menüye geçmek isteyenler için.", "For going digital quickly."],
        features: [
          ["QR menü", "QR menu"],
          ["Mobil uyumlu görünüm", "Mobile responsive"],
          ["Kategori sistemi", "Category system"],
          ["Ürün fotoğrafları", "Product photos"],
          ["Fiyatlar", "Prices"],
          ["İşletme bilgileri", "Business information"],
        ],
      },
      {
        name: ["Business", "Business"],
        price: 7900,
        desc: ["Markasını menüye yansıtmak isteyen işletmeler için.", "For businesses that want their brand in the menu."],
        features: [
          ["Starter'daki her şey", "Everything in Starter"],
          ["Markanıza özel tasarım", "Custom branding"],
          ["Ürün açıklamaları", "Product descriptions"],
          ["Çoklu kategori", "Multiple categories"],
          ["QR kod tasarımı", "QR code design"],
          ["WhatsApp / iletişim butonu", "WhatsApp / contact button"],
          ["Google Haritalar", "Google Maps"],
          ["Sosyal medya bağlantıları", "Social media links"],
        ],
      },
      {
        name: ["Pro", "Pro"],
        price: 11900,
        highlight: true,
        desc: ["Menüyü satış aracına çevirmek isteyenler için.", "For turning your menu into a sales tool."],
        features: [
          ["Business'taki her şey", "Everything in Business"],
          ["Etkileşimli menü", "Interactive menu"],
          ["Ürün seçenekleri (boy, ekstra)", "Product variants (size, extras)"],
          ["Öne çıkan ürünler", "Featured products"],
          ["Özel kampanyalar", "Special offers"],
          ["Çoklu dil desteği", "Multiple language support"],
          ["Ziyaret analitiği", "Visit analytics"],
        ],
      },
      {
        name: ["Premium", "Premium"],
        price: 17900,
        desc: ["Zincir ve büyük işletmeler için tam donanımlı menü.", "A fully loaded menu for chains and larger venues."],
        features: [
          ["Pro'daki her şey", "Everything in Pro"],
          ["Gelişmiş animasyonlar", "Advanced animations"],
          ["Özel UI/UX tasarımı", "Custom UI/UX"],
          ["Çok dilli menü", "Multi-language"],
          ["Gelişmiş analitik", "Advanced analytics"],
          ["Masa / QR yapısı", "Table / QR structure"],
          ["Yönetim paneli", "Admin panel"],
        ],
      },
      {
        name: ["Custom", "Custom"],
        price: null,
        desc: ["Restoran ve konaklama işletmelerine özel sistemler.", "Custom restaurant and hospitality systems."],
        features: [
          ["Size özel işletme sistemi", "Custom hospitality system"],
          ["Sipariş ve rezervasyon akışları", "Ordering and reservation flows"],
          ["Çoklu şube yönetimi", "Multi-branch management"],
          ["Entegrasyonlar (POS vb.)", "Integrations (POS etc.)"],
          ["Özel tasarım ve animasyon", "Custom design and animation"],
        ],
      },
    ],
  },
  {
    slug: "nfc-kart",
    icon: "nfc",
    title: ["NFC Dijital Kart", "NFC Digital Card"],
    tagline: ["Tek dokunuşla kendinizi tanıtın", "Introduce yourself with one tap"],
    desc: [
      "Tek dokunuşla sosyal medya hesaplarınızı, iletişim bilgilerinizi ve dijital profilinizi paylaşın.",
      "Share your social accounts, contact details and digital profile with a single tap.",
    ],
    what: [
      "Fiziksel bir NFC kart ve ona bağlı dijital profil sayfanız. Kartı telefonun arkasına dokundurmanız yeterli: uygulama indirmeye gerek kalmadan profiliniz açılır. Bilgilerinizi istediğiniz zaman, kartı değiştirmeden güncellersiniz.",
      "A physical NFC card plus the digital profile page it opens. Just tap it on the back of a phone: your profile opens without any app. Update your details anytime, no new card needed.",
    ],
    who: {
      tr: ["Freelancer ve uzmanlar", "Satış ve emlak profesyonelleri", "Kafe, kuaför ve butikler", "İçerik üreticileri ve sanatçılar"],
      en: ["Freelancers and specialists", "Sales and real-estate professionals", "Cafes, salons and boutiques", "Creators and artists"],
    },
    build: {
      tr: [
        "Sosyal medya profili — Instagram, TikTok ve LinkedIn tek dokunuşla",
        "İletişim kartı — Rehbere tek dokunuşla kaydedilen bilgileriniz",
        "İşletme profili — WhatsApp, konum, web siteniz ve çalışma saatleri",
        "Portfolyo — Çalışmalarınıza ve sunumlarınıza hızlı erişim",
      ],
      en: [
        "Social profile — Instagram, TikTok and LinkedIn in one tap",
        "Contact card — Your details saved to the address book in a tap",
        "Business profile — WhatsApp, location, website and opening hours",
        "Portfolio — Quick access to your work and presentations",
      ],
    },
    metaDesc: [
      "Fiziksel NFC kart ve dijital profil paketleri. Kart dahil, net fiyat; tek dokunuşla tüm bağlantılarınızı paylaşın.",
      "Physical NFC card and digital profile packages. Card included, clear pricing; share all your links with a tap.",
    ],
    packages: [
      {
        name: ["Starter", "Starter"],
        price: 1490,
        note: ["Kart dahil", "Card included"],
        desc: ["Kendi kartını hemen kullanmaya başlamak isteyenler için.", "For getting your own card up and running."],
        features: [
          ["1 adet fiziksel NFC kart (dahil)", "1 physical NFC card (included)"],
          ["Dijital profil sayfası", "Digital profile page"],
          ["Sosyal medya bağlantıları", "Social media links"],
          ["WhatsApp butonu", "WhatsApp button"],
          ["Rehbere kaydet butonu", "Save-to-contacts button"],
        ],
      },
      {
        name: ["Business", "Business"],
        price: 2490,
        note: ["Kart dahil", "Card included"],
        desc: ["İşletmesini tek kartta toplamak isteyenler için.", "For putting your business on a single card."],
        features: [
          ["Starter'daki her şey", "Everything in Starter"],
          ["Logolu NFC kart (dahil)", "NFC card with your logo (included)"],
          ["Markanıza özel profil tasarımı", "Profile designed for your brand"],
          ["Google Haritalar konumu", "Google Maps location"],
          ["Web sitesi ve menü bağlantıları", "Website and menu links"],
          ["Çalışma saatleri", "Opening hours"],
        ],
      },
      {
        name: ["Pro", "Pro"],
        price: 3490,
        highlight: true,
        note: ["2 kart dahil", "2 cards included"],
        desc: ["Ekip arkadaşıyla birlikte kullanmak isteyenler için.", "For using the card together with a teammate."],
        features: [
          ["Business'taki her şey", "Everything in Business"],
          ["2 adet fiziksel NFC kart (dahil)", "2 physical NFC cards (included)"],
          ["Portfolyo / galeri bölümü", "Portfolio / gallery section"],
          ["Birden fazla bağlantı ve buton", "Multiple links and buttons"],
          ["Ziyaret istatistikleri", "Visit statistics"],
          ["Türkçe / İngilizce profil", "Turkish / English profile"],
        ],
      },
      {
        name: ["Premium", "Premium"],
        price: 4990,
        note: ["5 kart dahil", "5 cards included"],
        desc: ["Küçük ekipler ve markalar için.", "For small teams and brands."],
        features: [
          ["Pro'daki her şey", "Everything in Pro"],
          ["5 adet fiziksel NFC kart (dahil)", "5 physical NFC cards (included)"],
          ["Özel baskılı kart tasarımı", "Custom-printed card design"],
          ["Kişi başı ayrı profil", "A separate profile for each person"],
          ["Gelişmiş istatistikler", "Advanced statistics"],
          ["Öncelikli destek", "Priority support"],
        ],
      },
      {
        name: ["Custom", "Custom"],
        price: null,
        note: ["Kart sayısı teklife göre", "Card quantity by quote"],
        desc: ["Kurumsal ve yüksek adetli ihtiyaçlar için.", "For corporate and high-volume needs."],
        features: [
          ["İstediğiniz adet NFC kart", "Any number of NFC cards"],
          ["Kurumsal kimliğe uygun kart baskısı", "Cards printed to your brand identity"],
          ["Ekip yönetimi", "Team management"],
          ["Özel entegrasyonlar", "Custom integrations"],
        ],
      },
    ],
  },
  {
    slug: "web-uygulama",
    icon: "webapp",
    title: ["Web Uygulama", "Web App"],
    tagline: ["İşinize göre geliştirilen özel yazılım", "Custom software built around your work"],
    desc: [
      "Tarayıcı üzerinden çalışan, işletmenizin ihtiyaçlarına göre geliştirilen özel web uygulamaları.",
      "Custom web applications that run in the browser, built around your business needs.",
    ],
    what: [
      "Excel tablolarını ve dağınık işleri tek bir düzenli sisteme taşıyoruz. Ekibiniz tarayıcıdan giriş yapar; her şey tek yerde, güvenli ve her cihazdan erişilebilir olur.",
      "We move spreadsheets and scattered tasks into one tidy system. Your team signs in from the browser; everything is in one place, secure and reachable from any device.",
    ],
    who: {
      tr: ["Randevu ve rezervasyon alan işletmeler", "Müşteri ve satış takibi yapan ekipler", "Stok ve operasyon yöneten firmalar", "Fikrini hızlıca test etmek isteyen girişimciler"],
      en: ["Businesses taking appointments and bookings", "Teams tracking customers and sales", "Companies managing stock and operations", "Founders who want to validate an idea fast"],
    },
    build: {
      tr: [
        "Rezervasyon sistemi — Randevu ve rezervasyonları otomatik yönetin",
        "CRM ve müşteri portalı — Müşterilerinizi ve geçmiş işlerini tek yerde takip edin",
        "Yönetim paneli — Rakamlarınızı canlı görün, işi buradan yönetin",
        "Stok ve envanter — Ürün, giriş-çıkış ve sipariş takibi",
        "SaaS MVP — Fikrinizi gerçek kullanıcılarla test edin",
      ],
      en: [
        "Booking system — Manage appointments and reservations automatically",
        "CRM and customer portal — Track customers and past work in one place",
        "Management dashboard — See your numbers live and run things from here",
        "Stock and inventory — Products, movements and order tracking",
        "SaaS MVP — Test your idea with real users",
      ],
    },
    metaDesc: [
      "İşletmenize özel web uygulaması geliştirme paketleri: rezervasyon, CRM, yönetim paneli ve SaaS MVP. Net başlangıç fiyatları.",
      "Custom web application packages: bookings, CRM, dashboards and SaaS MVPs. Clear starting prices.",
    ],
    packages: [
      {
        name: ["Starter", "Starter"],
        price: 29900,
        desc: ["Basit bir iç aracı hızla hayata geçirmek için.", "For getting a simple internal tool live quickly."],
        features: [
          ["Temel web uygulaması", "Basic web application"],
          ["Mobil uyumlu arayüz", "Responsive UI"],
          ["Temel veritabanı", "Basic database"],
          ["Temel yönetim ekranı", "Basic admin"],
          ["Yayına alma", "Deployment"],
        ],
      },
      {
        name: ["Business", "Business"],
        price: 49900,
        desc: ["Ekibin günlük işini yürüteceği uygulamalar için.", "For apps your team runs its day on."],
        features: [
          ["Kullanıcı girişi (kimlik doğrulama)", "Authentication"],
          ["Veritabanı", "Database"],
          ["Yönetim paneli", "Admin dashboard"],
          ["Kullanıcı yönetimi", "User management"],
          ["Ekleme, düzenleme, silme (CRUD) işlevleri", "CRUD functionality"],
          ["Mobil uyumlu tasarım", "Responsive design"],
          ["Yayına alma", "Deployment"],
        ],
      },
      {
        name: ["Pro", "Pro"],
        price: 79900,
        highlight: true,
        desc: ["Büyüyen operasyonlar için gelişmiş uygulamalar.", "Advanced applications for growing operations."],
        features: [
          ["Business'taki her şey", "Everything in Business"],
          ["Gelişmiş panel", "Advanced dashboard"],
          ["Rol ve yetki yönetimi", "Roles & permissions"],
          ["API entegrasyonları", "API integrations"],
          ["Analitik ve raporlar", "Analytics and reports"],
          ["Gelişmiş veritabanı yapısı", "Advanced database"],
          ["Bildirimler", "Notifications"],
        ],
      },
      {
        name: ["Premium", "Premium"],
        price: 119900,
        desc: ["Ölçeklenebilir, iş kritik sistemler için.", "For scalable, business-critical systems."],
        features: [
          ["Pro'daki her şey", "Everything in Pro"],
          ["Gelişmiş mimari", "Advanced architecture"],
          ["Ödeme entegrasyonu", "Payment integration"],
          ["Otomasyonlar", "Automation"],
          ["Gelişmiş rol yapısı", "Advanced roles"],
          ["Detaylı analitik", "In-depth analytics"],
          ["Üçüncü taraf API entegrasyonları", "Third-party API integrations"],
          ["Öncelikli destek", "Priority support"],
        ],
      },
      {
        name: ["Custom", "Custom"],
        price: null,
        desc: ["Tamamen size özel bir çözüm.", "A fully custom solution."],
        features: [
          ["İhtiyaç analizi ve planlama", "Needs analysis and planning"],
          ["Size özel mimari ve tasarım", "Custom architecture and design"],
          ["Sınırsız kapsam planlaması", "Open-ended scope planning"],
          ["Özel entegrasyonlar", "Custom integrations"],
          ["Süreçli teslimat ve destek", "Phased delivery and support"],
        ],
      },
    ],
  },
  {
    slug: "mobil-pc-uygulama",
    icon: "app",
    title: ["Mobil & PC Uygulama", "Mobile & PC App"],
    tagline: ["Telefonda ve bilgisayarda çalışan uygulamalar", "Apps that run on phones and computers"],
    desc: [
      "Telefonda, bilgisayarda ya da ikisinde birden çalışan, size özel uygulamalar geliştiriyoruz.",
      "We build custom apps that run on phones, on computers, or on both.",
    ],
    what: [
      "Mobil uygulama telefonlarda (Android ve iOS), PC uygulaması Windows ve macOS bilgisayarlarda çalışır. Cross-platform seçeneğinde ise tek geliştirmeyle her ikisini birden elde edersiniz. Hangisinin size uygun olduğunu birlikte belirleriz.",
      "A mobile app runs on phones (Android and iOS), a PC app runs on Windows and macOS computers. With cross-platform you get both from a single build. We'll work out which one suits you together.",
    ],
    who: {
      tr: ["Müşterilerine mobil uygulama sunmak isteyen markalar", "Masaüstü iş yazılımına ihtiyaç duyan işletmeler", "Hem mobil hem PC isteyen girişimler"],
      en: ["Brands offering a mobile app to customers", "Businesses needing desktop business software", "Startups that want both mobile and PC"],
    },
    build: {
      tr: [
        "Mobil Uygulama — Android ve iOS telefonlarda çalışan uygulama",
        "PC Uygulama — Windows ve macOS'ta bilgisayardan çalışan program",
        "Cross-platform — Tek geliştirmeyle hem mobil hem PC",
      ],
      en: [
        "Mobile App — An app that runs on Android and iOS phones",
        "PC App — A program that runs on Windows and macOS computers",
        "Cross-platform — One build for both mobile and PC",
      ],
    },
    metaDesc: [
      "Mobil ve PC uygulama geliştirme paketleri: Android, iOS, Windows ve macOS. Net başlangıç fiyatları ve teklif.",
      "Mobile and PC app development packages: Android, iOS, Windows and macOS. Clear starting prices and quotes.",
    ],
    packages: [
      {
        name: ["Starter", "Starter"],
        price: 39900,
        desc: ["Fikri hızlıca uygulamaya dönüştürmek için.", "For turning an idea into an app quickly."],
        features: [
          ["Temel uygulama", "Basic application"],
          ["Modern arayüz", "Modern UI"],
          ["Farklı ekran boyutlarına uyumlu yerleşim", "Layouts for different screen sizes"],
          ["Temel işlevler", "Core functionality"],
          ["Temel sunucu altyapısı", "Basic backend"],
        ],
      },
      {
        name: ["Business", "Business"],
        price: 64900,
        desc: ["Kullanıcı hesabı olan, gerçek bir ürün için.", "For a real product with user accounts."],
        features: [
          ["Kullanıcı girişi (kimlik doğrulama)", "Authentication"],
          ["Veritabanı", "Database"],
          ["Kullanıcı profilleri", "User profiles"],
          ["Bildirimler", "Notifications"],
          ["Yönetim paneli", "Admin panel"],
        ],
      },
      {
        name: ["Pro", "Pro"],
        price: 99900,
        highlight: true,
        desc: ["Ödeme ve entegrasyon gerektiren uygulamalar için.", "For apps that need payments and integrations."],
        features: [
          ["Business'taki her şey", "Everything in Business"],
          ["API entegrasyonları", "API integrations"],
          ["Gelişmiş panel", "Advanced dashboard"],
          ["Ödeme entegrasyonu", "Payment integration"],
          ["Anlık bildirimler (push)", "Push notifications"],
          ["Analitik", "Analytics"],
        ],
      },
      {
        name: ["Premium", "Premium"],
        price: 149900,
        desc: ["Çok platformlu, ölçeklenebilir ürünler için.", "For multi-platform, scalable products."],
        features: [
          ["Pro'daki her şey", "Everything in Pro"],
          ["Gelişmiş mimari", "Advanced architecture"],
          ["Çoklu platform (mobil + PC)", "Multi-platform (mobile + PC)"],
          ["Gelişmiş sunucu altyapısı", "Advanced backend"],
          ["Yönetim sistemi", "Admin system"],
          ["Mağaza yayını ve dağıtım desteği", "Store publishing and deployment support"],
        ],
      },
      {
        name: ["Custom", "Custom"],
        price: null,
        desc: ["Tamamen size özel bir uygulama.", "A fully custom application."],
        features: [
          ["İhtiyaç analizi ve planlama", "Needs analysis and planning"],
          ["Size özel mimari ve tasarım", "Custom architecture and design"],
          ["Mobil, PC veya her ikisi", "Mobile, PC or both"],
          ["Özel entegrasyonlar", "Custom integrations"],
          ["Süreçli teslimat ve destek", "Phased delivery and support"],
        ],
      },
    ],
  },
];

export const generalFaqs: { q: P; a: P }[] = [
  {
    q: ["Web sitesi ne kadar sürede hazırlanır?", "How long does a website take?"],
    a: [
      "Kapsama göre değişir. Basit bir tanıtım sitesi genellikle birkaç gün ile iki hafta arasında, daha kapsamlı projeler daha uzun sürede tamamlanır. Net takvim, teklifte paylaşılır.",
      "It depends on scope. A simple landing site usually takes a few days to two weeks; larger projects take longer. The exact timeline is shared in your quote.",
    ],
  },
  {
    q: ["Ödeme nasıl yapılır?", "How does payment work?"],
    a: [
      "Ödeme planı teklifte netleştirilir; genellikle başlangıçta bir kısım, teslimde kalan tutar şeklinde ilerler. Ödeme yöntemlerini görüşme sırasında birlikte belirleriz.",
      "The payment plan is set in your quote, typically a portion upfront and the rest on delivery. We agree on payment methods during our conversation.",
    ],
  },
  {
    q: ["Revizyon hakkı var mı?", "Do I get revisions?"],
    a: [
      "Evet. Tasarım ve geliştirme sürecinde geri bildirimlerinizle şekillendiririz. Revizyon kapsamı paketinize göre teklifte yazılı olarak belirtilir.",
      "Yes. We shape the work with your feedback throughout design and development. The revision scope for your package is written in your quote.",
    ],
  },
  {
    q: ["Domain ve hosting dahil mi?", "Are domain and hosting included?"],
    a: [
      "Paket fiyatlarına alan adı (domain) ve barındırma (hosting) ücreti ayrıca dahil edilmeyebilir; bunlar yıllık olarak ödenen ayrı kalemlerdir. Hangi kalemlerin pakete dahil olduğunu teklifte açıkça belirtiriz, gizli ücret yoktur.",
      "Domain and hosting fees may not be part of the package price; they are separate yearly items. We state clearly in your quote what is included, with no hidden fees.",
    ],
  },
  {
    q: ["Sonradan özellik ekleyebilir miyim?", "Can I add features later?"],
    a: [
      "Elbette. Projelerimizi büyümeye açık kurarız; ihtiyaç oldukça yeni sayfa ya da özellik ekleyebilir, paketinizi yükseltebilirsiniz.",
      "Of course. We build projects to grow: add pages or features as you need them, or upgrade your package.",
    ],
  },
  {
    q: ["Proje tesliminden sonra destek veriyor musunuz?", "Do you offer support after delivery?"],
    a: [
      "Evet. Teslimden sonra kullanımı anlatır, sorularınızı yanıtlarız. Destek süresi pakete göre değişir ve teklifte belirtilir.",
      "Yes. After delivery we walk you through everything and answer your questions. Support duration varies by package and is stated in your quote.",
    ],
  },
];

export const serviceFaqs: Record<string, { q: P; a: P }[]> = {
  "nfc-kart": [
    {
      q: ["NFC kart nasıl çalışıyor?", "How does an NFC card work?"],
      a: [
        "Kartın içinde küçük bir NFC çipi bulunur. Kartı bir telefonun arkasına yaklaştırdığınızda telefon profil sayfanızı otomatik olarak açar; uygulama indirmek gerekmez. QR kod desteği olmayan eski telefonlarda bile çoğu modern telefon NFC'yi destekler.",
        "The card contains a small NFC chip. When you hold it near the back of a phone, the phone opens your profile page automatically, with no app needed. Most modern phones support NFC.",
      ],
    },
    {
      q: ["Kart içeriğini sonradan değiştirebilir miyim?", "Can I change the content later?"],
      a: [
        "Evet. Kart, profil sayfanıza bağlanır; bağlantılarınızı ve bilgilerinizi istediğiniz zaman güncellediğinizde kart aynı kalır.",
        "Yes. The card points to your profile page; update your links and details anytime and the card stays the same.",
      ],
    },
  ],
  "mobil-pc-uygulama": [
    {
      q: ["Mobil uygulama hem Android hem iOS için yapılabilir mi?", "Can a mobile app be built for both Android and iOS?"],
      a: [
        "Evet. Cross-platform yaklaşımla tek geliştirmeyle hem Android hem iOS için uygulama hazırlayabiliriz. Mağaza yayını için geliştirici hesap ücretleri ayrıca ödenir.",
        "Yes. With a cross-platform approach we can deliver for both Android and iOS from one build. Store developer account fees are paid separately.",
      ],
    },
    {
      q: ["Mobil ve PC uygulaması arasındaki fark nedir?", "What's the difference between a mobile and a PC app?"],
      a: [
        "Mobil uygulama telefonlarda, PC uygulaması Windows veya macOS bilgisayarlarda çalışır. Hangisinin size uygun olduğunu ihtiyacınıza göre birlikte belirleriz.",
        "A mobile app runs on phones; a PC app runs on Windows or macOS computers. We decide together which suits you.",
      ],
    },
  ],
  "dijital-menu": [
    {
      q: ["Menüyü kendim güncelleyebilir miyim?", "Can I update the menu myself?"],
      a: [
        "Evet. Fiyat, ürün ve fotoğrafları dakikalar içinde güncelleyebilirsiniz. Güncelleme yöntemi pakete göre değişir; ayrıntıyı teklifte netleştiririz.",
        "Yes. You can update prices, products and photos within minutes. The method varies by package and is detailed in your quote.",
      ],
    },
  ],
};

export const settings: Record<string, [string, string]> = {
  site_name: ["Craft", "Craft"],
  logo_url: ["", ""],
  hero_eyebrow: ["Dijital ürünler, sade fiyatlar", "Digital products, simple pricing"],
  hero_title: ["İşinize uygun dijital çözüm, net fiyatla.", "The right digital solution for your business, at a clear price."],
  hero_desc: [
    "Web sitesi, dijital menü, NFC kart, web uygulaması ve mobil/PC uygulama. Paketleri karşılaştırın, ne aldığınızı görün, tek mesajla başlayın.",
    "Websites, digital menus, NFC cards, web apps and mobile/PC apps. Compare packages, see exactly what you get and start with one message.",
  ],
  about_title: ["Biz ne yapıyoruz?", "What do we do?"],
  about_text: [
    "Fikrinizi karmaşık süreçlere boğmadan dijital bir ürüne dönüştürüyoruz. Web sitesinden mobil uygulamaya kadar her şeyi sade, modern ve anlaşılır paketlerle sunuyoruz.",
    "We turn your idea into a digital product without drowning it in process. From websites to mobile apps, everything comes in simple, modern and easy-to-understand packages.",
  ],
  cta_title: ["Projenizi konuşalım.", "Let's talk about your project."],
  cta_desc: [
    "Birkaç satırla anlatın, size uygun paketi ve net fiyatı birlikte belirleyelim.",
    "Tell us in a few lines and we'll settle on the right package and a clear price together.",
  ],
  pricing_note: [
    "Listelenen fiyatlar KDV dahildir; başlangıç / referans fiyatlarıdır ve net tutar projenizin kapsamına göre teklifte belirtilir.",
    "Listed prices include VAT (KDV); they are starting / reference prices and the final amount is stated in your quote based on project scope.",
  ],
  footer_tagline: [
    "Profesyonel dijital çözümler, karmaşık süreçler olmadan.",
    "Professional digital solutions, without the complicated process.",
  ],
  whatsapp: ["", ""],
  instagram: ["", ""],
  email: ["hello@craft.example", "hello@craft.example"],
  phone: ["", ""],
  tiktok: ["", ""],
  linkedin: ["", ""],
  address: ["", ""],
};

export { QUOTE_CTA };
