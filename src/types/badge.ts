/**
 * Badge rarity levels
 */
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Badge style properties
 */
export interface BadgeStyle {
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
 * Badge representation
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  unlockedAt?: string;
  styles?: BadgeStyle;
  verificationUrl?: string;
}

/**
 * Options for listing badges
 */
export interface BadgeListOptions {
  includeProgress?: boolean;
  onlyUnlocked?: boolean;
  rarityFilter?: BadgeRarity[];
}