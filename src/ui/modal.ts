import { MedalForgeStudio } from '../core/client';
import { Badge } from '../types/badge';
import { renderIcon } from './icons';

/**
 * Modal Manager - Mantido conforme sua implementação original
 */
export class ModalManager {
  constructor(private readonly sdk: MedalForgeStudio) {}

  /**
   * Mostra o modal exatamente como você definiu
   */
  show(payload: { badge: Badge }): void {
    try {
      if (!payload.badge) {
        throw new Error('Invalid payload: missing badge data');
      }

      const modal = this.createModal(payload);
      this.sdk.getConfig().modalContainer.appendChild(modal);
      this.setupCloseBehavior(modal);

    } catch (error) {
      if (this.sdk.getConfig().debug) {
        console.error('Error showing badge modal:', error);
      }
      throw error;
    }
  }

  /**
   * Criação do modal IDÊNTICA ao seu código original
   */
  private createModal(payload: { badge: Badge }): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';

    const badge = payload.badge;
    const styles: {
      icon?: any;
      rarity?: any;
      [key: string]: any;
    } = badge.styles || {};
    const icon = styles.icon || {};
    const rarity = styles.rarity || {};

    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full relative">
        <button data-close-modal class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl">
          &times;
        </button>

        <div class="flex flex-col items-center">
          <!-- Badge Container (MANTIDO ORIGINAL) -->
          <div class="group ${styles.size || 'w-24 h-24'} ${styles.format || 'rounded-full'}
               ${styles.texture || ''} ${styles.color || 'bg-blue-500'}
               ${rarity.border_class || 'border-2 border-white'}
               ${rarity.glow_class || ''}
               flex items-center justify-center relative overflow-hidden
               transition-all duration-300 hover:scale-105 mx-auto mb-4">

            ${styles.texture?.includes('gradient') ? `
              <div class="absolute inset-0 ${styles.color}"></div>
            ` : ''}

            <!-- Ícone (MANTIDO ORIGINAL) -->
            <div class="${icon.size || 'w-10 h-10'} text-white drop-shadow-lg">
              ${renderIcon(icon)}
            </div>
          </div>

          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">${badge.name}</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-300">Conquista desbloqueada!</p>

            <div class="mt-4 text-sm">
              <span class="text-gray-500">ID:</span>
              <span class="font-mono ml-2">${badge.id}</span>
            </div>
          </div>

          <div class="mt-6 flex gap-3 w-full">
            <button class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition">
              Salvar
            </button>
            <button class="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition">
              Compartilhar
            </button>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  /**
   * Comportamento de fechar (MANTIDO ORIGINAL)
   */
  private setupCloseBehavior(modal: HTMLElement): void {
    // Fechar ao clicar no backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Fechar ao clicar no botão de close
    const closeButton = modal.querySelector('[data-close-modal]');
    if (closeButton) {
      closeButton.addEventListener('click', () => modal.remove());
    }
  }
}