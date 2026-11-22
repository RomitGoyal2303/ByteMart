<div align="center">

# ByteMart — High-Performance E-Commerce Monorepo 🛒

**Enterprise-grade, type-safe full-stack e-commerce platform orchestrating storefront, admin back-office, and backend services.**

[![Turborepo](https://img.shields.io/badge/Orchestration-Turborepo-ef4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![React 19](https://img.shields.io/badge/Frontend-React_19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TanStack](https://img.shields.io/badge/State_%26_Routing-TanStack_Router_%26_Query-ff4154?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle_MySQL-c5f74f?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_5.7-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Biome](https://img.shields.io/badge/Linter-Biome_Fast-60a5fa?style=for-the-badge&logo=biome&logoColor=white)](https://biomejs.dev/)

</div>

---

## 📌 Problem Statement

Traditional distributed e-commerce architectures face frequent operational and developer velocity bottlenecks:
- **Contract & Schema Drift:** Inconsistencies between backend API response formats and client-side TypeScript types result in silent runtime bugs.
- **Fragmented Codebases:** Separating storefront, admin management, and API services across multiple repositories duplicates data transfer objects (DTOs) and validation schemas.
- **Slow Tooling & Build Pipelines:** Standard bundling and linting pipelines degrade iteration velocity across multi-package projects.

**ByteMart** eliminates these problems using an integrated **Turborepo Monorepo** powered by **pnpm workspaces**. The customer storefront (`apps/web`), administrative console (`apps/admin`), and REST server (`apps/server`) share a centralized, type-safe database layer (`@bytemart/database`), common API interfaces (`@bytemart/types`), and high-speed Rust-based linting with **Biome**.

---

## 🏗️ System Architecture & Monorepo Topology

```mermaid
flowchart TD
    subgraph ClientLayer ["Applications (apps/)"]
        Web["apps/web\n(React 19 + Vite + TanStack Router/Query + Zustand)"]
        Admin["apps/admin\n(Administrative Inventory & Orders Dashboard)"]
        Server["apps/server\n(Node.js + Express.js + Zod Validation)"]
    end

    subgraph PackageLayer ["Shared Workspaces (packages/)"]
        Types["packages/types\n(Shared DTOs & Validation Schemas)"]
        DB["packages/database\n(Drizzle ORM + Drizzle Kit Migrations)"]
        TSConfig["packages/typescript-config\n(Centralized tsconfig presets)"]
    end

    subgraph StorageLayer ["Persistence & Cloud Infrastructure"]
        MySQL[("MySQL 8.0 Database\n(InnoDB Relational Engine)")]
        Docker["Docker Compose\n(Local MySQL Orchestration)"]
        UploadThing["UploadThing\n(Cloud Product Asset Storage)"]
    end

    Web -->|Imports DTOs| Types
    Admin -->|Imports DTOs| Types
    Server -->|Validates with Zod| Types

    Web -->|Shared Presets| TSConfig
    Admin -->|Shared Presets| TSConfig
    Server -->|Shared Presets| TSConfig
    DB -->|Shared Presets| TSConfig

    Server -->|Queries via Drizzle| DB
    DB -->|SQL Queries & Schema Migrations| MySQL
    Docker -.->|Runs Local Container| MySQL
    Server -.->|Streams Image Assets| UploadThing

    Web -->|HTTP / JSON REST API| Server
    Admin -->|HTTP / JSON REST API| Server
```

---

## 🔄 End-to-End Request & Checkout Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Web as React Web Storefront
    participant Server as Express REST API
    participant Auth as JWT Auth Middleware
    participant Controller as Order Controller
    participant DB as Drizzle ORM (MySQL)

    Customer->>Web: Submits Order with Cart Items & Shipping Address
    Web->>Server: POST /api/orders (Bearer JWT Token, OrderPayload)
    Server->>Auth: Validate JWT authentication token
    alt Token Invalid / Expired
        Auth-->>Web: 401 Unauthorized
    else Token Valid
        Auth->>Controller: Forward decoded User context
        Controller->>DB: Query product stock quantities within MySQL transaction
        alt Stock Insufficient
            DB-->>Controller: Stock conflict detected
            Controller-->>Web: 409 Conflict ("Product out of stock")
        else Stock Available
            Controller->>DB: Deduct inventory stock & create Order record
            DB-->>Controller: Order saved (order_id, status: 'pending')
            Controller-->>Web: 201 Created (Order Confirmation Details)
            Web-->>Customer: Display Order Summary & Invoice
        end
    end
```

---

## 💻 Tech Stack & Engineering Decisions

| Layer | Technologies | Rationale |
| :--- | :--- | :--- |
| **Monorepo Engine** | Turborepo, pnpm Workspaces | Parallel task scheduling, pipeline dependency caching, and zero-duplicate symlinking. |
| **Storefront Client** | React 19, Vite, TanStack Router | File-based routing with strict URL search parameter validation via TanStack Router; fast HMR with Vite. |
| **Client State & Data Fetching** | TanStack Query v5, Zustand | Asynchronous server-cache synchronization, automatic retries, and optimistic UI updates paired with lightweight cart state. |
| **Styling & Design System** | Tailwind CSS v4, Radix UI | Accessible headless primitives with utility-first CSS styling and automated class merging (`clsx`, `tailwind-merge`). |
| **Backend REST API** | Node.js, Express.js, TypeScript | Clean route-controller-middleware architecture with runtime payload parsing using Zod. |
| **Database & ORM** | MySQL, Drizzle ORM, Drizzle Kit | Direct-to-SQL compiler with zero runtime overhead, TypeScript schema definitions, and automated database migrations. |
| **Code Quality & CI/CD** | Biome, Husky, Dotenv-CLI | Sub-millisecond formatting and linting via Rust-based Biome, pre-commit enforcement via Husky hooks. |

---

## 🗄️ Relational Database Schema Design

The relational schema (`packages/database/src/schema`) enforces integrity constraints across users, products, addresses, and orders:

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o{ ADDRESSES : owns
    USERS ||--o{ ENGAGEMENT : writes
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : contains_product
    PRODUCTS ||--o{ ENGAGEMENT : receives_reviews

    USERS {
        varchar id PK
        varchar email UK
        varchar password_hash
        varchar role
        datetime created_at
    }
    PRODUCTS {
        varchar id PK
        varchar title
        decimal price
        int stock_quantity
        varchar category
        json image_urls
    }
    ORDERS {
        varchar id PK
        varchar user_id FK
        decimal total_amount
        varchar order_status
        datetime created_at
    }
    ADDRESSES {
        varchar id PK
        varchar user_id FK
        varchar street
        varchar city
        varchar postal_code
    }
    ENGAGEMENT {
        varchar id PK
        varchar user_id FK
        varchar product_id FK
        int rating
        text review_text
    }
```

---

## 📡 Core API Specification

| Method | Endpoint | Access Level | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer account with email/password | `201`, `400` |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT cookie | `200`, `401` |
| `GET` | `/api/products` | Public | Paginated product catalogue with category filters | `200` |
| `GET` | `/api/products/:id` | Public | Product details with inventory availability | `200`, `404` |
| `POST` | `/api/products` | Admin | Create product listing with media asset URLs | `201`, `403` |
| `POST` | `/api/orders` | Customer | Place order with atomic stock validation | `201`, `409` |
| `GET` | `/api/orders/my` | Customer | Fetch logged-in user order history | `200` |
| `PATCH` | `/api/orders/:id/status`| Admin | Update order state (`processing`, `shipped`, `delivered`) | `200`, `403` |
| `POST` | `/api/addresses` | Customer | Add verified shipping address | `201`, `400` |

---

## 📁 Repository Directory Structure

```
ByteMart/
├── apps/
│   ├── admin/                    # Administrative inventory & orders management
│   │   ├── src/                  # Admin UI components & dashboard views
│   │   └── package.json
│   ├── server/                   # Express.js REST API with Zod validation
│   │   ├── src/
│   │   │   ├── controllers/      # Route handler logic (auth, products, orders)
│   │   │   ├── middlewares/      # JWT auth, error handlers, Winston logger
│   │   │   ├── routes/           # REST endpoint definitions
│   │   │   └── utils/            # Winston logger, environment helpers
│   │   └── package.json
│   └── web/                      # React 19 customer storefront (Vite + TanStack)
│       ├── src/
│       │   ├── routes/           # Type-safe file-based TanStack routes
│       │   ├── components/       # Radix UI + Tailwind design components
│       │   └── stores/           # Zustand cart and session stores
│       └── package.json
├── packages/
│   ├── database/                 # Drizzle ORM schemas, migrations, seeders
│   ├── types/                    # Shared TypeScript interfaces & API contracts
│   └── typescript-config/        # Centralized tsconfig presets
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
- **pnpm**: `v9.0.0` or higher (`npm install -g pnpm`)
- **Docker**: For running local MySQL database

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/RomitGoyal2303/ByteMart.git
cd ByteMart
pnpm install
```

### 2. Configure Environment Variables
Create a root `.env` file:
```env
DATABASE_URL=mysql://root:password@localhost:3306/bytemart
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Database Ingestion & Migrations
```bash
# Start MySQL in Docker
docker-compose up -d

# Generate Drizzle migration files and push schema to MySQL
pnpm db:generate
pnpm db:migrate
```

### 4. Run Development Servers
```bash
pnpm dev
```
- Storefront (`apps/web`): `http://localhost:5173`
- Backend API (`apps/server`): `http://localhost:5000`

---

## 🔒 Security & Defensive Engineering

- **Type-Safe Validation:** Request payloads are checked at the network boundary with Zod schemas before hitting business logic.
- **SQL Injection Prevention:** Queries run through Drizzle ORM parameterized prepared statements.
- **Password Salting:** Passwords hashed with salted bcrypt rounds before persistence.
- **Stateless Authorization:** Authenticated routes verify cryptographic JWT signatures in HTTP-only cookies.
- **Environment Isolation:** Zero credentials in source control; `.gitignore` guards all `.env` files.

---

## 📈 Engineering Roadmap

- [ ] **Redis Caching:** Implement distributed cache layer for read-heavy product catalog listings.
- [ ] **Stripe / Razorpay Payments:** Webhook-driven payment confirmation workflows.
- [ ] **Elasticsearch / Meilisearch:** Full-text fuzzy search for large inventory catalogs.
- [ ] **Automated Testing:** End-to-end Playwright tests and Vitest unit coverage.

---

## 👨‍💻 Author

**Romit Kumar**
- Department of Electronics & Communication Engineering
- Maulana Azad National Institute of Technology (MANIT), Bhopal
- GitHub: [@RomitGoyal2303](https://github.com/RomitGoyal2303)
- Email: `romigoyal2004@gmail.com`
