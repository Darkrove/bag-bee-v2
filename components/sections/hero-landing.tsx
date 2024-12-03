import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
  return (
    <section className="space-y-6">
      <div className="relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-background p-20">
        <div className="container flex max-w-screen-md flex-col items-center gap-5 text-center">
          <Link
            href="https://next-saas-stripe-starter.vercel.app/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm", rounded: "xl" }),
              "px-4",
            )}
            target="_blank"
          >
            <span className="mr-3">🎉</span> Famous Bag House
          </Link>

          <h1 className="text-balance font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
            A{" "}
            <span className="bg-gradient-to-r from-primary via-green-300 to-cyan-300 bg-clip-text text-transparent">
              POS
            </span>{" "}
            System for Managing Business
          </h1>

          <p className="max-w-2xl text-balance text-muted-foreground sm:text-lg">
            Forget past mistakes. <b>Forget failures.</b> Forget everything
            except what you&apos;re going to do now and do it.
          </p>

          <div className="flex flex-col items-center justify-center space-x-0 space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <Link
              href="/login"
              prefetch={true}
              className={cn(
                buttonVariants({ rounded: "xl", size: "lg" }),
                "w-full text-[15px]",
              )}
            >
              <span>Login</span>
              <Icons.arrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="https://github.com/mickasmt/next-auth-roles-template"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  rounded: "xl",
                  size: "lg",
                }),
                "w-full text-[15px]",
              )}
            >
              <Icons.gitHub className="mr-2 size-4" />

              <span>GitHub</span>
            </Link>
          </div>
        </div>
        <AnimatedGridPattern
          numSquares={20}
          maxOpacity={0.05}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
          )}
        />
      </div>
    </section>
  );
}
