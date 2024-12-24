import { ethers } from 'ethers';

const MORPHO_VAULT_ABI = [
  // Simplified ABI
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 shares) external",
  "function getPricePerShare() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

const MORPHO_VAULT_ADDRESS = "0x..."; // Add actual address

export class MorphoVault {
  private contract: ethers.Contract;

  constructor(provider: ethers.BrowserProvider) {
    this.contract = new ethers.Contract(
      MORPHO_VAULT_ADDRESS,
      MORPHO_VAULT_ABI,
      provider.getSigner()
    );
  }

  async deposit(amount: string) {
    const tx = await this.contract.deposit(
      ethers.parseEther(amount)
    );
    return await tx.wait();
  }

  async withdraw(shares: string) {
    const tx = await this.contract.withdraw(
      ethers.parseEther(shares)
    );
    return await tx.wait();
  }

  async getBalance(address: string) {
    const balance = await this.contract.balanceOf(address);
    return ethers.formatEther(balance);
  }

  async getPricePerShare() {
    const price = await this.contract.getPricePerShare();
    return ethers.formatEther(price);
  }
}