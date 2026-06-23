# Vendra — Architecture

This document describes how Vendra is built: what lives on-chain, what lives off-chain, and how the two halves fit together to make an escrow-protected marketplace that works for both crypto-native and email-only users.

## Design principle

Anything involving **money or custody is on-chain and trustless**; everything else (catalog, profiles, search, evidence files) is **off-chain for cost and UX**. The smart contract is the source of truth for funds and dispute outcomes — the off-chain layer can be rebuilt from scratch without putting a single dollar at risk.

```
        Buyer / Seller (EVM wallet  OR  email -> Circle wallet)
                              |
                       Next.js frontend
                  /                          \
   off-chain (Supabase)                on-chain (Arc)
   profiles, stores, products,         VendraEscrow contract
   order index, dispute case           - holds USDC in escrow
   files, evidence, reputation         - escrow state machine
                                       - arbiter-settled disputes
```

## On-chain: the escrow contract

`VendraEscrow` is a purpose-built Solidity contract (`^0.8.24`) using OpenZeppelin v5 (`SafeERC20`, `ReentrancyGuard`, `Ownable`).

- **Address (Arc Testnet):** `0x9BFa767F3454dF7EB5E9515FEa7542d774D3B36f` (verified)
- **One escrow record per order**, retrievable via `getOrder(id)`; `nextId` tracks issuance.
- **State machine:** `None -> Funded -> Shipped -> Released`, with `Refunded` and `Disputed` as terminal/branch states.
- **Core transitions:**
  - `fund(seller, amount, ref)` — buyer locks USDC, returns an order id (requires prior ERC-20 `approve`).
  - `markShipped(id)` — seller marks dispatched.
  - `confirmReceipt(id)` — buyer releases funds to the seller.
  - `autoRelease(id)` — anyone can trigger release after the 7-day confirmation window (safety net for an inactive buyer).
  - `reclaimUnshipped(id)` — buyer reclaims if the seller never ships, after the 5-day ship deadline.
  - `raiseDispute(id)` — either party freezes the funds.
  - `resolve(id, toBuyer)` — **arbiter only**; sends `toBuyer` to the buyer and the remainder to the seller (refund / release / split).
- **Admin:** `setArbiter`, `setWindows` (owner only).
- **Safety:** checks-effects-interactions ordering with `nonReentrant` on every state transition; `SafeERC20` for token movement.

### USDC on Arc

On Arc, USDC is both the **native gas token** and a **standard ERC-20** exposed at a system precompile (6-decimal units). The escrow contract moves value through the ERC-20 interface (so all amounts are 6-decimal), while the same balance pays for gas natively — buyers never need a separate gas token.

## Off-chain: Supabase

Off-chain data is stored in Supabase (Postgres + storage):

- **profiles** — wallet-keyed buyer/seller profiles (display name, bio, avatar, role).
- **stores / products** — multi-vendor catalog.
- **orders** — an index of purchases mirroring on-chain escrow, for fast history and display.
- **escrow_jobs** — bookkeeping linking orders to escrow activity.
- **dispute_messages** — dispute case files: statements + evidence URLs.
- **seller_reputation** — wallet-tied reputation derived from completed sales.
- **Storage bucket** — product images, store banners, avatars, and dispute evidence (images/PDFs).

The contract, not the database, is authoritative for anything touching funds; the `orders` table is a convenience mirror.

## Dual-wallet architecture

Vendra supports two account types behind a single `useVendraWallet` abstraction, so the rest of the app is wallet-agnostic:

- **EVM wallets** — MetaMask / Coinbase / WalletConnect via RainbowKit + wagmi + viem. The user signs every transaction client-side.
- **Email / Circle wallets** — a Circle developer-controlled wallet is provisioned per email. There is no browser popup to sign, so transactions are submitted **server-side** through Next.js API routes that call Circle's API with the project's API key and entity secret.

Both paths drive the **same** escrow contract. For Circle users, server routes handle the contract executions (e.g. `approve` then `fund`, and each lifecycle action), poll for confirmation, and return the resulting transaction hash. The two flows are deliberately kept at **parity** — fund, ship, confirm, dispute, and resolve behave identically; only the signing mechanism differs.

## Key flows

- **Purchase:** buyer checks out -> (EVM: approve + fund signed in-wallet · Circle: same two calls executed server-side) -> USDC locked in escrow -> order mirrored to Supabase with the real tx hash.
- **Fulfilment:** seller `markShipped` -> buyer `confirmReceipt` (or `autoRelease` after the window) -> funds to seller.
- **Dispute:** either party `raiseDispute` (funds freeze) -> both post statements + upload evidence to the case file -> arbiter reviews via the arbiter dashboard -> `resolve` settles on-chain.

## Frontend & deployment

- **Framework:** Next.js (App Router), React, TypeScript.
- **Web3:** wagmi v2, viem, RainbowKit.
- **Circle:** developer-controlled wallets SDK via server routes.
- **Hosting:** Vercel. **Network:** Arc Testnet (chain id 5042002).
- **Contract tooling:** Hardhat (separate project), deployed and verified on Arc.

## Honest current limitations

These are known and on the roadmap, not hidden:

- **Off-chain writes use a public anon key.** Convenient for a testnet demo, but it means catalog/profile writes aren't server-authorized yet. Production needs server-side writes + row-level security.
- **Evidence is stored in a public bucket.** Fine for a demo; production should use private storage with signed, expiring URLs.
- **A single arbiter** (one Vendra-operated wallet) resolves disputes. Centralized by design for launch; decentralized/multi-party arbitration is planned.

None of these affect the on-chain escrow guarantees — funds, custody, and dispute settlement are already trustless.
