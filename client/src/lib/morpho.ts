import { ethers } from 'ethers';

const IPOR_VAULT_ABI = [
  // Core ERC20 functions needed for approve + deposit
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  // Vault specific functions from the contract
  "function deposit(uint256 assets, address receiver) external returns (uint256)",
  "function withdraw(uint256 assets, address receiver, address owner) external returns (uint256)",
  "function maxDeposit(address) external view returns (uint256)",
  "function totalAssets() external view returns (uint256)",
  "function convertToAssets(uint256 shares) external view returns (uint256)",
  "function convertToShares(uint256 assets) external view returns (uint256)",
  "function getPricePerShare() external view returns (uint256)",
  "function getAPY() external view returns (uint256)"
];

const IPOR_VAULT_ADDRESS = "0x45aa96f0b3188d47a1dafdbefce1db6b37f58216";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export class MorphoVault {
  private vaultContract: ethers.Contract;
  private usdcContract: ethers.Contract;
  private provider: ethers.BrowserProvider;

  constructor(provider: ethers.BrowserProvider) {
    this.provider = provider;
    this.vaultContract = new ethers.Contract(
      IPOR_VAULT_ADDRESS,
      IPOR_VAULT_ABI,
      provider
    );
    this.usdcContract = new ethers.Contract(
      USDC_ADDRESS,
      ["function approve(address spender, uint256 amount) external returns (bool)"],
      provider
    );
  }

  async deposit(amount: string) {
    const signer = await this.provider.getSigner();
    const usdcWithSigner = this.usdcContract.connect(signer);
    const vaultWithSigner = this.vaultContract.connect(signer);

    // First approve USDC spend
    const approvalTx = await usdcWithSigner.approve(
      IPOR_VAULT_ADDRESS,
      ethers.parseEther(amount)
    );
    await approvalTx.wait();

    // Then deposit into vault
    const depositTx = await vaultWithSigner.deposit(
      ethers.parseEther(amount),
      await signer.getAddress()
    );
    return await depositTx.wait();
  }

  async withdraw(assets: string) {
    const signer = await this.provider.getSigner();
    const vaultWithSigner = this.vaultContract.connect(signer);
    const address = await signer.getAddress();

    const tx = await vaultWithSigner.withdraw(
      ethers.parseEther(assets),
      address,
      address
    );
    return await tx.wait();
  }

  async getBalance(address: string) {
    const balance = await this.vaultContract.balanceOf(address);
    return ethers.formatEther(balance);
  }

  async getPricePerShare() {
    const price = await this.vaultContract.getPricePerShare();
    return ethers.formatEther(price);
  }

  async getAPY() {
    const apy = await this.vaultContract.getAPY();
    return Number(apy) / 100; // Convert basis points to percentage
  }

  async getMaxDeposit(address: string) {
    const maxDeposit = await this.vaultContract.maxDeposit(address);
    return ethers.formatEther(maxDeposit);
  }

  async getTotalAssets() {
    const totalAssets = await this.vaultContract.totalAssets();
    return ethers.formatEther(totalAssets);
  }

  async estimateGas(amount: string) {
    const signer = await this.provider.getSigner();
    const address = await signer.getAddress();

    // Estimate gas for approval
    const approvalGas = await this.usdcContract.approve.estimateGas(
      IPOR_VAULT_ADDRESS, 
      ethers.parseEther(amount)
    );

    // Estimate gas for deposit
    const depositGas = await this.vaultContract.deposit.estimateGas(
      ethers.parseEther(amount),
      address
    );

    return {
      approval: approvalGas,
      deposit: depositGas,
      total: approvalGas + depositGas
    };
  }
}