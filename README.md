# Vendra

**Vendra is a Web3 native peer to peer marketplace where every order is protected by real on-chain USDC escrow, and anyone can use it with a crypto wallet or just an email.**

- **Live app:** https://vendramarket.xyz (Arc Testnet)
- **Repository:** https://github.com/nftkinging/vendra
- **Escrow contract (Arc Testnet):** `0x9BFa767F3454dF7EB5E9515FEa7542d774D3B36f`
- **Explorer:** https://testnet.arcscan.app/address/0x9BFa767F3454dF7EB5E9515FEa7542d774D3B36f
- **Network:** Arc Testnet (chain id 5042002) · USDC-native

---

## The problem

Peer-to-peer commerce online runs on trust that the other side won't cheat — and platforms charge 5–15% commission to act as the middleman that enforces it. In crypto, the trust problem is worse: payments are irreversible, so a buyer who pays first has no recourse, and a seller who ships first has no guarantee. Most "web3 marketplaces" solve neither — they either custody funds centrally (recreating the platform you were trying to avoid) or send funds directly wallet-to-wallet (no protection at all).

## What Vendra does

Vendra is a marketplace where the **escrow is the product**. When a buyer pays, their USDC is locked in a smart contract on Arc — not held by Vendra, not sent to the seller. The seller marks the item shipped; the buyer confirms receipt to release the funds; and if something goes wrong, either party can escalate to a dispute that a neutral arbiter resolves. Commission is **0%** — Vendra never takes a cut of the trade.

Crucially, this works for **two kinds of users at once**:

- **Crypto users** connect any EVM wallet (MetaMask, Coinbase, WalletConnect) and sign transactions themselves.
- **Everyone else** logs in with just an **email**, which provisions a **Circle developer-controlled wallet** behind the scenes — no seed phrase, no extension, no prior crypto experience. Their purchases fund the exact same on-chain escrow; the only difference is that signing happens server-side via Circle.

Both paths are fully at parity: fund, ship, confirm, dispute, and resolve all behave identically regardless of how you logged in.

## What's built and working today

Everything below is live on Arc Testnet and has been exercised end-to-end.

- **On-chain USDC escrow** — a purpose-built Solidity contract (`VendraEscrow`), deployed and verified, holding real testnet USDC. Sample verified transactions:
  - approve: `0x7dd68d79104c4e4e99ed5a77e5930c5db12bf60c862af3cd95d35abd1c8820f1`
  - fund: `0x00c516cc16846fe72586c3eaf8230499de4cbe69cd1a2bf0b7b8d2f78bc52d83`
- **Full escrow lifecycle** — `fund -> markShipped -> confirmReceipt -> release`, plus a 7-day auto-release safety net if the buyer goes silent, and a buyer reclaim path if the seller never ships.
- **Dispute resolution** — either party can raise a dispute, which freezes the funds. A dedicated case-file page lets buyer and seller post statements and **upload evidence** (images/PDFs). Only the designated arbiter wallet sees the resolution controls and can settle: full refund, full release, or a custom split. There's an arbiter dashboard listing every open dispute.
- **Dual onboarding** — EVM wallets via RainbowKit/wagmi, and email-based Circle wallets via Circle's developer-controlled wallets API, with a balance pre-check and an explicit in-app payment confirmation for the custodial path.
- **Marketplace** — multi-vendor storefronts, USDC pricing, search, category filters, pagination, and store-quality gating (a store can't be published without a banner and complete details; only listings with images surface).
- **Identity & profiles** — wallet-based buyer and seller profiles, with an account-deletion flow that wipes a user's off-chain data and uploads (on-chain escrow is never affected).

## Why Vendra Was Built On Arc

Vendra is built specifically for Arc because the chain's design removes the usual friction of on-chain commerce:

- **USDC is the native gas token *and* a standard ERC-20** on Arc. Buyers pay for goods and pay for gas in the same dollar-denominated asset — no separate volatile gas token to acquire. The escrow contract integrates USDC through Arc's ERC-20 interface at the system precompile (6-decimal units), while the same balance is usable as native gas.
- **Sub-second finality** makes the escrow flow feel like a normal checkout rather than a blockchain transaction.
- **Circle wallets** are what make Vendra usable by non-crypto buyers and sellers — the single biggest barrier to real-world adoption — without giving up self-custody-grade escrow on the funds themselves.

## Architecture at a glance

- **Smart contract:** `VendraEscrow` (Solidity ^0.8.24, OpenZeppelin v5 — `SafeERC20`, `ReentrancyGuard`, `Ownable`). One escrow record per order, an explicit state machine, checks-effects-interactions with `nonReentrant` on every state transition. Configurable confirmation window (7d) and ship deadline (5d); a single arbiter address authorized to resolve disputes.
- **Frontend:** Next.js 16, wagmi v2 + viem + RainbowKit for EVM, Circle developer-controlled wallets SDK for email users, Supabase for off-chain data (profiles, store/product catalog, order index, dispute case files) and file storage. Deployed on Vercel.
- **On-chain vs off-chain split:** money, custody, and dispute outcomes are on-chain and trustless; catalog, profiles, and evidence are off-chain for cost and UX, with the contract as the source of truth for anything involving funds.

## Vendra - The Overview

1. **Email onboarding** — log in with an email, no wallet. A Circle USDC wallet is provisioned; fund it from the faucet.
2. **Buy with escrow** — purchase an item. Show the in-app payment confirmation, then the on-chain `approve` + `fund` — open the resulting transaction on the Arc explorer to show the USDC now sitting in the escrow contract, not the seller's wallet.
3. **Seller side** — switch to the seller wallet, mark the order shipped.
4. **Happy path** — as the buyer, confirm receipt; show the funds release to the seller on-chain.
5. **Dispute path** — on another order, raise a dispute, upload a piece of evidence, then connect the **arbiter** wallet, open the arbiter dashboard, review the case file, and resolve with a refund — shown settling on-chain.

## Current state

Vendra is an early-stage project built solo. It is fully functional on Arc **Testnet**; there is **no production traction yet** — the marketplace currently contains test and seed stores, not real merchants. The arbiter is a single Vendra-controlled wallet (appropriate for launch, centralized by design and openly stated). Off-chain writes currently use a public anon key, which is fine for a testnet demo; production hardening (server-side writes, stricter access control, signed evidence URLs) is on the roadmap. The point of this submission is a working, verifiable system — not inflated metrics.

## Monetization

Commission stays at **0%** on trades — that's the core promise. Revenue comes from optional seller services instead: a small store-deployment fee, subscriptions, and promoted listings, with escrow float as a later, scale-dependent option. Never a cut of the peer-to-peer transaction.

## Roadmap

- **Now (testnet):** on-chain escrow, dual-wallet onboarding, dispute resolution, multi-vendor marketplace.
- **Next:** production hardening (server-side writes + access control), richer seller tooling, decentralized/multi-party dispute arbitration, AI-assisted dispute triage.
- **Mainnet:** Arc mainnet deployment, real merchant onboarding, fiat on-ramps via Circle.

## Tech stack

Next.js 16 · wagmi v2 · viem · RainbowKit · Circle developer-controlled wallets · Supabase · Solidity ^0.8.24 · OpenZeppelin v5 · Hardhat · Vercel · Arc Testnet (USDC-native).
