# 🌿 FoodLoop Platform — Web Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

**FoodLoop** is an AI-powered food waste reduction and surplus redistribution web platform designed to seamlessly connect merchants, non-governmental organizations (NGOs), and consumers. By utilizing real-time dynamic pricing, automated surplus donation workflows, and geolocation-based discovery, FoodLoop transforms potential food waste into economic value and community support.

---

## ✨ Key Features

- 🤖 **AI Dynamic Pricing Engine**: Automatically calculates risk-adjusted markdown discounts (up to 50%) based on batch shelf-life, stock volume, and market parameters to maximize sell-through before expiry.
- 📦 **Smart Inventory & Batch Tracking**: Comprehensive merchant dashboards for monitoring product batches, freshness tiers, stock levels, and real-time status transitions.
- 🤝 **NGO Surplus Donation Routing**: Dedicated portal enabling merchants to instantly route near-expiry items to verified non-profit partners and food banks.
- 🗺️ **Interactive Geolocation Maps**: Geolocation powered by Leaflet to locate nearby food offers, pick-up points, and donation drop-off locations.
- ⚡ **Real-Time SignalR Engine**: Live web socket updates for notifications, order state updates, merchant alerts, and dispute logs.
- 🛡️ **Admin Portal & Commission Control**: Complete platform administrative suite featuring operational analytics, commission rules, dispute resolution, and audit logs.
- 🌐 **RTL-First & Bilingual Support**: Built natively for Arabic (RTL) and English (LTR) experiences, following the custom **"Warm-Tech Organic"** design system with Cairo typography.

---

## 🎨 Design System: "Warm-Tech Organic"

FoodLoop delivers a tactile, approachable UI balancing logistics efficiency with natural sustainability aesthetics.

| Token             | Hex / Specification           | Purpose                                         |
| :---------------- | :---------------------------- | :---------------------------------------------- |
| **Primary Green** | `#005129`                     | Deep forest tone anchoring brand identity       |
| **Mint Neutral**  | `#F4F9F1`                     | Soft surface background reducing visual fatigue |
| **Sunlight Gold** | `#E8AF30`                     | Status highlights, AI badges, and CTA accents   |
| **Typography**    | `Cairo` & `Plus Jakarta Sans` | High-legibility Arabic & Latin script rendering |
| **Layout Flow**   | Native RTL (`dir="rtl"`)      | Fluid 12-column grid optimized for RTL scanning |

---

## 🛠️ Tech Stack & Dependencies

- **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling & Animations**: Tailwind CSS v4, [Framer Motion](https://www.framer.com/motion/), [Lucide React Icons](https://lucide.dev/)
- **State Management**: [Zustand 5](https://zustand-demo.pmnd.rs/)
- **Real-Time Communication**: [@microsoft/signalr](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction)
- **Validation**: [Zod](https://zod.dev/)
- **Mapping**: [Leaflet](https://leafletjs.com/)
- **Code Quality**: ESLint 9, Prettier, Husky

---

## 📂 Architecture & Directory Overview

```
web/
├── public/                 # Static assets, logos, and public media
├── src/
│   ├── app/                # Next.js App Router structure
│   │   ├── admin/          # Admin management suite & fee shell
│   │   ├── dashboard/      # Merchant inventory & pricing portal
│   │   ├── disputes/       # Dispute resolution workflows
│   │   ├── donate/         # NGO surplus donation routing
│   │   ├── inventory/      # Stock tracking & batch management
│   │   ├── landing/        # Bilingual landing page sections & FAQ
│   │   ├── orders/         # Order tracking & processing
│   │   ├── pricing/        # AI pricing recommendation interfaces
│   │   ├── products/       # Consumer catalog & product detail views
│   │   ├── settings/       # User preferences & account configuration
│   │   ├── layout.tsx      # Root application layout
│   │   └── page.tsx        # Dynamic landing entry
│   ├── components/         # Modular & reusable React components
│   │   ├── common/         # Modals, tables, filters, and feedback UI
│   │   ├── inventory/      # Batch cards & stock status badges
│   │   ├── landing/        # Hero, features, FAQ, and footer blocks
│   │   ├── layout/         # Header, navigation bars, and mobile menus
│   │   └── ui/             # Design-system primitive components
│   ├── hooks/              # Custom React hooks (real-time, geolocation)
│   ├── lib/                # API clients, axios configurations, utilities
│   ├── store/              # Zustand global state slices
│   └── utils/              # Formatting, price math, and date helpers
├── Dockerfile              # Production multi-stage Alpine build
├── eslint.config.mjs       # Modern ESLint flat configuration
└── next.config.ts          # Next.js configuration settings
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: `v22.0.0` or higher
- **npm**: `v10.0.0` or higher (or `pnpm` / `yarn`)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/FoodLoopPlatform/web.git
cd web
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Backend API Base URL
NEXT_PUBLIC_BASE_URL=https://foodloop.runasp.net
```

### 3. Running Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🐳 Docker Deployment

The project includes an optimized multi-stage Docker build producing a standalone Next.js server runner.

### Build Image

```bash
docker build \
  --build-arg NEXT_PUBLIC_BASE_URL="https://foodloop.runasp.net" \
  -t foodloop-web:latest .
```

### Run Container

```bash
docker run -d -p 3000:3000 --name foodloop-web-app foodloop-web:latest
```

The application will be accessible at `http://localhost:3000`.

---

## 📋 NPM Scripts Summary

| Command          | Description                                              |
| :--------------- | :------------------------------------------------------- |
| `npm run dev`    | Starts the Next.js development server with hot-reloading |
| `npm run build`  | Builds the production-ready optimized bundle             |
| `npm run start`  | Starts the production server from build output           |
| `npm run lint`   | Runs ESLint analysis across codebase                     |
| `npm run format` | Formats codebase using Prettier                          |

---

## 📄 License

This project is proprietary software developed for the **FoodLoop Platform**. All rights reserved.
