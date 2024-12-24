import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
          <div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                Transform Humanitarian Aid Through
                <span className="text-primary"> Smart Investing</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-center">
                Join our innovative platform that generates sustainable funding for humanitarian projects through secure investments. Your capital remains protected while the returns create lasting impact.
              </p>
              <div className="mt-8 flex gap-x-4 sm:justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Access Platform
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Impact Investment</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A New Approach to Humanitarian Aid
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We combine traditional financial instruments with modern technology to create a sustainable source of funding for humanitarian projects.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  Secure Investment Pool
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">Your principal investment remains secure while generating returns through established financial protocols.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  Transparent Distribution
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">Track how the investment returns are distributed to verified humanitarian projects in real-time.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  Measurable Impact
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">Access detailed reports and analytics about the impact your investment is making around the world.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
