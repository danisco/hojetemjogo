import type { Channel } from '@/lib/broadcast/mapping';

interface Props {
  channel: Channel;
  small?: boolean;
}

const TYPE_LABEL: Record<Channel['type'], string> = {
  'tv-aberta': 'TV Aberta',
  'tv-fechada': 'TV Fechada',
  'ppv': 'Pay-per-view',
  'streaming': 'Streaming',
  'streaming-gratuito': 'Grátis',
};

export default function BroadcastBadge({ channel, small = false }: Props) {
  return (
    <span
      title={`${channel.name} — ${TYPE_LABEL[channel.type]}`}
      className={`inline-flex items-center rounded-full font-medium text-white ${channel.color} ${
        small ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {channel.name}
    </span>
  );
}
