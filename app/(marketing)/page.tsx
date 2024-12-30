
import HeroLanding from "@/components/sections/hero-landing";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
});

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
    </>
  );
}
