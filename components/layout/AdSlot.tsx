'use client';

import { useEffect } from 'react';

type SlotId = 'top' | 'mid' | 'bottom';

interface Props {
  slot: SlotId;
  className?: string;
}

/**
 * Fixed-height CLS-safe ad placeholder.
 * Heights are locked so layout never shifts when the ad loads.
 * Uses Google AdSense if NEXT_PUBLIC_ADSENSE_CLIENT and the slot IDs are configured.
 */
const SLOT_CONFIG: Record<SlotId, { dataAdSlot: string; className: string }> = {
  top:    { dataAdSlot: process.env.NEXT_PUBLIC_AD_SLOT_TOP    ?? '', className: 'h-[50px] sm:h-[90px]' },
  mid:    { dataAdSlot: process.env.NEXT_PUBLIC_AD_SLOT_MID    ?? '', className: 'h-[250px]' },
  bottom: { dataAdSlot: process.env.NEXT_PUBLIC_AD_SLOT_BOTTOM ?? '', className: 'h-[50px] sm:h-[90px]' },
};

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSlot({ slot, className = '' }: Props) {
  const config = SLOT_CONFIG[slot];
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (client && config.dataAdSlot) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (_) {
        // AdSense not loaded yet — no-op
      }
    }
  }, [client, config.dataAdSlot]);

  if (!client || !config.dataAdSlot) {
    // Dev/unconfigured: show placeholder so layout is identical
    return (
      <div
        className={`ad-slot flex items-center justify-center rounded bg-gray-100 text-xs text-gray-300 ${config.className} ${className}`}
        aria-hidden="true"
      >
        Ad
      </div>
    );
  }

  return (
    <div className={`ad-slot ${config.className} ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client={client}
        data-ad-slot={config.dataAdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
