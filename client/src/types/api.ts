export interface Stats {
  totalDeposits: number;
  depositGrowth: number;
  activeProjects: number;
  completedProjects: number;
  totalInterest: number;
  interestRate: number;
  totalDistributed: number;
  beneficiaries: number;
}

export interface VaultDeposit {
  id: number;
  walletAddress: string;
  amount: string;
  timestamp: string;
  txHash: string;
}
