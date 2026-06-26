"use client";
import React from "react";
import Link from "next/link";
import { Leaf, Menu, X } from "lucide-react";
import { AuthButtons } from "@/components/home/AuthButtons";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../ThemeChange";
import { Button } from "../ui/button";
import { useLanguage } from "@/hooks/use-language";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export function Hero() {
  const { t } = useLanguage();

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <section
          id="hero"
          className="min-h-125 dark:bg-[url('/sat2.png')] bg-[url('/sat1.png')] bg-cover bg-center"
        >
          <div className="relative pt-24 md:pt-36">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <h1 className="mt-8 text-white max-w-4xl mx-auto font-bold text-balance text-5xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                    {t.heroHeading}
                  </h1>
                  <p className="mx-auto text-white mt-8 max-w-2xl text-balance text-md">
                    {t.heroSubheading}
                  </p>
                </AnimatedGroup>
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          delayChildren: 1,
                        },
                      },
                    },
                    item: {
                      hidden: {
                        opacity: 0,
                      },
                      visible: {
                        opacity: 1,
                        transition: {
                          type: "spring" as const,
                          bounce: 0.3,
                          duration: 2,
                        },
                      },
                    },
                  }}
                >
                  <div className="absolute inset-0 z-0 pointer-events-none gradient dark:gradDark" />
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    item: transitionVariants.item,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <AuthButtons className="w-40" />
                  <Button variant="secondary" size="lg" className="w-35 h-12">
                    <Link href="#problem" className="w-full">
                      {t.nav.learnMore}
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                item: transitionVariants.item,
              }}
            >
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <div
                    className="bg-background aspect-15/8 relative rounded-2xl
                  dark:bg-[url('/dashdark.png')] bg-[url('/dashlight.png')] bg-cover bg-center"
                  ></div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}

const HeroHeader = () => {
  const { t } = useLanguage();
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: t.nav.problem, href: "#problem" },
    { name: t.nav.solution, href: "#solution" },
    { name: t.nav.features, href: "#feature" },
    { name: t.nav.howItWorks, href: "#how-it-works" },
  ];

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2 group"
      >
        <div
          className={cn(
            "bg-background/40 mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:pl-12 lg:pr-6 backdrop-blur-sm rounded-2xl border",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:pl-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:flex-1 lg:justify-start items-center">
              <Link
                href="/"
                aria-label="home"
                className={cn(
                  "flex items-center transition-colors duration-300 text-black dark:text-white",
                  isScrolled ? "gap-0" : "gap-2"
                )}
              >
                <Leaf className="size-6 shrink-0 text-emerald-700 dark:text-emerald-500" />
                <span
                  className={cn(
                    "text-2xl font-bold logoFace transition-all duration-300 ease-in-out whitespace-nowrap inline-block overflow-hidden",
                    isScrolled ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
                  )}
                >
                  {t.title}
                </span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 block cursor-pointer p-2.5 lg:hidden transition-colors duration-300 text-black dark:text-white"
              >
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="hidden lg:flex lg:flex-none lg:justify-center px-4">
              <ul className="flex gap-6 xl:gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="block duration-150 transition-colors font-medium text-black dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-nowrap"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:flex-1 lg:justify-end lg:gap-4 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-black dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 block duration-150 font-medium"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col justify-center items-center space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <LanguageSwitcher isScrolled={isScrolled} />
                <ModeToggle />
                <AuthButtons isScrolled={isScrolled} />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
