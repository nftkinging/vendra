# Vendra Documentation

Vendra is a Web3-native peer-to-peer marketplace on Arc. Every order is protected by real on-chain USDC escrow, commission is 0%, and you can use it with a crypto wallet or with just an email.

- **Live app:** https://vendramarket.xyz
- **Escrow contract (Arc Testnet):** `0x9BFa767F3454dF7EB5E9515FEa7542d774D3B36f` — [view on explorer](https://testnet.arcscan.app/address/0x9BFa767F3454dF7EB5E9515FEa7542d774D3B36f)
- **Network:** Arc Testnet (chain id 5042002), USDC-native

---

## Overview

On most marketplaces you trust a company to hold your money and resolve disputes, and you pay 5–15% commission for the privilege. On Vendra, an Arc smart contract holds the money instead. When a buyer pays, their USDC is locked in escrow — not sent to the seller, not held by Vendra. It's released only when the buyer confirms delivery, auto-releases after a safety window, or is settled by a neutral arbiter if there's a dispute. Vendra never takes a cut of the trade.

## How escrow works

Every order moves through a clear on-chain lifecycle:

1. **Funded** — the buyer's USDC is locked in the escrow contract.
2. **Shipped** — the seller marks the item shipped.
3. **Released** — the buyer confirms receipt and the funds go to the seller. If the buyer takes no action, the funds auto-release to the seller after a 7-day confirmation window (a safety net, not a hold on confirmed orders).
4. **Refunded** — if a dispute is resolved in the buyer's favor.

Two protections sit alongside the happy path:

- **Reclaim** — if the seller never ships, the buyer can reclaim the funds after the ship deadline (5 days).
- **Dispute** — either party can raise a dispute, which freezes the funds until a neutral arbiter resolves it.

## Buying

1. Log in — connect any EVM wallet, or sign in with your email to get a Circle USDC wallet.
2. Fund your wallet with testnet USDC from the faucet.
3. Find an item and check out. Your USDC is locked in escrow on Arc.
4. When your item arrives, open your order and confirm receipt to release payment to the seller.
5. If something's wrong, raise a dispute instead of confirming.

## Selling

1. Create a seller profile and launch a store (a complete store with a banner and details is required to publish).
2. Add products with images and USDC prices.
3. When an order comes in, mark it shipped.
4. You're paid automatically when the buyer confirms receipt, or after the auto-release window.

## Disputes and arbitration

If a buyer and seller can't agree, either party raises a dispute. This freezes the order's funds on-chain. Both sides can then post their account of what happened and upload evidence (photos, receipts, tracking, etc.) to a shared case file.

A neutral arbiter reviews the case file and settles it on-chain — a full refund to the buyer, full release to the seller, or a custom split. Only the designated arbiter address can move frozen funds; the contract enforces this. At launch the arbiter is a single Vendra-operated wallet; decentralized and AI-assisted arbitration are on the roadmap.

## Wallets

Vendra supports two ways to participate, at full parity:

- **EVM wallets** (MetaMask, Coinbase, WalletConnect) — you sign transactions yourself.
- **Email / Circle wallets** — sign in with an email and a Circle developer-controlled USDC wallet is provisioned for you, no seed phrase or extension needed. Signing happens securely server-side via Circle.

Both fund and operate the exact same on-chain escrow, and every step — fund, ship, confirm, dispute, resolve — behaves identically regardless of how you logged in.

## The smart contract

`VendraEscrow` is a purpose-built Solidity contract (^0.8.24) using OpenZeppelin v5 (`SafeERC20`, `ReentrancyGuard`, `Ownable`). It holds one escrow record per order with an explicit state machine (None, Funded, Shipped, Released, Refunded, Disputed) and follows checks-effects-interactions with reentrancy protection on every state transition.

- Configurable confirmation window (7 days) and ship deadline (5 days).
- A single arbiter address authorized to resolve disputes; ownership controls for configuration.
- Integrates USDC through Arc's ERC-20 interface (6-decimal units) at the system token precompile, while the same balance pays for gas natively.

## Architecture

- **On-chain (trustless):** custody of funds, the escrow state machine, and dispute outcomes live in the contract — the source of truth for anything involving money.
- **Off-chain (for UX and cost):** the store and product catalog, profiles, an order index, and dispute case files / evidence are stored off-chain.
- **Stack:** Next.js, wagmi + viem + RainbowKit (EVM), Circle developer-controlled wallets (email users), Supabase (data + file storage), deployed on Vercel. Contract built and deployed with Hardhat.

## Status

Vendra is an early-stage project, fully functional on Arc **Testnet**. There is no production traction yet — the marketplace currently contains test and seed stores. The arbiter is a single Vendra-controlled wallet for now (centralized by design and stated openly), and production hardening (server-side writes, stricter access control, signed evidence URLs) is on the roadmap before mainnet.

## Links

- Live app: https://vendramarket.xyz
- Repository: https://github.com/nftkinging/vendra
- Escrow contract: https://testnet.arcscan.app/address/0x9BFa767F3454dF7EB5E9515FEa7542d774D3B36f
- Arc Testnet USDC faucet: https://faucet.circle.com
