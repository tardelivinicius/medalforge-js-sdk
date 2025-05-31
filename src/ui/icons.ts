/**
 * Renderiza ícones exatamente como você definiu
 */
export function renderIcon(iconData: { name?: string }): string {
  if (!iconData?.name) return '';

  // Seu mapeamento original de ícones
  const iconMap: Record<string, string> = {
    'Clock': 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M12 12l3 2',
    'Trophy': 'M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z',
    // ... (TODOS os outros ícones que você tinha definido)
    'Activity': 'M22 12h-4l-3 9L9 3l-3 9H2'
  };

  const path = iconMap[iconData.name] || iconMap['Star'];

  return `
    <svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="${path}"/>
    </svg>
  `;
}