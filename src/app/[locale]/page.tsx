'use client';

import Logo from "@/app/Logo";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Sample from "@/components/Sample";
import useLocale from '@/hooks/useLocale';
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BuildIcon from "@mui/icons-material/Build";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import SupportIcon from "@mui/icons-material/Support";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const NavTranslations = useTranslations("nav");
  const LandingTranslations = useTranslations("landing");
  const FeaturesTranslations = useTranslations("features");
  const PricingTranslations = useTranslations("pricing");
  const AboutTranslations = useTranslations("about");
  const locale = useLocale();

  const Features = [
    {
      title: FeaturesTranslations("1.title"),
      description: FeaturesTranslations("1.description"),
      icon: AutoAwesomeIcon,
    },
    {
      title: FeaturesTranslations("2.title"),
      description: FeaturesTranslations("2.description"),
      icon: StopCircleIcon,
    },
    {
      title: FeaturesTranslations("3.title"),
      description: FeaturesTranslations("3.description"),
      icon: SpeedIcon,
    },
    {
      title: FeaturesTranslations("4.title"),
      description: FeaturesTranslations("4.description"),
      icon: BuildIcon,
    },
    {
      title: FeaturesTranslations("5.title"),
      description: FeaturesTranslations("5.description"),
      icon: SupportIcon,
    },
    {
      title: FeaturesTranslations("6.title"),
      description: FeaturesTranslations("6.description"),
      icon: SecurityIcon,
    },
  ];
  return (
    <div className="flex flex-col h-screen">
      <div className="max-w-7xl flex flex-col mx-auto">
        <div className="flex flex-row justify-between p-3 px-10">
          <div className="flex flex-row">
            <Link className="flex flex-row items-center" href="/">
              <Logo width={60} height={60} />
              <h1 className="text-xl font-semibold text-primary">
                {NavTranslations("name")}
              </h1>
            </Link>
          </div>
          <div className="hidden md:flex flex-row gap-6 items-center mr-10">
            <Link href="#features">{NavTranslations("features")}</Link>
            <Link href="#pricing">{NavTranslations("pricing")}</Link>
            <Link href="#about">{NavTranslations("about")}</Link>
            <Link href="#contact">{NavTranslations("contact")}</Link>
            <Link href={`/${locale}/login`}>
              <Button className="px-4 py-0" variant="contained">
                {NavTranslations("login")}
              </Button>
            </Link>
          </div>
        </div>
        <div className="hero flex mt-5 flex-col items-center justify-center mx-auto px-4">
          <h1 className="text-3xl md:text-5xl mb-3 font-bold text-primary text-center max-w-2xl">
            {LandingTranslations("title")}
          </h1>
          <p className="text-base md:text-lg text-muted text-center">
            {LandingTranslations("description")}
          </p>
        </div>
        <div className="heroSample mt-5 w-full relative lg:h-[60rem] h-[30rem] overflow-hidden  md:block">
          <div className="transform  md:scale-75 rotate-[3deg] w-full max-w-4xl mx-auto absolute z-0 top-0 left-0 transition-all duration-500 ease-in-out hover:z-20 hover:scale-[1.008] hover:shadow-2xl">
            <div className="bg-gray-200 rounded-lg p-4 transition-all duration-500 hover:bg-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden p-4">
                <Sample />
              </div>
            </div>
          </div>
          <div className="transform  md:scale-75 rotate-[10deg] w-full max-w-4xl mx-auto absolute z-10 top-10 right-10 transition-all duration-500 ease-in-out hover:z-20 hover:scale-[1.008] hover:shadow-2xl">
            <div className="bg-gray-200 rounded-lg p-4 transition-all duration-500 hover:bg-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden p-4">
                {/* <Sample1 /> */}
              </div>
            </div>
          </div>
        </div>
        <div id="features" className="py-10 md:py-20 px-4">
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {FeaturesTranslations("title")}
            </h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
            {Features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  title={feature.title}
                  className={clsx(
                    "group p-8 rounded-2xl transition-all duration-300 hover:shadow-xl bg-surface hover:bg-surface/90"
                  )}
                >
                  <div className="mb-6">
                    <div
                      className={clsx(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-primary/10"
                      )}
                    >
                      <IconComponent className={clsx("w-6 h-6 text-primary")} />
                    </div>
                    <h3 className={clsx("text-xl font-semibold mb-3")}>
                      {feature.title}
                    </h3>
                  </div>
                  <p
                    className={clsx(
                      "text-base leading-relaxed text-muted group-hover:text-primary/80 transition-colors duration-300"
                    )}
                  >
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        <div id="pricing" className="py-10 md:py-20 px-4 bg-surface/50">
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {PricingTranslations("title")}
            </h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6" />
            <p className="text-xl text-muted">
              {PricingTranslations("description")}
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="p-8 rounded-2xl bg-surface shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {PricingTranslations("free.title")}
                </h3>
                <div className="flex justify-center items-baseline mb-4">
                  <span className="text-5xl font-extrabold text-primary">
                    $0
                  </span>
                  <span className="text-muted ml-1">/forever</span>
                </div>
                <p className="text-muted mb-6">
                  {PricingTranslations("free.description")}
                </p>
                <Button variant="contained" className="w-full py-2">
                  {PricingTranslations("free.cta")}
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div id="about" className="py-10 md:py-20 px-4">
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {AboutTranslations("title")}
            </h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6" />
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* App Purpose Section */}
            <Card className="p-8 md:p-12 rounded-2xl bg-surface/80 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {AboutTranslations("purpose.title")}
                </h3>
                <p className="text-muted leading-relaxed">
                  {AboutTranslations("purpose.description")}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-primary mb-3">
                    {AboutTranslations("purpose.useCase.title")}
                  </h4>
                  <p className="text-muted leading-relaxed">
                    {AboutTranslations("purpose.useCase.description")}
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-primary mb-3">
                    {AboutTranslations("purpose.vision.title")}
                  </h4>
                  <p className="text-muted leading-relaxed">
                    {AboutTranslations("purpose.vision.description")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Creator Section */}
            <Card className="p-8 md:p-12 rounded-2xl bg-surface/80 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl ring-4 ring-primary/20">
                  <Image
                    src="/augustus.jpg"
                    alt="Augustus Otu"
                    className="w-full h-full object-cover"
                    width={192}
                    height={192}
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {AboutTranslations("creator.name")}
                  </h3>
                  <p className="text-lg text-primary/60 mb-4">
                    {AboutTranslations("creator.role")}
                  </p>
                  <p className="text-muted leading-relaxed mb-6">
                    {AboutTranslations("creator.description")}
                  </p>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <Link
                      href="https://github.com/augustusotu"
                      target="_blank"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                    <Link
                      href="https://linkedin.com/in/augustusotu"
                      target="_blank"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </Link>
                    <Link
                      href="https://twitter.com/augustusotu"
                      target="_blank"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="py-8 px-4 bg-surface/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <Logo width={40} height={40} />
                <span className="ml-2 text-lg font-semibold text-primary">
                  {NavTranslations("name")}
                </span>
              </div>
              <div className="flex gap-6 text-sm text-muted">
                <Link href="#features" className="hover:text-primary transition-colors">
                  {NavTranslations("features")}
                </Link>
                <Link href="#pricing" className="hover:text-primary transition-colors">
                  {NavTranslations("pricing")}
                </Link>
                <Link href="#about" className="hover:text-primary transition-colors">
                  {NavTranslations("about")}
                </Link>
                <Link href="#contact" className="hover:text-primary transition-colors">
                  {NavTranslations("contact")}
                </Link>
              </div>
              <div className="text-sm text-muted">
                © {new Date().getFullYear()} {NavTranslations("name")}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
