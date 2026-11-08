# فروشگاه اینترنتی Next.js Shop

[![مشاهده نسخه آنلاین](https://img.shields.io/badge/مشاهده-نسخه%20آنلاین-0A66C2?style=for-the-badge)](https://nextjs-shop-devs.vercel.app/)
[![مخزن GitHub](https://img.shields.io/badge/GitHub-مخزن%20پروژه-181717?style=for-the-badge&logo=github)](https://github.com/mehrandevs/nextjs-shop)

یک پروژه فروشگاه اینترنتی فول‌استک با **Next.js، React و MongoDB**. این برنامه بخش فروشگاه کاربران، احراز هویت، سبد خرید، ثبت سفارش و پنل مدیریت را در بر می‌گیرد.

> پروژه در حال توسعه است و ممکن است امکانات و ساختار آن در نسخه‌های بعدی تغییر کند.

## نسخه آنلاین

**[مشاهده فروشگاه](https://nextjs-shop-devs.vercel.app/)**

## امکانات

### فروشگاه
- نمایش محصولات، جزئیات محصول و محصولات مرتبط
- نمایش محصولات ویژه، اسلایدشو و دسته‌بندی‌ها
- سبد خرید با مدیریت وضعیت از طریق React Context
- ثبت سفارش و مدیریت نشانی‌های کاربر
- پنل کاربری شامل پروفایل، نشانی‌ها و سفارش‌ها

### احراز هویت
- ثبت‌نام و ورود کاربران
- احراز هویت با NextAuth و Credentials
- ارسال و تأیید کد یک‌بارمصرف (OTP)
- محافظت از مسیرهای نیازمند احراز هویت

### پنل مدیریت
- داشبورد مدیریت
- مدیریت محصولات و دسته‌بندی‌ها
- مدیریت کاربران
- مدیریت کدهای تخفیف
- مدیریت موجودی محصولات
- مدیریت دیدگاه‌ها

### بک‌اند
- REST API با استفاده از Next.js App Router
- اتصال به MongoDB با Mongoose
- مدل‌های مجزا برای کاربران، محصولات، دسته‌بندی‌ها، سبد خرید، سفارش‌ها، تخفیف‌ها، دیدگاه‌ها و OTP

## فناوری‌ها

| فناوری | کاربرد |
| --- | --- |
| [Next.js 16](https://nextjs.org/) | فریم‌ورک اصلی و App Router |
| [React 19](https://react.dev/) | ساخت رابط کاربری |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | زبان برنامه‌نویسی پروژه |
| [MongoDB](https://www.mongodb.com/) | پایگاه داده |
| [Mongoose](https://mongoosejs.com/) | مدل‌سازی داده‌ها |
| [NextAuth.js](https://next-auth.js.org/) | احراز هویت |
| [Bootstrap 5](https://getbootstrap.com/) | استایل و طراحی واکنش‌گرا |
| [React Bootstrap](https://react-bootstrap.netlify.app/) | کامپوننت‌های Bootstrap برای React |
| [React Icons](https://react-icons.github.io/react-icons/) | آیکون‌ها |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | اعلان‌ها و پیام‌ها |
| [Vercel](https://vercel.com/) | استقرار نسخه آنلاین |

## ساختار پروژه

در این پروژه از **Route Groups** در Next.js برای تفکیک صفحات احراز هویت و فروشگاه استفاده شده است. نام پوشه‌هایی که داخل پرانتز قرار دارند، بخشی از URL نیستند.

```text
nextjs-shop/
├── app/
│   ├── (auth)/                  # صفحات مربوط به احراز هویت
│   │   └── auth/
│   │       ├── layout.js
│   │       ├── login/
│   │       │   └── page.js
│   │       └── register/
│   │           └── page.js
│   │
│   ├── (shop)/                  # صفحات اصلی فروشگاه با Layout مشترک
│   │   ├── address/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── home/
│   │   │   └── lib/             # توابع دریافت اطلاعات صفحه اصلی
│   │   ├── panel/
│   │   │   ├── my-addresses/
│   │   │   ├── my-orders/
│   │   │   └── my-profile/
│   │   ├── products/
│   │   │   └── [id]/
│   │   ├── layout.js
│   │   └── page.js
│   │
│   ├── admin/                   # پنل مدیریت، مستقل از Layout فروشگاه
│   │   ├── categories/
│   │   ├── comments/
│   │   ├── discounts/
│   │   ├── products/
│   │   ├── stock/
│   │   ├── users/
│   │   └── page.js
│   │
│   ├── api/                     # Route Handlers و REST API
│   │   ├── address/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── comments/
│   │   ├── discounts/
│   │   ├── order/
│   │   ├── panel/
│   │   ├── products/
│   │   └── users/
│   │
│   ├── components/
│   │   ├── Layout/              # هدر و فوتر
│   │   ├── auth/                # کامپوننت‌های احراز هویت
│   │   ├── home/                # کامپوننت‌های صفحه اصلی و محصولات
│   │   └── ui/                  # کامپوننت‌های رابط کاربری و سایدبارها
│   │
│   ├── context/                 # React Context
│   ├── fonts/                   # فونت‌های پروژه
│   ├── hooks/                   # Custom Hooks
│   ├── lib/                     # توابع و تنظیمات مشترک، از جمله اتصال DB
│   ├── styles/                  # فایل‌های CSS
│   ├── error.js
│   ├── layout.js                # Root Layout
│   └── loading.js
│
├── models/                      # مدل‌های Mongoose
├── public/                      # فایل‌های استاتیک، تصاویر و آپلودها
├── middleware_s.js
├── package.json
└── README.md
```

### توضیح بخش‌های مهم

- `app/(auth)`: صفحات ورود و ثبت‌نام را در یک Route Group جدا نگه می‌دارد.
- `app/(shop)`: صفحات فروشگاه را زیر Layout مشترک قرار می‌دهد؛ نام این گروه در URL نمایش داده نمی‌شود.
- `app/admin`: مسیرهای پنل مدیریت را از Layout عمومی فروشگاه جدا نگه می‌دارد.
- `app/api`: پیاده‌سازی endpointهای سمت سرور با Route Handlerهای Next.js.
- `app/components`: کامپوننت‌های قابل استفاده مجدد، دسته‌بندی‌شده بر اساس کاربرد.
- `app/context`: مدیریت state مشترک برنامه، از جمله وضعیت سبد خرید.
- `app/lib`: منطق و ابزارهای مشترک مانند اتصال به پایگاه داده.
- `models`: Schemaها و مدل‌های MongoDB با Mongoose.

## API

مسیرهای اصلی API در `app/api/` قرار دارند:

| مسیر | کاربرد |
| --- | --- |
| `/api/auth` | احراز هویت، ارسال و تأیید OTP |
| `/api/products` | دریافت و مدیریت محصولات |
| `/api/categories` | دسته‌بندی‌ها و منوی دسته‌بندی صفحه اصلی |
| `/api/cart` | عملیات سبد خرید |
| `/api/order` | ثبت سفارش |
| `/api/address` | نشانی‌های کاربران |
| `/api/users` | اطلاعات و مدیریت کاربران |
| `/api/panel` | اطلاعات پنل کاربری، از جمله سفارش‌ها |
| `/api/discounts` | مدیریت و اعتبارسنجی تخفیف‌ها |
| `/api/comments` | دیدگاه‌های محصولات |

جزئیات متدها و ورودی هر endpoint در فایل `route.js` مربوط به همان مسیر مشخص شده است.

## مدل‌های پایگاه داده

مدل‌های Mongoose در پوشه `models/` قرار دارند:

- `User.js` — کاربران
- `Product.js` — محصولات
- `Category.js` — دسته‌بندی‌ها
- `Cart.js` — سبدهای خرید
- `Order.js` — سفارش‌ها
- `Discount.js` — تخفیف‌ها
- `Comment.js` — دیدگاه‌ها
- `Otp.js` — کدهای یک‌بارمصرف

## راه‌اندازی در محیط توسعه

### پیش‌نیازها
- Node.js و npm
- یک پایگاه داده MongoDB (محلی یا MongoDB Atlas)

### نصب وابستگی‌ها

```bash
git clone https://github.com/mehrandevs/nextjs-shop.git
cd nextjs-shop
npm install
```

### تنظیم متغیرهای محیطی

یک فایل `.env.local` در ریشه پروژه بسازید و متغیرهای موردنیاز برنامه را در آن قرار دهید. برای نمونه:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

مقادیر واقعی و اطلاعات محرمانه را در Git قرار ندهید. نام و مقدار دقیق متغیرها باید با کد فعلی پروژه هماهنگ باشد.

### اجرای پروژه

```bash
npm run dev
```

سپس آدرس زیر را در مرورگر باز کنید:

```text
http://localhost:3000
```

برای ساخت نسخه Production:

```bash
npm run build
npm run start
```

## توسعه‌دهنده

**Mehran Sharifi**

- GitHub: [@mehrandevs](https://github.com/mehrandevs)
- مخزن پروژه: [mehrandevs/nextjs-shop](https://github.com/mehrandevs/nextjs-shop)
- نسخه آنلاین: [nextjs-shop-devs.vercel.app](https://nextjs-shop-devs.vercel.app/)

---

توسعه‌یافته با JavaScript، Next.js، React و MongoDB.
