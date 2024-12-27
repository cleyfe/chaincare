# ChainCare - Web3 Humanitarian Aid Platform

ChainCare is an innovative Web3 humanitarian aid platform that transforms charitable giving through blockchain technology, providing transparent and secure donation mechanisms for global impact.

## Features

- Web3 wallet integration
- USDC smart contracts with permit functionality
- Real-time APY from IPOR Protocol
- Impact simulation system
- Secure deposit flow
- Transparent fund tracking

## Tech Stack

- Frontend: React.js with Web3 integration
- Blockchain: Ethereum and Base network support
- Database: PostgreSQL with Drizzle ORM
- Smart Contracts: USDC with permit functionality
- DeFi Integration: IPOR Protocol
- Authentication: Dynamic.xyz Web3 Auth

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+
- PostgreSQL
- A Web3 wallet (MetaMask recommended)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chaincare

# Dynamic.xyz Authentication
VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chaincare.git
cd chaincare
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

## Smart Contract Integration

The platform integrates with the following contracts on Base network:
- IPOR USDC Vault: `0x45aa96f0b3188d47a1dafdbefce1db6b37f58216`
- USDC Token: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## Security

If you discover a security vulnerability, please send an email to security@chaincare.org instead of using the issue tracker.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact support@chaincare.org.
