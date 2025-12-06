---
title: How We're Protecting Our Newsroom from npm Supply Chain Attacks
authors: ryansobol
---

We got lucky with Shai-Hulud 2.0.

In November 2025, a self-replicating npm worm [compromised 796 packages](https://securitylabs.datadoghq.com/articles/shai-hulud-2.0-npm-worm/) with 132 million monthly downloads. The attack used preinstall scripts to steal credentials, install persistent backdoors, and in some cases wipe entire developer environments. We weren't affected—not because we had robust defenses, but because we didn't run `npm install` or `npm update` during the attack window.

Luck isn't a security strategy.

<!--truncate-->

## Who We Are

I'm Ryan Sobol, Principal Software Engineer at the Seattle Times. We've been using npm as our default package manager for years, with some brief experimentation with Yarn that never gained traction. Now we're piloting pnpm specifically for its client-side security controls that complement the registry-level improvements npm has been rolling out.

Trust is paramount for news organizations, especially these days. A supply chain compromise could expose customer data, employee credentials, production infrastructure, and source code—all things that could take weeks to recover from and potentially require breach notifications to our readers. We understand how expensive these incidents can be in both time and money. That's a path we don't want to go down.

Despite the organizational inertia that comes with sticking to npm, we think pnpm has a real chance here. It's a true drop-in replacement—same commands, same workflows, same registry. That makes the transition achievable in a way previous alternatives weren't.

This isn't a polished case study. It's a real-world data point from a team that's just starting to figure out supply chain security. The challenges we're encountering and how we're thinking about these controls might be useful as you consider implementing them yourself.

## Why Client-Side Controls Matter

npm has made tremendous progress on supply chain security. [Trusted publishing](https://docs.npmjs.com/trusted-publishers/), [provenance attestations](https://docs.npmjs.com/generating-provenance-statements/), and [granular access tokens](https://docs.npmjs.com/about-access-tokens/) are all significant improvements that make it substantially harder to publish malicious packages after compromising maintainer accounts.

But here's the gap: these registry improvements protect the ***publishing*** side. They don't prevent ***consuming*** malicious packages.

When you run `npm install` or `npm update`, lifecycle scripts (e.g., preinstall and postinstall) execute arbitrary code from the internet with full developer privileges—before the package has been evaluated for safety. These scripts can access your credentials (npm, GitHub, AWS, databases), your source code, your cloud infrastructure, and your entire filesystem. 

This is the fundamental vulnerability that attacks like Shai-Hulud exploit. Even with these registry improvements, if a legitimate maintainer's account is compromised, attackers can publish a version with malicious lifecycle scripts that execute immediately upon installation—before the community detects the compromise.

That's why we felt we needed defense on both sides: npm's improvements make it harder to ***publish*** malicious packages; pnpm's client-side controls make it harder to ***consume*** them. These approaches are complementary, not competitive. pnpm uses npm's registry and benefits from all of npm's security improvements while adding an additional layer of protection on the client side.

This is defense-in-depth.

## The Three Layers We're Using

For our pilot, we're using three pnpm security controls that work together. Each control addresses a different attack vector, and each has escape hatches for legitimate exceptions. We knew going in that we'd need those exceptions—the real world is messy.

### Control 1: Lifecycle Script Management

One of the main reasons we considered pnpm was learning that it **blocks lifecycle scripts by default**. Unlike other package managers, it doesn't implicitly trust and execute arbitrary code from packages. 

In practice, when a package has preinstall or postinstall scripts, pnpm blocks them but installation continues with a warning. This already provides significant protection—malicious scripts won't execute without you explicitly allowing them. However, we were concerned that warnings would be too easy to ignore, especially since installation appears to succeed. We wanted stricter control with `strictDepBuilds: true`:

```yaml title="pnpm-workspace.yaml"
strictDepBuilds: true

onlyBuiltDependencies:
  - package-with-necessary-build-scripts

ignoredBuiltDependencies:
  - package-with-unnecessary-build-scripts
```

By "necessary," we mean packages that genuinely need their lifecycle scripts to function—things like native extensions that compile from source or database drivers that link against platform-specific libraries. By "unnecessary," we mean scripts that are optional optimizations or setup steps that don't affect whether the package functions in our use case.

With `strictDepBuilds: true`, installation fails immediately when it encounters lifecycle scripts, forcing us to:
1. Identify which packages have lifecycle scripts—pnpm tells you exactly which ones
2. Research what each script does, which can be as easy as feeding the self-contained preinstall or postinstall script into a generative AI for interpretation
3. Use human judgment to make a conscious, documented decision about whether to allow or block it

For our team, this ensures we're making deliberate choices upfront rather than potentially discovering issues later.

**Note:** The pnpm team is considering making `strictDepBuilds: true` the default behavior in v11, and is also exploring clearer naming for the allow/deny syntax based on feedback from teams implementing these controls in practice.

### Control 2: Release Cooldown

This control blocks installation of package versions published within a cooldown period. The idea is to give the community time to detect and remove malicious packages before they reach your environment.

```yaml title="pnpm-workspace.yaml"
minimumReleaseAge: <duration-in-minutes>

minimumReleaseAgeExclude:
  - package-with-critical-hotfix@1.2.3
```

**Our mindset shift:** We had to retrain ourselves to stop thinking "newest is best." What we're learning is that from a supply chain security perspective, that's not always the case—slightly older can often be safer. A package that's been available for a period of time gives the community and security researchers time to detect potential issues.

Looking at recent attacks, malicious packages have been detected and removed in varying timeframes. The [September 2025 npm supply chain attack](https://www.wiz.io/blog/widespread-npm-supply-chain-attack-breaking-down-impact-scope-across-debug-chalk) that compromised debug, chalk, and 16 other packages saw removal within about 2.5 hours, while [Shai-Hulud 2.0](https://securitylabs.datadoghq.com/articles/shai-hulud-2.0-npm-worm/) (November 2025) took about 12 hours. Every attack is different and every recovery timeline will vary, but the appropriate cooldown period depends on your organization's risk tolerance—it could be measured in hours, days, or weeks. Either way, a cooldown period would have blocked these attacks.

**The trade-off we accepted:** Given the scale of our organization and our priorities, we're not always on the absolute latest versions of packages—despite best efforts. So this cooldown policy aligns more with our reality than it disrupts it. When we genuinely need a newer version (critical security patches, breaking bugs), we can temporarily exempt it after review.

### Control 3: Trust Policy

This control blocks installation when a package version has weaker authentication than previously published versions—often a sign that an attacker compromised maintainer credentials and published from their own machine instead of the official CI/CD pipeline.

```yaml title="pnpm-workspace.yaml"
trustPolicy: no-downgrade

trustPolicyExclude:
  - package-that-migrated-cicd@1.2.3
```

**How it works:** npm tracks three trust levels for published packages (strongest to weakest):
1. **Trusted Publisher:** Published via GitHub Actions with OIDC tokens and npm provenance
2. **Provenance:** Signed attestation from a CI/CD system
3. **No Trust Evidence:** Published with username/password or token authentication

If a newer version has weaker authentication than an older version, installation fails. For example, if v1.0.0 was published with Trusted Publisher but v1.0.1 was published with basic auth, pnpm blocks v1.0.1.

In the [s1ngularity attack](https://www.wiz.io/blog/s1ngularity-supply-chain-attack) in August 2025, attackers compromised maintainer credentials and published malicious versions from their own machines. Because they didn't have CI/CD access, the malicious versions had no provenance—a clear trust downgrade. This control would have blocked installation.

**When trust downgrades might be legitimate:** New maintainer who hasn't set up provenance yet, CI/CD system migration, emergency hotfix published manually while CI/CD was down. In these cases, we'd investigate why the trust level decreased, verify it's safe, then add to `trustPolicyExclude`.

**Note:** This feature was added to pnpm in November 2025 and is quite new. We're still learning how often legitimate trust downgrades occur in practice.

## How They Work Together: The React Example

We don't see any of these controls as a silver bullet. They work as layers of defense—when we need to make an exception for one control, the other layers continue protecting us.

Let's look at a real scenario: the [critical React vulnerability](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components) disclosed in December 2025.

This was a serious security issue that required immediate patching. Normally, our release cooldown would prevent us from installing a package version published so recently. But this was a critical security patch—we couldn't wait.

Here's how the layered defense would work in this scenario:

**What you'd do:** Add the specific React version to `minimumReleaseAgeExclude` after reviewing the vulnerability disclosure and verifying the patch was legitimate.

**What still protects you:**
- **Lifecycle Script Management** is still active—if an attacker had injected malicious lifecycle scripts into the React patch, they would be blocked (React normally has no lifecycle scripts, so any scripts would be immediately suspicious)
- **Trust Policy** is still active—if an attacker had compromised React's publishing credentials and pushed a malicious "patch" from their own machine, the trust downgrade would be blocked

This is why we think exceptions are expected and okay. You make a conscious, documented decision to bypass one control for a legitimate reason, but you still have robust protection from the other layers. No single point of failure.

This is what defense-in-depth looks like in practice for us.

## Our Pilot Experience

We implemented all three security controls in one of our backend services as a proof of concept. Total setup time: a few hours to research, understand, and define our approach.

During setup, pnpm identified three packages with lifecycle scripts:

- **esbuild:** Optimizes CLI tool startup by milliseconds—not needed since we only use the JavaScript API
- **@firebase/util:** Auto-configures client SDK—not needed since we only use the server SDK  
- **protobufjs:** Checks version schema compatibility—not needed since it's a transitive dependency

We researched what each script did (reading documentation and feeding the scripts to AI for interpretation), determined none were necessary for our use case, and blocked them. Zero impact on functionality.

That was it. A few hours of initial investment for ongoing protection against Shai-Hulud-style attacks.

**What the friction feels like:** These controls create friction by design—and for us, that's a feature, not a bug. The friction forces conscious decisions about what code runs in our environment rather than implicitly trusting everything. When new dependencies have scripts, we anticipate it will take around 15 minutes to review and document the decision.

We expect that the friction will become more intuitive with practice as we get more familiar with the process.

## What We're Learning

A few things we've learned from our pilot:

**The defense-in-depth model actually works.** Having multiple layers on the client side—plus the benefits from npm's publishing-side improvements—means we can be pragmatic about exceptions. When we need to bypass one control for a legitimate reason, the others are still protecting us. This removes the anxiety of making exceptions—they're not security failures, they're the system working as designed.

**The mental model takes time.** There's a learning curve to thinking "security-first" rather than "convenience-first." But once the mental model clicks—that slightly older packages are safer, that explicit decisions are better than implicit trust—the workflow feels natural.

**These controls are practical for mid-sized teams.** We're not a large tech company with a dedicated security team. We're a mid-sized news media organization with limited engineering resources. If we can implement these controls successfully, they're accessible to most teams.

**We're still learning.** The threat landscape evolves, and our approach will too. The trust policy feature is only a few weeks old, and we don't yet know how often legitimate trust downgrades will occur in practice. We're planning to expand these controls to other codebases in the near future, which will give us more data on how they scale with applications with different dependency graphs.

## For Other Teams Considering This

If you're considering pnpm's security controls, here's what worked for us:

**Start with one project.** Piloting on a single codebase first let us get comfortable with the workflow, understand the friction points, and build confidence before considering a broader rollout.

**Plan for exceptions upfront.** Go in expecting you'll need exceptions for lifecycle scripts (packages that need compilation), release cooldowns (critical security patches), and trust downgrades (CI/CD migrations). This isn't failure—it's how the system is designed to work.

**Use `strictDepBuilds: true` from day one.** Relying on warnings felt too risky for us. We wanted installation to fail immediately and force the decision. This prevents packages from potentially misbehaving later and ensures deliberate choices.

**Document every exception.** Write down why you allowed a lifecycle script or exempted a package. This creates an audit trail, helps future team members understand the reasoning, and makes it easy to clean up exceptions later.

**Trust the layers.** When you make an exception for one control, remember the other two are still protecting you. The defense-in-depth model gives you room to be pragmatic.

## Share Your Experience

We'd love to hear from other teams implementing these controls or considering them. What's working? What's challenging? What have you learned? Join the conversation in the [pnpm GitHub Discussions](https://github.com/orgs/pnpm/discussions) or share your experiences on social media—we're all learning together.

## Thank You

Thanks to the pnpm team for building these controls and for the thoughtful way they've approached making them both powerful and practical. And thanks for inviting us to share our story.

The work you're doing matters. These controls provide real protection that complements npm's registry improvements. Together, they give teams like ours a fighting chance against increasingly sophisticated supply chain attacks.

---

*Ryan Sobol is a Principal Software Engineer at the Seattle Times, where he works on mobile and web development, cloud infrastructure, and developer tooling. The views expressed here are his own and based on the Seattle Times' pilot implementation of pnpm's security controls.*
