# ByteMart — High-Performance Full-Stack E-Commerce Monorepo 🛒

> A production-grade, type-safe e-commerce monorepo built with **React 19**, **Vite**, **TanStack Router & Query**, **Node.js/Express**, **TypeScript**, **Drizzle ORM**, and **MySQL**, orchestrated via **Turborepo** and **pnpm workspaces**.

---

## 📌 Problem Statement & Architecture Vision

Modern enterprise e-commerce platforms struggle with technical debt arising from:
- **Client-Server Contract Drift:** Discrepancies between backend API payloads and frontend state interfaces.
- **Fragmented Codebases:** Separate repositories for web client, administrative dashboards, and backend services that lead to duplicated types and validation logic.
- **Sluggish Build Toolchains:** Traditional bundlers and linters that slow developer feedback loops.

**ByteMart** solves this with an integrated **Turborepo Monorepo** where the web client, admin panel, and Express backend share a unified database access layer (`@bytemart/database`), common TypeScript definitions (`@bytemart/types`), and ultra-fast tooling powered by **Biome** and **pnpm**.

---

## 🏗️ System Architecture & Monorepo Topology

```mermaid
flowchart TD
    subgraph Apps ["Workspaces: Applications"]
        Web["apps/web\n(React 19 + Vite + TanStack Router/Query)"]
        Admin["apps/admin\n(Administrative Management Console)"]
        Server["apps/server\n(Express.js + TypeScript + Zod)"]
    end

    subgraph Packages ["Workspaces: Shared Packages"]
        DB["packages/database\n(Drizzle ORM + Drizzle Kit)"]
        Types["packages/types\n(Shared DTOs & Validation Schemas)"]
        TSConfig["packages/typescript-config\n(Unified Compiler Configurations)"]
    end

    subgraph Infrastructure ["Data & Infrastructure Layer"]
        MySQL[("MySQL Database\n(InnoDB Engine)")]
        Docker["Docker Compose\n(Local Container Orchestration)"]
        UploadThing["UploadThing\n(Cloud Media Asset Storage)"]
    end

    Web -->|Consumes DTOs| Types
    Admin -->|Consumes DTOs| Types
    Server -->|Consumes DTOs| Types

    Web -->|Shared TS Config| TSConfig
    Admin -->|Shared TS Config| TSConfig
    Server -->|Shared TS Config| TSConfig
    DB -->|Shared TS Config| TSConfig

    Server -->|Imports Query Layer| DB
    DB -->|SQL Queries & Migrations| MySQL
    Docker -.->|Hosts Local Service| MySQL
    Server -.->|Media Uploads| UploadThing

    Web -->|HTTP / JSON via Axios| Server
    Admin -->|HTTP / JSON via Axios| Server
```

---

## 💻 Tech Stack & Engineering Rationale

| Layer | Technologies | Rationale |
| :--- | :--- | :--- |
| **Monorepo Engine** | Turborepo, pnpm Workspaces | Efficient pipeline caching, parallel task execution, and symlinked workspace dependencies without overhead. |
| **Web Client (`apps/web`)** | React 19, Vite, TanStack Router, TanStack Query | Client-side routing with type-safe route parameters via TanStack Router; asynchronous server-state synchronization with TanStack Query. |
| **State & Styling** | Zustand, Tailwind CSS v4, Radix UI | Lightweight, unopinionated client store paired with accessible, headless UI primitives and Tailwind v4. |
| **Backend API (`apps/server`)** | Node.js, Express.js, TypeScript, Zod | Fast, unopinionated REST API layer with runtime request payload validation using Zod schemas. |
| **Database & ORM** | MySQL, Drizzle ORM, Drizzle Kit | Type-safe SQL dialect with zero-overhead query compilation, schema declaration in TypeScript, and automated migrations. |
| **Code Quality & Tooling** | Biome, Husky, Dotenv-CLI | Sub-millisecond formatting and linting via Biome (Rust-based), enforcing pre-commit hygiene with Husky hooks. |

---

## 🗄️ Relational Database Schema Design

The persistence layer (`packages/database/src/schema`) models a complete commerce lifecycle:

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o{ ADDRESSES : owns
    USERS ||--o{ ENGAGEMENT : creates
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : referenced_in
    PRODUCTS ||--o{ ENGAGEMENT : reviewed_in

    USERS {
        string id PK
        string email UK
        string password_hash
        string role
        datetime created_at
    }
    PRODUCTS {
        string id PK
        string title
        decimal price
        int stock_quantity
        string category
        json image_urls
    }
    ORDERS {
        string id PK
        string user_id FK
        decimal total_amount
        string order_status
        datetime created_at
    }
    ADDRESSES {
        string id PK
        string user_id FK
        string street
        string city
        string postal_code
    }
```

---

## 📁 Repository Structure

```
ByteMart/
├── apps/
│   ├── admin/                    # Administrative back-office interface
│   ├── server/                   # Express.js REST API with Zod validation
│   │   ├── src/
│   │   │   ├── controllers/      # Route handlers
│   │   │   ├── middlewares/      # Auth (JWT), request logging, error handling
│   │   │   ├── routes/           # REST endpoint definitions
│   │   │   └── utils/            # Winston logger, helpers
│   │   └── package.json
│   └── web/                      # React 19 customer storefront (Vite + TanStack)
│       ├── src/
│       │   ├── routes/           # Type-safe file-based TanStack routes
│       │   ├── components/       # Radix UI + Tailwind design system
│       │   └── stores/           # Zustand cart and session stores
│       └── package.json
├── packages/
│   ├── database/                 # Drizzle ORM schemas, migrations, seeders
│   ├── types/                    # Shared TypeScript interfaces & API contracts
│   └── typescript-config/        # Base tsconfig presets
├── .husky/                       # Pre-commit git hooks
├── biome.json                    # Formatting & linting configuration
├── docker-compose.yml            # Local MySQL database container
├── pnpm-workspace.yaml           # Workspace package definition
├── turbo.json                    # Turborepo task pipeline definition
└── README.md
```

---

## ⚙️ Local Development Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **pnpm**: `v9.0.0` (`npm install -g pnpm`)
- **Docker**: For running local MySQL database (optional if using external instance)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/RomitGoyal2303/ByteMart.git
cd ByteMart
pnpm install
```

### 2. Configure Environment Variables
Create a `.env` file at the root:
```env
DATABASE_URL=mysql://root:password@localhost:3306/bytemart
JWT_SECRET=super_secret_jwt_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Spin Up Database & Run Migrations
```bash
# Start MySQL in Docker (if using docker-compose)
docker-compose up -d

# Generate and apply Drizzle schema migrations
pnpm db:generate
pnpm db:migrate
```

### 4. Start Development Servers
```bash
pnpm dev
```
- Storefront (`apps/web`): `http://localhost:5173`
- API Server (`apps/server`): `http://localhost:5000`

---

## 👨‍💻 Author

**Romit Kumar**
- Institution: Maulana Azad National Institute of Technology (MANIT), Bhopal
- GitHub: [@RomitGoyal2303](https://github.com/RomitGoyal2303)
- Email: `romigoyal2004@gmail.com`
