import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Coins,
  ShieldCheck,
  BarChart3,
  PiggyBank,
  Banknote,
  Heart,
  Info,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <img
                    src="/logo.svg"
                    alt="ChainCare Logo"
                    className="h-8 w-8"
                  />
                  <span className="font-bold text-xl text-primary">
                    ChainCare
                  </span>
                </div>
              </Link>
            </div>
            <div className="flex gap-4">
              <Link href="/faq">
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  FAQ
                </Button>
              </Link>
              <Button asChild variant="default" size="sm">
                <Link href="/dashboard">Open App</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
          <div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                Fund Good Actions Without Spending a Dime
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-center">
                Simply deposit your funds, earn returns, and create impact while keeping full control. 
                Withdraw anytime – your money works for good while staying yours.
              </p>
              <div className="mt-8 flex gap-x-4 sm:justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/dashboard">
                    Access Platform
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Investment Section */}
      <div className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Impact Investment
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A New Way to Create Change
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 rounded-lg bg-primary/10 p-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <dt className="text-lg font-semibold">Secure Investment</dt>
                <dd className="mt-2 text-sm text-muted-foreground">
                  Your principal remains safe and under your control
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 rounded-lg bg-primary/10 p-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <dt className="text-lg font-semibold">
                  Generate Returns for Good
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground">
                  Turn investment yields into positive change
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 rounded-lg bg-primary/10 p-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <dt className="text-lg font-semibold">Create Impact</dt>
                <dd className="mt-2 text-sm text-muted-foreground">
                  Your returns fund verified humanitarian projects
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-16">
              How It Works
            </h2>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-16">
              {/* Step 1: Deposit */}
              <div className="relative">
                <div className="flex items-center space-x-6">
                  <div className="rounded-full bg-primary/10 p-6">
                    <PiggyBank className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      1. Deposit Your Funds
                    </h3>
                    <p className="text-muted-foreground">
                      Connect your wallet and deposit funds into our secure
                      lending vault. Your deposit remains under your control and
                      can be withdrawn at any time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Generate Interest */}
              <div className="relative">
                <div className="flex items-center space-x-6">
                  <div className="rounded-full bg-primary/10 p-6">
                    <Coins className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      2. Generate Interest
                    </h3>
                    <p className="text-muted-foreground">
                      Your deposit automatically generates interest through
                      established lending protocols. Think of it like a savings
                      account, but with a purpose.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Create Impact */}
              <div className="relative">
                <div className="flex items-center space-x-6">
                  <div className="rounded-full bg-primary/10 p-6">
                    <Banknote className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      3. Create Impact
                    </h3>
                    <p className="text-muted-foreground">
                      The interest earned is automatically directed to verified
                      humanitarian projects. You keep your deposit while your
                      returns make a real difference in the world.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-16">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-16">
              <div>
                <h3 className="text-xl font-semibold mb-4">What is Decentralized Finance (DeFi)?</h3>
                <p className="text-muted-foreground">
                  DeFi is a modern financial system that operates on blockchain technology without traditional 
                  intermediaries like banks. It's like having a digital banking system that's open to everyone, 
                  transparent with all transactions publicly visible, available 24/7, and automated through 
                  smart contracts.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">What does Non-Custodial mean?</h3>
                <p className="text-muted-foreground">
                  Non-custodial means you maintain full control over your funds at all times. Think of it like 
                  having a personal safe that only you have the key to. You don't need to trust us with your money, 
                  only you can access and move your funds, and you can withdraw your deposits at any time.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">What are Smart Contracts?</h3>
                <p className="text-muted-foreground">
                  Smart contracts are like digital vending machines: they automatically execute actions when 
                  certain conditions are met. They provide automated execution without human intervention, 
                  transparent rules that cannot be changed once deployed, and secure, tamper-proof operation 
                  with open-source code that anyone can verify.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">How do Lending Protocols Work?</h3>
                <p className="text-muted-foreground">
                  Lending protocols are decentralized platforms that facilitate lending and borrowing of 
                  digital assets. Users deposit funds into a lending pool, borrowers take loans by providing 
                  collateral, and interest rates are automatically adjusted based on supply and demand. In 
                  ChainCare's case, we use these protocols to generate returns on your deposits, which are then 
                  directed to humanitarian causes while your initial deposit remains safe and under your control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Make an Impact?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Join our community of impact investors and start creating positive
              change today. Your investment can make a real difference in the
              world.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard">
                  Start Investing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/dashboard">
              <span className="text-sm leading-6 text-muted-foreground hover:text-primary">
                Dashboard
              </span>
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-sm leading-6 text-muted-foreground">
              &copy; {new Date().getFullYear()} ChainCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}