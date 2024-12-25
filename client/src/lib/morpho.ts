import { ethers } from 'ethers';

const MORPHO_VAULT_ABI = [
  // Simplified ABI
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 shares) external",
  "function getPricePerShare() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function getAPY() external view returns (uint256)"
];

const MORPHO_VAULT_ADDRESS = "0x..."; // Add actual address

export class MorphoVault {
  private contract: ethers.Contract;
  private provider: ethers.BrowserProvider;

  constructor(provider: ethers.BrowserProvider) {
    this.provider = provider;
    this.contract = new ethers.Contract(
      MORPHO_VAULT_ADDRESS,
      MORPHO_VAULT_ABI,
      provider
    );
  }

  async deposit(amount: string) {
    const signer = await this.provider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    const tx = await contractWithSigner.deposit(
      ethers.parseEther(amount)
    );
    return await tx.wait();
  }

  async withdraw(shares: string) {
    const signer = await this.provider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    const tx = await contractWithSigner.withdraw(
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

  async getAPY() {
    const apy = await this.contract.getAPY();
    return Number(apy) / 100; // Convert basis points to percentage
  }
}