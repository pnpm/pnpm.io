import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate from "@docusaurus/Translate";
import useBaseUrl, { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { PnpmTheme, useThemeController } from "@pnpm/design.pnpm-theme";
import {
  Homepage as BaseHome,
  XIcon,
  NextJsIcon,
  N8nIcon,
  AstroIcon,
  PrismaIcon,
  NovuIcon,
  VercelIcon,
  DepotIcon,
  CerbosIcon,
} from "@pnpm/website.pages.homepage";
import {
  BoltIcon,
  DiskIcon,
  WorkspaceIcon,
  CatalogIcon,
  ShieldIcon,
  CacheIcon,
  PatchIcon,
  RuntimeIcon,
} from "@pnpm/website.sections.features";
import sponsorData from '../../sponsors.json';
import { useDocusaurusTheme, getThemeMode } from "../utils/use-docusaurus-theme";
// import styles from './styles.module.css';

const hero = {
  title: <Translate>pnpm: Save time. Save disk space. Supercharge your monorepos.</Translate>,
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
  title: <Translate>Everything you expect, and the things you didn’t know to ask for</Translate>,
  subtitle: <Translate>pnpm is a drop-in replacement for npm — and then keeps going, with the features large repos actually need.</Translate>,
  features: [
    {
      title: <Translate>Blazing fast installs</Translate>,
      description: <Translate>Resolution, fetching and linking happen in parallel instead of one stage at a time. On a warm store, an install is mostly just creating links.</Translate>,
      icon: <BoltIcon />,
      href: "/benchmarks",
      linkLabel: <Translate>See the benchmarks</Translate>,
    },
    {
      title: <Translate>Saving disk space</Translate>,
      description: <Translate>Files inside node_modules are hard-linked from a single content-addressable store. A hundred projects on the same version cost you one copy on disk.</Translate>,
      icon: <DiskIcon />,
      href: "/motivation",
    },
    {
      title: <Translate>Workspace support</Translate>,
      description: <Translate>First-class monorepos: the workspace protocol for local packages, filtering to run tasks on just the projects you touched, and a single lockfile for everything.</Translate>,
      icon: <WorkspaceIcon />,
      href: "/workspaces",
    },
    {
      title: <Translate>Catalogs</Translate>,
      description: <Translate>Define a dependency version once in pnpm-workspace.yaml and reference it as "catalog:" everywhere. One line to upgrade, and no more version-drift merge conflicts.</Translate>,
      icon: <CatalogIcon />,
      href: "/catalogs",
    },
    {
      title: <Translate>Strict by default</Translate>,
      description: <Translate>Only your declared dependencies land in the root of node_modules, so your code can never quietly import a package you never installed.</Translate>,
      icon: <ShieldIcon />,
      href: "/symlinked-node-modules-structure",
    },
    {
      title: <Translate>Safer builds</Translate>,
      description: <Translate>Install scripts don’t run for arbitrary dependencies. You approve which packages may execute build scripts — supply-chain safety without extra tooling.</Translate>,
      icon: <CacheIcon />,
      href: "/supply-chain-security",
    },
    {
      title: <Translate>Patch dependencies</Translate>,
      description: <Translate>Fix a bug in a package without waiting for upstream — "pn patch" writes a persistent patch that is reapplied on every install.</Translate>,
      icon: <PatchIcon />,
      href: "/cli/patch",
    },
    {
      title: <Translate>Managing runtimes</Translate>,
      description: <Translate>Install and pin Node.js per project straight from pnpm — no nvm, no shell hooks, no “works on my machine” version mismatches.</Translate>,
      icon: <RuntimeIcon />,
      href: "/cli/runtime",
    },
  ],
};

function addUTM(urlAddress) {
  const url = new URL(urlAddress);
  url.searchParams.append("utm_source", "pnpm");
  url.searchParams.append("utm_medium", "home_page");

  return url.toString();
}

const sponsorIcons = {
  'Depot': <DepotIcon />,
  'Cerbos': <CerbosIcon />,
};

function mapSponsor(s) {
  const icon = sponsorIcons[s.name];
  return {
    name: s.name,
    ...(icon ? { icon } : s.logo ? { logo: `/img/users/${s.logo}` } : {}),
    ...(s.emoji ? { icon: <span style={{fontSize: '4rem'}}>{s.emoji}</span> } : {}),
    alt: s.alt || s.name,
    url: addUTM(s.url),
  };
}

const sponsors = {
  className: "sponsors-section",
  title: <Translate>These are the sponsors</Translate>,
  platinumLabel: <Translate>PLATINUM SPONSORS</Translate>,
  goldLabel: <Translate>GOLD SPONSORS</Translate>,
  silverLabel: <Translate>SILVER SPONSORS</Translate>,
  platinumSponsors: sponsorData.platinum.map(mapSponsor),
  goldSponsors: sponsorData.gold.map(mapSponsor),
  silverSponsors: sponsorData.silver.map(mapSponsor),
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
  title: <Translate>OSS projects that use pnpm</Translate>,
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
    {
      name: "Nx",
      logoUrl: "/img/users/nx.svg",
      alt: "Nx",
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
  const { withBaseUrl } = useBaseUrlUtils();
  const starsCount = useGithubStarsCount();
  const updatedHero = { ...hero, ctaHref, starsCount };
  const updatedFeatures = {
    ...features,
    features: features.features.map((feature) => ({
      ...feature,
      href: withBaseUrl(feature.href),
    })),
  };
  const content = { ...homepageContent, hero: updatedHero, features: updatedFeatures };

  useEffect(() => {
    setThemeMode(themeMode);
  }, [themeMode]);

  return (
    <div className="pnpm-homepage">
      <BaseHome {...content} />
    </div>
  );
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
