# Usage

```
pnpm install
pnpm run benchmark
```

The Node.js version management section compares pnpm with fnm and nvm. nvm is cloned by the benchmark itself, but `fnm` has to be on `PATH`:

```
curl -fsSL https://fnm.vercel.app/install | bash
```

That section times commands inside the shell with `$EPOCHREALTIME`, so it needs Bash 5 or newer on `PATH` and refuses to measure without it. macOS still ships Bash 3.2 as `/bin/bash`:

```
brew install bash
```
