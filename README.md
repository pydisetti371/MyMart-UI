# VMart UI

VMart UI is a React, TypeScript, and Vite micro frontend workspace. The root project is the host shell. Billing, Products, and Reports are separate Vite apps that the host loads with Module Federation.

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm

Vite's current Node.js requirements are documented in the [Vite guide](https://vite.dev/guide/).

## Get started

Clone the repository, open a terminal in the repository root (`MyMart-UI`), then install dependencies:

```sh
npm ci
```

Start the host and all three remotes from the repository root:

```sh
npm run dev
```

This starts the host at <http://localhost:5173>, Billing at <http://localhost:5174>, Products at <http://localhost:5175>, and Reports at <http://localhost:5176>. Open the host at <http://localhost:5173> to use the navigation. Press Ctrl+C to stop all four servers.

To run only the host, use `npm run dev:host`. To develop one remote independently, use its `npm run dev:billing`, `npm run dev:products`, or `npm run dev:reports` command.

| App | Local URL | Host route |
| --- | --- | --- |
| Host shell | <http://localhost:5173> | — |
| Billing | <http://localhost:5174> | `/billing` |
| Products | <http://localhost:5175> | `/products` |
| Reports | <http://localhost:5176> | `/reports` |

The remote apps can also be opened directly at their local URLs while developing them independently.

## Project structure

```text
MyMart-UI/
├── src/                 # Host shell, routes, and remote type declarations
└── apps/
    ├── billing/         # Billing remote; exposes ./App
    ├── products/        # Products remote; exposes ./App
    └── reports/         # Reports remote; exposes ./App
```

The host registers remote entry URLs in the root `vite.config.ts` and lazy-loads each exposed `App` from `src/App.tsx`. Each remote has its own Vite config, development server, and build output. React is configured as a shared singleton between the host and remotes.

## Useful commands

Run the complete workspace, or run individual apps from the repository root:

```sh
npm run dev:billing
npm run dev:products
npm run dev:reports
npm run dev:host
```

Build the host or one remote:

```sh
npm run build
npm run build --workspace=@mymart/billing
npm run build --workspace=@mymart/products
npm run build --workspace=@mymart/reports
```

Lint a remote:

```sh
npm run lint --workspace=@mymart/billing
npm run lint --workspace=@mymart/products
npm run lint --workspace=@mymart/reports
```

## Adding or changing a remote

1. Implement the feature in that app's `src/App.tsx`.
2. Keep its federation name, exposed module, and port aligned with the host's remote configuration.
3. Add or update the route and remote TypeScript declaration in the host.
4. Restart the host and remote dev servers after changing Vite federation config.

The host's current remote URLs use `localhost` for local development. Configure deployment URLs and each remote's asset base for the target environment before deploying.
