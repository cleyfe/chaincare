import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coins, ShieldCheck, BarChart3, PiggyBank, Banknote, Heart } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
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
                Turn your investments into impact. Our secure platform helps fund humanitarian aid, animal welfare, and community projects while protecting your capital.
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
            <h2 className="text-base font-semibold leading-7 text-primary">Impact Investment</h2>
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
                <dt className="text-lg font-semibold">
                  Secure Investment
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground">
                  Your principal remains safe and under your control
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 rounded-lg bg-primary/10 p-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <dt className="text-lg font-semibold">
                  Generate Returns
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground">
                  Earn competitive interest rates
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 rounded-lg bg-primary/10 p-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <dt className="text-lg font-semibold">
                  Create Impact
                </dt>
                <dd className="mt-2 text-sm text-muted-foreground">
                  Your returns fund verified humanitarian projects
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-24 sm:py-32">
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
                    <h3 className="text-xl font-semibold mb-2">1. Deposit Your Funds</h3>
                    <p className="text-muted-foreground">
                      Connect your wallet and deposit funds into our secure lending vault. 
                      Your deposit remains under your control and can be withdrawn at any time.
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
                    <h3 className="text-xl font-semibold mb-2">2. Generate Interest</h3>
                    <p className="text-muted-foreground">
                      Your deposit automatically generates interest through established lending protocols.
                      Think of it like a savings account, but with a purpose.
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
                    <h3 className="text-xl font-semibold mb-2">3. Create Impact</h3>
                    <p className="text-muted-foreground">
                      The interest earned is automatically directed to verified humanitarian projects.
                      You keep your deposit while your returns make a real difference in the world.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}