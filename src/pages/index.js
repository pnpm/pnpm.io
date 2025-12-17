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
      image: "/img/features/fast-pumpkin.webp",
      alt: "Illustration of pnpm Fast feature.",
    },
    {
      title: <Translate>Saving Disk Space</Translate>,
      description: <Translate>Files inside node_modules are linked from a single content-addressable storage.</Translate>,
      image: "/img/features/saving-disk-space-pumpkin.webp",
      alt: "Illustration of pnpm Saving Disk Space feature.",
    },
    {
      title: <Translate>Workspace Support</Translate>,
      description: <Translate>Built-in support for monorepos with strict hoisting and workspace protocols.</Translate>,
      image: "/img/features/workspace-support-pumpkin.webp",
      alt: "Illustration of pnpm Workspace Support feature.",
    },
    {
      title: <Translate>Managing Runtimes</Translate>,
      description: <Translate>Manage Node.js versions automatically without external tools.</Translate>,
      image: "/img/features/managing-runtimes-pumpkin.webp",
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
      // https://x.com/feross/status/1968054167525790076,
      quote: `@pnpmjs is a strong option for protecting against supply chain attacks, and the DX is excellent too they removed postinstall scripts a while back, cutting one big attack path now they’ve introduced minimumReleaseAge which lets you hold off on new versions for a day or more`,
      authorName: "Feross",
      authorHandle: "@feross",
      avatarSrc: `https://pbs.twimg.com/profile_images/1499215593089556483/VtxQLy6L_400x400.jpg`,
      platformIcon: <XIcon />,
    },
    {
      // https://x.com/sayantan__ghosh/status/1956389104771371163,
      quote: `Its not even been a day but I suddenly feel that @pnpmjs has improved my overall dev experience 🤯`,
      authorName: "Sayantan Ghosh",
      authorHandle: "@sayantan__ghosh",
      avatarSrc: `https://pbs.twimg.com/profile_images/1952025282560569345/aNNNtaXm_400x400.jpg`,
      platformIcon: <XIcon />,
    },
    {
      // https://x.com/bentlegen/status/1887146304976941207,
      quote: `This whole time I've stuck with npm out of habit and because it "just works". But then I had to override a subdependency via package.json, and npm just wouldn't do it. I spent hours fiddling. So @darcy recommends I use @pnpmjs , and w/ the same package.json, it "just works".`,
      authorName: "Ben Vinegar",
      authorHandle: "@bentlegen",
      avatarSrc: `https://pbs.twimg.com/profile_images/1765244446650568704/zgjmJiTX_400x400.jpg`,
      platformIcon: <XIcon />,
    },
    {
      // https://x.com/rauchg/status/1844434318162329761,
      quote: `Gotta say @pnpmjs has never let me down. Great piece of software.`,
      authorName: "Guillermo Rauch",
      authorHandle: "@rauchg",
      avatarSrc: `https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg`,
      platformIcon: <XIcon />,
    },
    {
      // https://x.com/itaymendel/status/1699782782908870817,
      quote: `By adopting the latest changes from @pnpmjs we got huge performance benefits in @bitdev_ ! still early to call true numbers, but i'm seeing decreases of 40% in some flows! incredible work by @ZoltanKochan and the team behind pnpm!`,
      authorName: "Itay Mendelawy",
      authorHandle: "@itaymendel",
      avatarSrc: `https://pbs.twimg.com/profile_images/657699734673485824/0UIcBpjO_400x400.jpg`,
      platformIcon: <XIcon />,
    },
    {
      // https://x.com/housecor/status/1692563098039697849,
      quote: `I ❤️ pnpm. Just radically sped up a CI build by switching to pnpm and parallelizing tasks (which pnpm supports built-in) Before: 12 minutes After: 2 minutes 😀`,
      authorName: "Cory House",
      authorHandle: "@housecor",
      avatarSrc: `https://pbs.twimg.com/profile_images/1963593369306750976/7gPWqEa8_400x400.jpg`,
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
