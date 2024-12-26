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

  const handleApprove = async () => {
    if (!window.ethereum) {
      toast({
        variant: "destructive",
        title: "Wallet not found",
        description: "Please install a Web3 wallet like MetaMask"
      });
      return;
    }

    try {
      setIsApproving(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const vault = new MorphoVault(provider);
      
      // Convert amount to USDC decimals (6)
      const amountInUSDC = ethers.parseUnits(amount, 6);
      
      // Use permit for gasless approval
      const tx = await vault.approveWithPermit(amountInUSDC.toString());
      await tx.wait();

      toast({
        title: "Approval successful",
        description: "You can now deposit your USDC"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Approval failed",
        description: error.message
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleDeposit = async () => {
    if (!window.ethereum) return;

    try {
      setIsDepositing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const vault = new MorphoVault(provider);
      
      // Convert amount to USDC decimals (6)
      const amountInUSDC = ethers.parseUnits(amount, 6);
      
      const tx = await vault.deposit(amountInUSDC.toString());
      await tx.wait();

      toast({
        title: "Deposit successful",
        description: `Deposited ${amount} USDC into the humanitarian fund`
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Deposit failed",
        description: error.message
      });
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Confirmation</DialogTitle>
          <DialogDescription>
            You are about to deposit {amount} USDC into the humanitarian fund
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            onClick={handleApprove}
            disabled={isApproving || isDepositing}
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
