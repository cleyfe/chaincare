
# ChainCare

ChainCare is a DeFi platform that enables sustainable impact investing through yield-generating vaults on the Base network.

## Features

- Non-custodial yield-generating vaults
- Impact tracking and achievements
- Social sharing capabilities
- Real-time APY monitoring

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, PostgreSQL
- Blockchain: Ethers.js, Dynamic SDK
- Network: Base

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chaincare

# Dynamic.xyz Authentication
VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`:
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chaincare

# Dynamic.xyz Authentication
VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id
```
4. Set up PostgreSQL database:
```bash
# Create database tables
npm run db:push
```
5. Start the development server: `npm run dev`

## Database Setup

The project uses PostgreSQL with Drizzle ORM. To set up your database:

1. Create a PostgreSQL database
2. Update DATABASE_URL in your `.env` file
3. Run `npm run db:push` to create the database schema
4. The schema includes tables for:
   - Users & Authentication
   - Vault deposits
   - Projects & Distributions
   - Rewards & Achievements

## License

GNU Affero General Public License v3.0
