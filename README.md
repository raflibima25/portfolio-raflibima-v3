<h1>raflibima.my.id</h1>
<p>🚀 Personal portfolio website built from scratch using Next.js, TypeScript, Tailwind CSS, Supabase, Firebase, and more.</p>

---

## 📘 Introduction

This is my personal portfolio website, built to showcase my projects, skills, and background as a developer.

The site is constantly evolving as I add new features and improvements. Feel free to explore the source code or use it as inspiration.

Have feedback or questions? Don't hesitate to reach out! 🙌

---

## 🛠 Tech Stack

- **⚛️ Next.js 14**
- **🔰 TypeScript**
- **💠 Tailwind CSS v3**
- **➰ Framer Motion & GSAP**
- **🌊 Lenis (smooth scroll)**
- **💢 React Icons**
- **🌐 next-intl (i18n)**
- **🔐 NextAuth.js**
- **🗄️ Supabase (PostgreSQL)**
- **🔥 Firebase (Firestore)**
- **📧 Nodemailer**
- **〰️ SWR**
- **🦫 Zustand**
- **📏 ESLint & Prettier**

---

## 🚀 Features

### 🗳 Project Showcase

Projects are stored in a Supabase PostgreSQL database and displayed dynamically.

### 📊 Developer Dashboard

Visualizes stats from:

- GitHub contributions
- Wakatime coding activity
- Codewars
- Monkeytype

### 🌍 Internationalization

Multi-language support via `next-intl`.

### 📬 Contact Form

Contact form powered by Nodemailer for direct email delivery.

### 🔐 Authentication

Login with Google or GitHub via NextAuth.js.

---

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/raflibima25/portfolio-raflibima-v3
cd portfolio-raflibima-v3
```

### 2. Install Dependencies

```bash
bun install
```

> ⚠️ Disarankan menggunakan **Bun** agar semua script berjalan dengan benar.

### 3. Configure Environment Variables

Salin `.env.example` ke `.env` dan isi dengan kredensial kamu.

```bash
cp .env.example .env
```

Berikut adalah environment variables yang dibutuhkan:

```env
# Nodemailer
NODEMAILER_PW=your_email_password
NODEMAILER_EMAIL=your_email@example.com

# GitHub Token (for GitHub stats)
GITHUB_READ_USER_TOKEN_PERSONAL=your_github_token

# Umami Analytics (optional)
UMAMI_API_KEY=your_umami_api_key
UMAMI_WEBSITE_ID_SITE=your_site_id
UMAMI_WEBSITE_ID_MYID=your_myid_id

# Wakatime Stats
WAKATIME_API_ID=your_wakatime_id
WAKATIME_API_KEY=your_wakatime_key

# Monkeytype & Codewars
MONKEYTYPE_API_KEY=your_monkeytype_api_key
CODEWARS_USER_ID=your_codewars_username

# Supabase (PostgreSQL)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url
POSTGRES_URL_NO_SSL=your_postgres_url_no_ssl
POSTGRES_URL_NON_POOLING=your_postgres_host
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_db
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication (Google, GitHub, NextAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_app_id
GITHUB_SECRET=your_github_app_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Gemini AI (optional)
GEMINI_API_KEY=your_gemini_api_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_DB_URL=your_firebase_db_url
NEXT_PUBLIC_FIREBASE_CHAT_DB=messages

# Misc
NEXT_PUBLIC_AUTHOR_EMAIL=your_email@example.com
DOMAIN=http://localhost:3000
```

### 4. Database Migration (Supabase)

```bash
bun run db:push
```

Untuk melihat status migrasi:

```bash
bun run db:status
```

### 5. Run Development Server

```bash
bun run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📄 License

This project is licensed under the MIT License.
