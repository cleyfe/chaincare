import { ethers } from "ethers";

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
  "function getAPY() external view returns (uint256)",
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

  async approveWithPermit(amount: string) {
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
    const { v, r, s } = ethers.utils.splitSignature(signature);

    // Execute the permit
    const tx = await usdcWithSigner.permit(
      address,
      IPOR_VAULT_ADDRESS,
      ethers.parseUnits(amount, 6),
      deadline,
      v,
      r,
      s,
    );

    return tx;
  }

  async deposit(amount: string) {
    const signer = await this.provider.getSigner();
    const vaultWithSigner = this.vaultContract.connect(signer);
    const address = await signer.getAddress();

    const depositTx = await vaultWithSigner.deposit(
      ethers.parseUnits(amount, 6),
      address,
    );
    return await depositTx.wait();
  }

  async withdraw(assets: string) {
    const signer = await this.provider.getSigner();
    const vaultWithSigner = this.vaultContract.connect(signer);
    const address = await signer.getAddress();

    // Convert amount to USDC decimals (6)
    const assetsInUSDC = ethers.parseUnits(assets, 6);

    const tx = await vaultWithSigner.withdraw(assetsInUSDC, address, address);
    return await tx.wait();
  }

  async getBalance(address: string) {
    const balance = await this.vaultContract.balanceOf(address);
    return ethers.formatUnits(balance, 6); // Format with USDC decimals
  }

  async getPricePerShare() {
    const price = await this.vaultContract.getPricePerShare();
    return ethers.formatUnits(price, 6); // Format with USDC decimals
  }

  async getAPY() {
    //const apy = await this.vaultContract.getAPY();
    const apy = 4.2;
    return Number(apy) / 100; // Convert basis points to percentage
  }

  async getMaxDeposit(address: string) {
    const maxDeposit = await this.vaultContract.maxDeposit(address);
    return ethers.formatUnits(maxDeposit, 6); // Format with USDC decimals
  }

  async getTotalAssets() {
    const totalAssets = await this.vaultContract.totalAssets();
    return ethers.formatUnits(totalAssets, 6); // Format with USDC decimals
  }
  async estimateGas(amount: string) {
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
