/**
 * Medal rarity levels
 */
export type MedalRarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Medal style properties
 */
export interface MedalStyle {
  size?: string;
  color?: string;
  format?: string;
  texture?: string;
  icon: {
    name: string;
    size?: string;
  };
  rarity?: {
    borderClass?: string;
    glowClass?: string;
  };
}

/**
 * Medal representation
 */
export interface Medal {
  id: string;
  name: string;
  trigger_type: string;
  description: string;
  is_active: string;
  unlockedAt?: string;
  styles?: MedalStyle;
}

/**
 * Options for listing medals
 */
export interface MedalListOptions {
  includeProgress?: boolean;
  onlyUnlocked?: boolean;
  rarityFilter?: MedalRarity[];
}

export interface MedalViewerOptions {
  size?: string;
  bgColor?: string;
  textColor?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  containerClass?: string;
  asModal?: boolean
}