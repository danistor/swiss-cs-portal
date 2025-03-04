# Development Log - Initial Setup

04/03/2025

## Ticket management

- Dashboard for listing and viewing tickets
- added seeds for creating more users, tickets, conversations and messages
- added react router devtools

03/03/2025

## Setup

- React Router in framework mode
- Clerk `npm install @clerk/react-router` and added keys in `.env` file
  - configured Clerk in `root.tsx`
- Shadcn/ui `npx shadcn@latest init`
- Prisma
  - initial setup `npx prisma migrate dev --name init`
  - after `shema.prisma` changed `npx prisma migrate dev --name enhanced_schema`
  - seed with `npx prisma db seed`
  - reset db for re-seeding `npx prisma migrate reset` -> it automatically apply the new seeds
- i18n
  - use remix-18n -> need to finish
- Created services for interacting with prisma models like user, ticket, message, conversation, responseTemplate

## Database & Authentication

- Set up PostgreSQL database schema using Prisma
- Created comprehensive data models for:
  - Users with role-based access (Admin, Manager, Agent, Customer)
  - Tickets with priority and status tracking
  - Responses linked to tickets and users
  - Tags for ticket categorization
  - AI metrics tracking system
- Configured Clerk for user authentication (referenced in User model)

## Internationalization

- Implemented i18next for multilingual support
- Set up translation files starting with English locale
- Added language preference tracking in User model
- Default language set to "en"

## UI Components

- Started building the home page with React Router
- Implemented UI components:
  - Card layout for main content
  - Button components
  - Responsive container design
- Added basic styling with Tailwind CSS

## Environment & Configuration

- Set up development environment
- Configured .gitignore for sensitive files
- Established database connection handling for dev/prod environments

## Created services for interacting with prisma models like user, ticket, message, conversation, responseTemplate

## Added a Prisma seed and seeded the models

## Next Steps

- Implement ticket creation flow
- Add more language translations
- Build out user dashboard
- Integrate AI features for sentiment analysis and ticket classification
