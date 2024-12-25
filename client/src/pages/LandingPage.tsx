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
                    alt="HumaniChain Logo"
                    className="h-8 w-8"
                  />
                  <span className="font-bold text-xl text-primary">
                    HumaniChain
                  </span>
                </div>
              </Link>
            </div>
            <Button asChild variant="default" size="sm">
              <Link href="/dashboard">Open App</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
          <div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                Smart Investing for
                <span className="text-primary"> Social Good</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-center">
                Support humanitarian causes without spending a dime. Simply deposit your funds,
                earn returns, and make an impact while keeping full control of your money.
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

      {/* Who We Are Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Who We Are
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              A passionate individual driven by the belief that technology and
              finance can be powerful forces for good. With a background in both
              finance and blockchain technology and a network in humanitarian
              aid, I've created HumaniChain to bridge the gap between profitable
              investing and meaningful social impact.
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              The mission of HumaniChain is to revolutionize charitable giving
              by creating sustainable funding streams through innovative
              financial technologies. I believe that by combining the efficiency
              of Decentralized Finance (read: blockchain-powered peer-to-peer
              finance) with the heart of humanitarian aid, we can create lasting
              positive change in communities worldwide.
            </p>
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
              &copy; {new Date().getFullYear()} HumaniChain. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}