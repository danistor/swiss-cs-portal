# Swiss CS Portal

A multilingual customer service portal with AI-powered ticket classification and analytics, built for Swiss markets.

## Overview

Swiss CS Portal is a full-stack ticketing system designed to handle customer support operations across Switzerland's four official languages (English, German, French, Italian). The application features role-based access control, AI-assisted ticket classification, and comprehensive analytics for tracking team performance and customer interactions.

## Features

### Ticket Management
- Create, view, edit, and reply to support tickets
- Multi-status workflow (New, In Progress, Pending, Resolved, Closed)
- Priority levels (Low, Medium, High, Critical)
- Automated ticket classification with confidence scoring
- Duplicate ticket detection
- Similar ticket matching and linking

### AI-Powered Features
- Real-time ticket categorization with AI suggestions
- Language detection and routing
- Sentiment analysis on messages and tickets
- Category recommendations based on ticket content
- Fallback rule-based classification system

### Multi-Language Support
- Full support for EN, DE, FR, and IT (Swiss official languages)
- Language-based ticket routing
- Per-user language preferences
- i18next internationalization framework

### Analytics Dashboard
- Ticket statistics and metrics
- Agent performance tracking
- Language distribution analysis
- Resolution rate calculations
- Customer satisfaction scoring

### User Roles
- **Customer**: Create and manage own tickets
- **Representative**: Access tickets, reply to customers, view analytics
- **Admin**: Full system access and user management

## Tech Stack

### Frontend
- React 19
- React Router 7.2 (full-stack framework with SSR)
- TypeScript
- Tailwind CSS 4.0
- Radix UI components
- Lucide React icons
- i18next for internationalization

### Backend
- React Router server-side rendering
- Node.js
- Prisma ORM 6.4
- PostgreSQL database

### Authentication
- Clerk authentication (@clerk/react-router)
- Role-based access control
- Automatic user provisioning from Clerk to database

### Development Tools
- TypeScript 5.7
- Vite 5.4
- ESLint & Prettier
- Docker support

## Database Schema

**Core Models:**
- **User**: Customer and agent profiles with role-based permissions
- **Ticket**: Support tickets with AI classification fields
- **Message**: Ticket conversations with sentiment analysis
- **ResponseTemplate**: Reusable message templates by language and category

**Analytics Models:**
- **AgentPerformance**: Daily agent metrics and satisfaction scores
- **TicketMetrics**: Daily ticket volume and resolution statistics
- **LanguageMetrics**: Language usage tracking

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Clerk account (for authentication)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/swiss_cs_portal"
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
VITE_CLERK_SECRET_KEY="sk_test_..."
```

### Database Setup

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev
npx prisma db seed  # Optional: seed with sample data
```

### Development

Start the development server:

```bash
npm run dev
```

Application will be available at `http://localhost:5173`

### Type Checking

```bash
npm run typecheck
```

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
/app
  /components       # Reusable UI components
    /ai            # AI-powered components (CategorySuggestions)
    /dashboard     # Dashboard visualizations
    /tickets       # Ticket-related components
    /ui            # Radix UI component wrappers
  /hooks           # Custom React hooks (useTicketClassification)
  /lib             # Utility functions and database client
  /routes          # React Router routes and pages
  /services        # Server-side business logic
    /ai            # AI classification services
/prisma
  /migrations      # Database migration history
  schema.prisma    # Database schema definition
/public
  /locales         # i18next translation files
```

## API Routes

The application uses React Router's file-based routing:

- `GET /dashboard` - Analytics dashboard (Admin/Representative only)
- `GET /tickets/list` - List all tickets
- `GET /tickets/id/:id` - View ticket details
- `POST /tickets/new` - Create new ticket
- `POST /tickets/edit` - Update ticket
- `POST /tickets/reply` - Add message to ticket

## Docker Deployment

Build and run using Docker:

```bash
docker build -t swiss-cs-portal .
docker run -p 3000:3000 --env-file .env swiss-cs-portal
```

## Key Implementation Details

### Authentication Flow
Uses Clerk for authentication with automatic user provisioning. When a user logs in via Clerk for the first time, a corresponding user record is created in the PostgreSQL database with default Customer role.

### AI Classification
The ticket classification service uses a configurable AI provider (currently implemented with fallback rule-based classification). Categories are suggested in real-time as users type ticket descriptions.

### Role-Based Access
The `requireAuth()` middleware enforces role-based permissions on protected routes, redirecting unauthorized users appropriately.

---

Built with React Router and Prisma ORM
