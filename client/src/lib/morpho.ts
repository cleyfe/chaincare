/**
 * Interface with IPOR USDC Vault on Base network for deposits and withdrawals.
 * Handles USDC transactions and permit functionality for gasless approvals.
 */

import { ethers } from "ethers";

// Core ERC20 and vault functionality
const IPOR_VAULT_ABI = [
  // Core ERC20 functions needed for approve + deposit
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  // Permit functionality
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
  // Vault specific functions from the contract
  "function deposit(uint256 assets, address receiver) external returns (uint256)",
  "function withdraw(uint256 assets, address receiver, address owner) external returns (uint256)",
  "function maxDeposit(address) external view returns (uint256)",
  "function totalAssets() external view returns (uint256)",
  "function convertToAssets(uint256 shares) external view returns (uint256)",
  "function convertToShares(uint256 assets) external view returns (uint256)",
  "function getPricePerShare() external view returns (uint256)",
];

// Contract addresses on Base network
const IPOR_VAULT_ADDRESS = "0x45aa96f0b3188d47a1dafdbefce1db6b37f58216";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const IPOR_API_URL = "https://api.ipor.io/fusion/vaults";

export class ExecutionVault {
  private vaultContract: ethers.Contract;
  private usdcContract: ethers.Contract;
  private provider: ethers.BrowserProvider;

  constructor(provider: ethers.BrowserProvider) {
    this.provider = provider;
    this.vaultContract = new ethers.Contract(
      IPOR_VAULT_ADDRESS,
      IPOR_VAULT_ABI,
      provider,
    );
    this.usdcContract = new ethers.Contract(
      USDC_ADDRESS,
      [
        "function approve(address spender, uint256 amount) external returns (bool)",
        "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)",
        "function nonces(address owner) external view returns (uint256)",
      ],
      provider,
    );
  }

  /**
   * Approve USDC spending using permit signature (gasless)
   * @param amount - Amount of USDC to approve (in decimal form)
   * @returns Transaction object for the permit
   */
  async approveWithPermit(amount: string): Promise<ethers.ContractTransactionResponse> {
    const signer = await this.provider.getSigner();
    const usdcWithSigner = this.usdcContract.connect(signer);
    const address = await signer.getAddress();

    // Get the current nonce
    const nonce = await this.usdcContract.nonces(address);

    // Set deadline to 1 hour from now
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    // Generate the permit signature
    const domain = {
      name: "USD Coin",
      version: "2",
      chainId: (await this.provider.getNetwork()).chainId,
      verifyingContract: USDC_ADDRESS,
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const message = {
      owner: address,
      spender: IPOR_VAULT_ADDRESS,
      value: ethers.parseUnits(amount, 6),
      nonce: nonce,
      deadline,
    };

    const signature = await signer.signTypedData(domain, types, message);
    const sig = ethers.Signature.from(signature);

    // Execute the permit
    return usdcWithSigner.permit(
      address,
      IPOR_VAULT_ADDRESS,
      ethers.parseUnits(amount, 6),
      deadline,
      sig.v,
      sig.r,
      sig.s,
    );
  }

  /**
   * Deposit USDC into the IPOR vault
   * @param amount - Amount of USDC to deposit (in decimal form)
   * @returns Transaction object for the deposit
   */
  async deposit(amount: string): Promise<ethers.ContractTransactionResponse> {
    const signer = await this.provider.getSigner();
    const vaultWithSigner = this.vaultContract.connect(signer);
    const address = await signer.getAddress();

    return vaultWithSigner.deposit(
      ethers.parseUnits(amount, 6),
      address,
    );
  }

  /**
   * Withdraw USDC from the IPOR vault
   * @param assets - Amount of USDC to withdraw (in decimal form)
   * @returns Transaction object for the withdrawal
   */
  async withdraw(assets: string): Promise<ethers.ContractTransactionResponse> {
    const signer = await this.provider.getSigner();
    const vaultWithSigner = this.vaultContract.connect(signer);
    const address = await signer.getAddress();

    // Convert amount to USDC decimals (6)
    const assetsInUSDC = ethers.parseUnits(assets, 6);

    return vaultWithSigner.withdraw(
      assetsInUSDC,
      address,
      address,
    );
  }

  /**
   * Get vault share balance for an address
   * @param address - Ethereum address to check
   * @returns Balance in decimal form
   */
  async getBalance(address: string): Promise<string> {
    const balance = await this.vaultContract.balanceOf(address);
    return ethers.formatUnits(balance, 6); // Format with USDC decimals
  }

  /**
   * Get current price per share in the vault
   * @returns Price per share in decimal form
   */
  async getPricePerShare(): Promise<string> {
    const price = await this.vaultContract.getPricePerShare();
    return ethers.formatUnits(price, 6); // Format with USDC decimals
  }

  /**
   * Get current APY from IPOR API
   * @returns Current APY as a number
   */
  async getAPY(): Promise<number> {
    try {
      const response = await fetch(IPOR_API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch APY from IPOR API');
      }
      const data = await response.json();
      const vault = data.vaults.find(
        (v: any) => v.name === "IPOR USDC Lending Optimizer Base",
      );
      if (!vault) {
        throw new Error('USDC vault not found in IPOR API response');
      }
      return Number(vault.apy); // Ensure we return a number
    } catch (error) {
      console.error('Error fetching APY:', error);
      return 4.2; // Fallback APY if API call fails
    }
  }

  /**
   * Get maximum deposit amount allowed for an address
   * @param address - Ethereum address to check
   * @returns Maximum deposit amount in decimal form
   */
  async getMaxDeposit(address: string): Promise<string> {
    const maxDeposit = await this.vaultContract.maxDeposit(address);
    return ethers.formatUnits(maxDeposit, 6); // Format with USDC decimals
  }

  /**
   * Get total assets in the vault
   * @returns Total assets in decimal form
   */
  async getTotalAssets(): Promise<string> {
    const totalAssets = await this.vaultContract.totalAssets();
    return ethers.formatUnits(totalAssets, 6); // Format with USDC decimals
  }

  /**
   * Estimate gas needed for approval and deposit
   * @param amount - Amount of USDC (in decimal form)
   * @returns Gas estimates for approval and deposit
   */
  async estimateGas(amount: string): Promise<{
    approval: bigint;
    deposit: bigint;
    total: bigint;
  }> {
    const signer = await this.provider.getSigner();
    const address = await signer.getAddress();

    // Estimate gas for approval
    const approvalGas = await this.usdcContract.approve.estimateGas(
      IPOR_VAULT_ADDRESS,
      ethers.parseUnits(amount, 6),
    );

    // Estimate gas for deposit
    const depositGas = await this.vaultContract.deposit.estimateGas(
      ethers.parseUnits(amount, 6),
      address,
    );

    return {
      approval: approvalGas,
      deposit: depositGas,
      total: approvalGas + depositGas,
    };
  }
}