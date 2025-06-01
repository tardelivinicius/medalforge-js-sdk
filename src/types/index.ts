// types.ts
export interface MedalPayload {
  event: string;
  user_id: string;
  medal: {
    id: string;
    name: string;
    verify_hash: string;
    styles: {
      size?: 'extra_small' | 'small' | 'medium' | 'large' | 'extra_large';
      format?: 'circle' | 'square' | 'diamond' | 'star';
      texture?: 'flat' | 'glossy' | 'metallic' | 'neon';
      color?: string;
      shape?: string;
      texture_class?: string;
      rarity?: {
        border_class: string;
        glow_class: string;
      };
      icon?: {
        type: 'icon' | 'image';
        path?: string; // Para ícones SVG
        url?: string; // Para imagens
        class?: string;
      };
    };
  };
  timestamp: string;
  sdk_config: {
    version: string;
    required_fields: string[];
    callback_actions: string[];
  };
}

export interface IMedal {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  unlockedAt?: string;
}