'use client';
import Nav from '../Nav';
import Link from 'next/link';

const ESCROW = '0x9BFa767F3454dF7EB5E9515FEa7542d774D3B36f';
const EXPLORER = 'https://testnet.arcscan.app/address/' + ESCROW;

function Section({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginTop: 44, scrollMarginTop: 90 }}>
      {eyebrow && <div className='eyebrow' style={{ color: 'var(--v4-aDeep,#B47E0E)' }}>{eyebrow}</div>}
      <h2 style={{ fontSize: 26, fontWeight: 800, margin: '6px 0 12px', color: 'var(--v4-ink,#1A1206)' }}>{title}</h2>
      <div style={{ color: 'var(--v4-tx60,#6B6256)', fontSize: 15.5, lineHeight: 1.7 }}>{children}</div>
    </section>
  );
}

export default function Docs() {
  const nav = [
    ['overview', 'Overview'], ['escrow', 'How escrow works'], ['buying', 'Buying'],
    ['selling', 'Selling'], ['disputes', 'Disputes'], ['wallets', 'Wallets'],
    ['contract', 'Smart contract'], ['architecture', 'Architecture'], ['links', 'Links'],
  ];
  return (
    <main className='v4home' style={{ minHeight: '100vh' }}>
      <Nav theme='v4' />
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 20px 80px' }}>
        <div className='eyebrow' style={{ color: 'var(--v4-aDeep,#B47E0E)' }}>Documentation</div>
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: '6px 0 8px', color: 'var(--v4-ink,#1A1206)' }}>
          How <span className='v4amber' style={{ fontStyle: 'italic', color: 'var(--v4-a,#E2A41C)' }}>Vendra</span> works
        </h1>
        <p className='lede' style={{ color: 'var(--v4-tx60,#6B6256)', maxWidth: 620 }}>
          A Web3-native peer-to-peer marketplace on Arc. Every order is protected by real on-chain USDC escrow, commission is 0%, and you can use it with a crypto wallet or just an email.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '18px 0 8px' }}>
          {nav.map(([id, label]) => (
            <a key={id} href={'#' + id} className='v4btn v4btn-ghost' style={{ fontSize: 13 }}>{label}</a>
          ))}
        </div>

        <Section id='overview' eyebrow='Overview' title='Escrow is the product'>
          <p>On most marketplaces you trust a company to hold your money and resolve disputes, and you pay 5&ndash;15% commission for it. On Vendra, an Arc smart contract holds the money instead. When a buyer pays, their USDC is locked in escrow &mdash; not sent to the seller, not held by Vendra. It is released only when the buyer confirms delivery, auto-releases after a safety window, or is settled by a neutral arbiter if there is a dispute. Vendra never takes a cut of the trade.</p>
        </Section>

        <Section id='escrow' eyebrow='Lifecycle' title='How escrow works'>
          <p>Every order moves through a clear on-chain lifecycle:</p>
          <ol style={{ paddingLeft: 20, marginTop: 8 }}>
            <li><strong>Funded</strong> &mdash; the buyer&apos;s USDC is locked in the escrow contract.</li>
            <li><strong>Shipped</strong> &mdash; the seller marks the item shipped.</li>
            <li><strong>Released</strong> &mdash; the buyer confirms receipt and funds go to the seller. If the buyer takes no action, funds auto-release after a 7-day confirmation window (a safety net, not a hold on confirmed orders).</li>
            <li><strong>Refunded</strong> &mdash; if a dispute is resolved in the buyer&apos;s favor.</li>
          </ol>
          <p style={{ marginTop: 10 }}>Two protections sit alongside the happy path: <strong>reclaim</strong> (if the seller never ships, the buyer can reclaim after the 5-day ship deadline) and <strong>dispute</strong> (either party can freeze the funds for an arbiter to settle).</p>
        </Section>

        <Section id='buying' eyebrow='For buyers' title='Buying'>
          <ol style={{ paddingLeft: 20 }}>
            <li>Log in &mdash; connect any EVM wallet, or sign in with your email to get a Circle USDC wallet.</li>
            <li>Fund your wallet with testnet USDC from the faucet.</li>
            <li>Check out &mdash; your USDC is locked in escrow on Arc.</li>
            <li>When your item arrives, open your order and confirm receipt to release payment.</li>
            <li>If something is wrong, raise a dispute instead of confirming.</li>
          </ol>
        </Section>

        <Section id='selling' eyebrow='For sellers' title='Selling'>
          <ol style={{ paddingLeft: 20 }}>
            <li>Create a seller profile and launch a store (a banner and complete details are required to publish).</li>
            <li>Add products with images and USDC prices.</li>
            <li>When an order comes in, mark it shipped.</li>
            <li>You are paid automatically when the buyer confirms receipt, or after the auto-release window.</li>
          </ol>
        </Section>

        <Section id='disputes' eyebrow='Resolution' title='Disputes and arbitration'>
          <p>If a buyer and seller cannot agree, either party raises a dispute, which freezes the order&apos;s funds on-chain. Both sides post their account and upload evidence (photos, receipts, tracking) to a shared case file. A neutral arbiter reviews it and settles on-chain &mdash; full refund, full release, or a custom split. Only the designated arbiter address can move frozen funds; the contract enforces this. At launch the arbiter is a single Vendra-operated wallet; decentralized and AI-assisted arbitration are on the roadmap.</p>
        </Section>

        <Section id='wallets' eyebrow='Onboarding' title='Wallets'>
          <p>Vendra supports two ways to participate, at full parity:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li><strong>EVM wallets</strong> (MetaMask, Coinbase, WalletConnect) &mdash; you sign transactions yourself.</li>
            <li><strong>Email / Circle wallets</strong> &mdash; sign in with an email and a Circle developer-controlled USDC wallet is provisioned for you, with signing handled securely server-side. No seed phrase or extension needed.</li>
          </ul>
          <p style={{ marginTop: 10 }}>Both fund and operate the same on-chain escrow, and every step behaves identically regardless of how you logged in.</p>
        </Section>

        <Section id='contract' eyebrow='On-chain' title='The smart contract'>
          <p><code style={{ background: 'var(--v4-card,#fff)', padding: '2px 6px', borderRadius: 6, border: '1px solid var(--v4-line,#E7E1D4)' }}>VendraEscrow</code> is a purpose-built Solidity contract (^0.8.24) using OpenZeppelin v5 (SafeERC20, ReentrancyGuard, Ownable). One escrow record per order, an explicit state machine, and checks-effects-interactions with reentrancy protection on every transition.</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Configurable confirmation window (7 days) and ship deadline (5 days).</li>
            <li>A single arbiter address authorized to resolve disputes.</li>
            <li>Integrates USDC through Arc&apos;s ERC-20 interface (6-decimal units), while the same balance pays for gas natively.</li>
          </ul>
          <p style={{ marginTop: 10 }}>Address: <a href={EXPLORER} target='_blank' rel='noreferrer' style={{ color: 'var(--v4-aDeep,#B47E0E)', wordBreak: 'break-all' }}>{ESCROW}</a></p>
        </Section>

        <Section id='architecture' eyebrow='Under the hood' title='Architecture'>
          <ul style={{ paddingLeft: 20 }}>
            <li><strong>On-chain (trustless):</strong> custody of funds, the escrow state machine, and dispute outcomes &mdash; the source of truth for anything involving money.</li>
            <li><strong>Off-chain (for UX and cost):</strong> the store and product catalog, profiles, an order index, and dispute case files / evidence.</li>
            <li><strong>Stack:</strong> Next.js, wagmi + viem + RainbowKit (EVM), Circle developer-controlled wallets (email users), Supabase (data + storage), Vercel. Contract built and deployed with Hardhat.</li>
          </ul>
        </Section>

        <Section id='links' eyebrow='Resources' title='Links'>
          <ul style={{ paddingLeft: 20 }}>
            <li><Link href='/marketplace' style={{ color: 'var(--v4-aDeep,#B47E0E)' }}>Browse the marketplace</Link></li>
            <li><a href='https://github.com/nftkinging/vendra' target='_blank' rel='noreferrer' style={{ color: 'var(--v4-aDeep,#B47E0E)' }}>Source on GitHub</a></li>
            <li><a href={EXPLORER} target='_blank' rel='noreferrer' style={{ color: 'var(--v4-aDeep,#B47E0E)' }}>Escrow contract on the Arc explorer</a></li>
            <li><a href='https://faucet.circle.com' target='_blank' rel='noreferrer' style={{ color: 'var(--v4-aDeep,#B47E0E)' }}>Arc Testnet USDC faucet</a></li>
          </ul>
        </Section>
      </div>
    </main>
  );
}
