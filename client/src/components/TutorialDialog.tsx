import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Coins, 
  ArrowRight, 
  Building2, 
  Users2, 
  LineChart,
  ListChecks
} from "lucide-react";

const tutorialSteps = [
  {
    title: "Welcome to HumaniChain",
    description: "Learn how our innovative platform revolutionizes humanitarian aid through transparent and efficient asset management.",
    icon: Building2,
  },
  {
    title: "Make an Impact Investment",
    description: "Invest your funds in our secure investment pool. Your principal remains safe while generating returns for humanitarian causes.",
    icon: Coins,
  },
  {
    title: "Generate Returns",
    description: "Your investment generates returns through established financial protocols, creating a sustainable source of funding for aid.",
    icon: LineChart,
  },
  {
    title: "Transparent Distribution",
    description: "100% of the generated returns are used to fund verified humanitarian projects. Every transaction is recorded and traceable.",
    icon: Users2,
  },
  {
    title: "Track Impact",
    description: "Monitor the real impact of your contribution through our dashboard. View project details and audit trails of all distributions.",
    icon: ListChecks,
  },
];

export function TutorialDialog() {
  const [open, setOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("tutorial-completed", "true");
      setOpen(false);
    }
  };

  const CurrentIcon = tutorialSteps[currentStep].icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CurrentIcon className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {tutorialSteps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {tutorialSteps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 py-4">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                index === currentStep
                  ? "bg-primary w-3"
                  : index < currentStep
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={handleNext}>
            {currentStep === tutorialSteps.length - 1 ? (
              "Get Started"
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}