# Vendra — Roadmap

Vendra is an early-stage project, fully functional on Arc **Testnet** and built solo. This roadmap is honest about what exists today versus what's planned — there is no production traction yet, and nothing below is presented as more finished than it is.

## Shipped (live on Arc Testnet)

- **On-chain USDC escrow** — verified `VendraEscrow` contract holding real testnet USDC.
- **Full escrow lifecycle** — fund, mark shipped, confirm receipt, release; plus 7-day auto-release and buyer reclaim if unshipped.
- **Dispute resolution** — either party can raise a dispute; both sides post statements and upload evidence; a neutral arbiter settles on-chain (refund / release / split), with an arbiter dashboard listing open cases.
- **Dual onboarding at parity** — EVM wallets (RainbowKit/wagmi) and email-based Circle wallets, both funding and operating the same escrow.
- **Marketplace** — multi-vendor storefronts, USDC pricing, search, category filters, pagination, and store-quality gating (complete stores with images only).
- **Profiles & accounts** — wallet-based buyer/seller profiles and full account deletion (off-chain data + uploads; on-chain escrow untouched).

## Next (near-term)

- **Production hardening** — move catalog/profile writes server-side, add row-level security, and serve dispute evidence from private storage via signed, expiring URLs.
- **Seller tooling** — better product management, order notifications, and storefront customization.
- **Smaller polish** — conditional arbiter navigation, product-image snapshots on orders, and backfilling transaction hashes for early orders.

## Later

- **Decentralized arbitration** — move beyond a single arbiter toward multi-party or staked arbitration, reducing the central point of trust.
- **AI-assisted dispute triage** — summarize case files and suggest (not decide) resolutions to speed up arbitration.
- **Portable reputation** — strengthen wallet-tied seller reputation, with a path toward verifiable on-chain history.

## Mainnet

- **Arc mainnet deployment** of the escrow contract with a security review.
- **Real merchant onboarding** beyond test and seed stores.
- **Fiat on-ramps** via Circle so non-crypto users can fund purchases directly.

## Business model (unchanged across the roadmap)

Commission stays at **0%** on every trade. Revenue comes from optional seller services — a small store-deployment fee, subscriptions, and promoted listings — never a cut of the peer-to-peer transaction.
