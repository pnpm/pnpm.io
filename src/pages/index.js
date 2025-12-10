import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate from "@docusaurus/Translate";
import useBaseUrl from '@docusaurus/useBaseUrl';
import { PnpmTheme, useThemeController } from "@pnpm/design.pnpm-theme";
import {
  Homepage as BaseHome,
  XIcon,
  CerbosIcon,
  NextJsIcon,
  N8nIcon,
  AstroIcon,
  PrismaIcon,
  NovuIcon,
  VercelIcon,
  DepotIcon,
} from "@pnpm/website.pages.homepage";
import { useDocusaurusTheme, getThemeMode } from "./use-docusaurus-theme";
// import styles from './styles.module.css';

const hero = {
  title: <Translate>Save time. Save disk space. Supercharge your monorepos.</Translate>,
  subtitle: <Translate>Get lightning-fast installation speeds and a smarter, safer way to manage dependencies.</Translate>,
  ctaText: <Translate>Getting started</Translate>,
  ctaHref: "/installation",
  // ctaHref: useBaseUrl('installation'),
  videoSrc: "https://www.youtube-nocookie.com/embed/ZIKDJBrk56k",
  starsLabel: 'Star',
  starsCount: 32336,
  githubHref: 'https://github.com/pnpm/pnpm',
  // githubStarsButton: (
  //   <iframe
  //     title="Github stars button"
  //     src="https://ghbtns.com/github-btn.html?user=pnpm&repo=pnpm&type=star&count=true&size=large"
  //     frameBorder="0"
  //     scrolling="0"
  //     width="160px"
  //     height="30px"
  //     style={{ marginTop: "8px" }}
  //   />
  // ),
};

const features = {
  autoSlide: true,
  slideDuration: 10000,
  features: [
    {
      title: <Translate>Fast</Translate>,
      description: <Translate>pnpm is optimized for installation speed. We believe waiting for dependencies to install is a waste of time. Your time is valuable, and so is ours.</Translate>,
      image: "https://static.bit.dev/pnpm-io/Fast.png",
      alt: "Illustration of pnpm Fast feature.",
    },
    {
      title: <Translate>Saving Disk Space</Translate>,
      description: <Translate>Files inside node_modules are linked from a single content-addressable storage.</Translate>,
      image: "https://static.bit.dev/pnpm-io/saving-disk-space.png",
      alt: "Illustration of pnpm Saving Disk Space feature.",
    },
    {
      title: <Translate>Workspace Support</Translate>,
      description: <Translate>Built-in support for monorepos with strict hoisting and workspace protocols.</Translate>,
      image: "https://static.bit.dev/pnpm-io/workspace-support.png",
      alt: "Illustration of pnpm Workspace Support feature.",
    },
    {
      title: <Translate>Managing Runtimes</Translate>,
      description: <Translate>Manage Node.js versions automatically without external tools.</Translate>,
      image: "https://static.bit.dev/pnpm-io/managing-runtimes.png",
      alt: "Illustration of pnpm Managing Runtimes feature.",
    },
  ],
};

function addUTM(urlAddress) {
  const url = new URL(urlAddress);
  url.searchParams.append("utm_source", "pnpm");
  url.searchParams.append("utm_medium", "home_page");

  return url.toString();
}

const sponsors = {
  title: <Translate>These are the sponsors</Translate>,
  platinumLabel: <Translate>PLATINUM SPONSORS</Translate>,
  goldLabel: <Translate>GOLD SPONSORS</Translate>,
  silverLabel: <Translate>SILVER SPONSORS</Translate>,
  platinumSponsors: [
    {
      name: "Bit.cloud",
      logo: "/img/users/bit.svg",
      alt: "bit",
      url: addUTM("https://bit.dev/"),
    },
  ],
  goldSponsors: [
    {
      name: "Discord",
      logo: "/img/users/discord_min.svg",
      alt: "Discord",
      url: addUTM("https://discord.com/"),
    },
    {
      name: "Code Rabbit",
      logo: "/img/users/coderabbit_min.svg",
      alt: "CodeRabbit",
      url: addUTM("https://coderabbit.ai/"),
    },
    {
      name: "StackBlitz",
      logo: "/img/users/stackblitz_min.svg",
      alt: "StackBlitz",
      url: addUTM("https://stackblitz.com/"),
    },
    {
      name: "Vitejs",
      logo: "/img/users/vitejs.svg",
      alt: "Vitejs",
      url: addUTM("https://vite.dev/"),
    },
    {
      name: "Workleap",
      logo: "/img/users/workleap.svg",
      alt: "Workleap",
      url: addUTM("https://workleap.com/"),
    },
  ],
  silverSponsors: [
    {
      name: "Mercedes",
      logo: "/img/users/mercedes.svg",
      alt: "Mercedes-Benz FOSS",
      url: addUTM("https://opensource.mercedes-benz.com/"),
    },
    {
      name: "Devowlio",
      logo: "/img/users/devowlio_min.svg",
      alt: "devowl",
      url: addUTM("https://devowl.io/"),
    },
    {
      name: "Uscreen",
      logo: "/img/users/uscreen.svg",
      alt: "Uscreen",
      url: addUTM("https://uscreen.de/"),
    },
    {
      name: "Leniolabs",
      logo: "/img/users/leniolabs.jpg",
      alt: "Leniolabs",
      url: addUTM("https://www.leniolabs.com"),
    },
    {
      name: "Depot",
      icon: <DepotIcon />,
      url: addUTM("https://depot.dev/"),
    },
    {
      name: "Cerbos",
      icon: <CerbosIcon />,
      url: addUTM("https://cerbos.dev/"),
    },
  ],
};

const testimonials = {
  items: [
    {
      quote: `Every time I use pnpm, I'm reminded how clean and fast it is. Feels like the package manager we should have had all along`,
      authorName: "Simon Fairhurst",
      authorHandle: "@siimonfairhurst",
      avatarSrc: `https://res.cloudinary.com/ddnr1ptva/image/upload/f_auto,q_auto/ai-images/get/gbf68eef579c5670116848f196a64b7a02723e84d533c7942c22e54520b1a24e401bdb89b5974e6b59fa53d59db7d213a981010f95184b3c85a5a3b47d43a7308_1280.jpg`,
      platformIcon: <XIcon />,
    },
    {
      quote: `pnpm is a game-changer. Speed, disk space, monorepo support—it just works.`,
      authorName: "Sarah Drasner",
      authorHandle: "@sarah_edo",
      avatarSrc: `https://res.cloudinary.com/ddnr1ptva/image/upload/f_auto,q_auto/ai-images/get/g339e17fc16bad8a6e684ccdee9d6aa1e4441073d02637d2844dd8ed347437082ea7099a9db7008dab80c62729cf6a7c892921d166bd2746e005f82849bdf784e_1280.jpg`,
      platformIcon: <XIcon />,
    },
    {
      quote: `I migrated a large monorepo to pnpm and the CI time went down by 50%. Incredible engineering.`,
      authorName: "Ben Hong",
      authorHandle: "@bencodezen",
      avatarSrc: `https://res.cloudinary.com/ddnr1ptva/image/upload/f_auto,q_auto/ai-images/get/g710e8163595de47e73a1052fe3f87950a07b3f93b900b70f90aaf792b2526872fada24cd397d160989c837ab14ed1a2e58d35fa58ba90e11b8c4cf4bdfde4af6_1280.jpg`,
      platformIcon: <XIcon />,
    },
  ],
};

const ossProjects = {
  title: <Translate>OSS projects that use Pnpm</Translate>,
  projects: [
    {
      name: "next.js",
      icon: <NextJsIcon />,
    },
    {
      name: "n8n",
      icon: <N8nIcon />,
    },
    {
      name: "Material UI",
      logoUrl: "/img/users/mui.svg",
      alt: "Material UI",
    },
    {
      name: "Vite",
      logoUrl: "/img/users/vitejs.svg",
      alt: "Vite",
    },
    {
      name: "Nuxt",
      logoUrl: "/img/users/nuxt_min.svg",
      alt: "Nuxt",
    },
    {
      name: "Vue",
      logoUrl: "/img/users/vue.svg",
      alt: "Vue",
    },
    {
      name: "Astro",
      icon: <AstroIcon />,
    },
    {
      name: "Prisma",
      icon: <PrismaIcon />,
    },
    {
      name: "Novu",
      icon: <NovuIcon />,
    },
    {
      name: "Slidev",
      logoUrl: "/img/users/slidev_min.svg",
      alt: "Slidev",
    },
    {
      name: "Turborepo",
      logoUrl: "/img/users/turborepo_min.svg",
      alt: "Turborepo",
    },
    {
      name: "Quasar Framework",
      logoUrl: "/img/users/quasar_min.svg",
      alt: "Quasar Framework",
    },
    {
      name: "Element Plus",
      logoUrl: "/img/users/element-plus_min.svg",
      alt: "Element Plus",
    },
    {
      name: "NextAuth.js",
      logoUrl: "/img/users/next-auth_min.svg",
      alt: "NextAuth.js",
    },
    {
      name: "Ember.js",
      logoUrl: "/img/users/emberjs.svg",
      alt: "Ember.js",
    },
    {
      name: "Qwik",
      logoUrl: "/img/users/qwik_min.svg",
      alt: "Qwik",
    },
    {
      name: "VueUse",
      logoUrl: "/img/users/vue-use_min.svg",
      alt: "VueUse",
    },
    {
      name: "SvelteKit",
      logoUrl: "/img/users/sveltekit_min.svg",
      alt: "SvelteKit",
    },
    {
      name: "Verdaccio",
      logoUrl: "/img/users/verdaccio_min.svg",
      alt: "Verdaccio",
    },
    {
      name: "Vercel",
      icon: <VercelIcon />,
    },
  ],
};

const homepageContent = {
  hero,
  features,
  sponsors,
  testimonials,
  ossProjects,
};

function useGithubStarsCount() {
  const [count, setCount] = useState("33.4K");

  useEffect(() => {
    const url = "https://api.github.com/repos/pnpm/pnpm";
    fetch(url).then(async (res) => {
      const data = await res.json();
      const starsCount = data.stargazers_count;
      setCount(starsCount);
    });
  }, []);

  return count;
}

function Homepage() {
  const themeMode = useDocusaurusTheme();
  const { setThemeMode } = useThemeController();
  const ctaHref = useBaseUrl("installation");
  const starsCount = useGithubStarsCount();
  const updatedHero = { ...hero, ctaHref, starsCount };
  const content = { ...homepageContent, hero: updatedHero };

  useEffect(() => {
    setThemeMode(themeMode);
  }, [themeMode]);

  return <BaseHome {...content} />;
}

function Home() {
  const themeMode = getThemeMode();
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title={siteConfig.tagline} description={siteConfig.tagline}>
      <PnpmTheme initialTheme={themeMode}>
        <Homepage />
      </PnpmTheme>
    </Layout>
  );
}

export default Home;
