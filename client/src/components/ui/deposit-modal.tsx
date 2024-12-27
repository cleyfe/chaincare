import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MorphoVault } from "@/lib/morpho";
import { ethers } from "ethers";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
}

export function DepositModal({ isOpen, onClose, amount }: DepositModalProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const { toast } = useToast();

  // Input validation
  const validateAmount = (amount: string): boolean => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 1000000; // Max 1M USDC
  };

  const handleApprove = async () => {
    if (!window.ethereum) {
      toast({
        variant: "destructive",
        title: "Wallet not found",
        description: "Please install a Web3 wallet like MetaMask"
      });
      return;
    }

    if (!validateAmount(amount)) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount between 0 and 1,000,000 USDC"
      });
      return;
    }

    try {
      setIsApproving(true);
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const vault = new MorphoVault(provider);

      // Use permit for gasless approval
      const tx = await vault.approveWithPermit(amount);
      await tx.wait();

      toast({
        title: "Approval successful",
        description: "You can now deposit your USDC into ChainCare"
      });
    } catch (error: any) {
      console.error("Approval error:", error);
      toast({
        variant: "destructive",
        title: "Approval failed",
        description: error.message || "Failed to approve USDC"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleDeposit = async () => {
    if (!window.ethereum || !amount) return;

    if (!validateAmount(amount)) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount between 0 and 1,000,000 USDC"
      });
      return;
    }

    try {
      setIsDepositing(true);
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const vault = new MorphoVault(provider);

      const tx = await vault.deposit(amount);
      await tx.wait();

      toast({
        title: "Deposit successful",
        description: `Successfully deposited ${amount} USDC into ChainCare`
      });
      onClose();
    } catch (error: any) {
      console.error("Deposit error:", error);
      toast({
        variant: "destructive",
        title: "Deposit failed",
        description: error.message || "Failed to deposit USDC"
      });
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit into ChainCare</DialogTitle>
          <DialogDescription>
            You are about to deposit {amount} USDC into the humanitarian fund
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            onClick={handleApprove}
            disabled={isApproving || isDepositing}
            className="w-full"
          >
            {isApproving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              "Approve USDC"
            )}
          </Button>
          <Button
            onClick={handleDeposit}
            disabled={isApproving || isDepositing}
            className="w-full"
          >
            {isDepositing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Depositing...
              </>
            ) : (
              "Deposit"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}