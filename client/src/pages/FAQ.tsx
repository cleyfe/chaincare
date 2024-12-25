import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <img
                  src="/logo.svg"
                  alt="HumaniChain Logo"
                  className="h-8 w-8"
                />
                <span className="font-bold text-xl text-primary">
                  HumaniChain
                </span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">
              Understanding the technology behind HumaniChain
            </p>
          </div>

          <div className="space-y-8">
            <section id="defi" className="scroll-mt-16">
              <h2 className="text-2xl font-semibold mb-4">What is Decentralized Finance (DeFi)?</h2>
              <p className="text-muted-foreground">
                Decentralized Finance, or DeFi, is a modern financial system that operates on blockchain technology 
                without traditional intermediaries like banks. It's like having a digital banking system that's:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                <li>Open to everyone with an internet connection</li>
                <li>Transparent - all transactions are publicly visible</li>
                <li>Available 24/7 without any downtime</li>
                <li>Automated through smart contracts</li>
              </ul>
            </section>

            <section id="non-custodial" className="scroll-mt-16">
              <h2 className="text-2xl font-semibold mb-4">What does Non-Custodial mean?</h2>
              <p className="text-muted-foreground">
                Non-custodial means you maintain full control over your funds at all times. Think of it like 
                having a personal safe that only you have the key to:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                <li>You don't need to trust us with your money</li>
                <li>Only you can access and move your funds</li>
                <li>You can withdraw your deposits at any time</li>
                <li>We never take possession of your assets</li>
              </ul>
            </section>

            <section id="smart-contracts" className="scroll-mt-16">
              <h2 className="text-2xl font-semibold mb-4">What are Smart Contracts?</h2>
              <p className="text-muted-foreground">
                Smart contracts are like digital vending machines: they automatically execute actions when 
                certain conditions are met. Key features include:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                <li>Automated execution - no human intervention needed</li>
                <li>Transparent rules that cannot be changed once deployed</li>
                <li>Secure and tamper-proof operation</li>
                <li>Open source code that anyone can verify</li>
              </ul>
            </section>

            <section id="lending-protocols" className="scroll-mt-16">
              <h2 className="text-2xl font-semibold mb-4">How do Lending Protocols Work?</h2>
              <p className="text-muted-foreground">
                Lending protocols are decentralized platforms that facilitate lending and borrowing of 
                digital assets. Here's how they work:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
                <li>Users deposit funds into a lending pool</li>
                <li>Borrowers take loans from this pool by providing collateral</li>
                <li>Interest rates are automatically adjusted based on supply and demand</li>
                <li>Lenders earn interest on their deposits</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                In HumaniChain's case, we use these protocols to generate returns on your deposits, 
                which are then directed to humanitarian causes while your initial deposit remains safe 
                and under your control.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
