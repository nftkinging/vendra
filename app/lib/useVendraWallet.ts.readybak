'use client';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'vendra_circle_wallet';
type CircleWallet = { address: string; walletId: string; email: string };

/**
 * Unified wallet identity for Vendra.
 * Returns the connected web3 (wagmi) address when present, otherwise the
 * Circle wallet address saved in sessionStorage. This lets Circle-login
 * users buy, sell and own profiles exactly like web3 users.
 *
 * `ready` is true once sessionStorage has been read on the client — pages
 * that redirect when disconnected should wait for `ready` before deciding.
 */
export function useVendraWallet() {
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const [circle, setCircle] = useState<CircleWallet | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(STORAGE_KEY);
      setCircle(s ? JSON.parse(s) : null);
    } catch { setCircle(null); }
    setReady(true);
  }, []);

  const usingWagmi = wagmiConnected && !!wagmiAddress;
  const address = (usingWagmi ? wagmiAddress : circle?.address) as `0x${string}` | undefined;
  const isConnected = !!address;

  return { address, isConnected, isCircle: !usingWagmi && !!circle, circle, ready };
}
