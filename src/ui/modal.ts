import { MedalForgeSDK } from '../core/client';
import { Medal } from '../types/medal';
import { modalStyleOptions } from '../types/modal';
import { renderIcon } from './icons';

/**
 * Modal Manager - Mantido conforme sua implementação original
 */
export class ModalManager {
  constructor(private readonly sdk: MedalForgeSDK) {}

  /**
   * Mostra o modaL
   */

  async show(medal: Medal, options?: modalStyleOptions): Promise<void> {
    try {
      if (!medal) {
        throw new Error('Invalid payload: missing medal data');
      }

      const modalOptions: modalStyleOptions = {
        modalBgColor: 'bg-foreground',
        modalBorderRadius: 'rounded-xl',
        buttonBgColor: 'bg-primary',
        buttonHoverColor: '',
        buttonTextColor: 'text-foreground',
        titleTextColor: 'text-primary',
        descriptionTextColor: 'text-primary',
        buttonCloseColor: 'text-primary',
        buttonCloseHoverColor: 'text-primary',
        ...options
      };

      const modal = this.createModal(medal, modalOptions);
      this.sdk.getConfig().modalContainer.appendChild(modal);
      this.setupCloseBehavior(modal);

    } catch (error) {
      if (this.sdk.getConfig().debug) {
        console.error('Error showing medal modal:', error);
      }
      throw error;
    }
  }

  /**
   * Criação do modal
   */
  private createModal(medal: Medal, options: modalStyleOptions): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';

    const styles: {
      icon?: any;
      rarity?: any;
      [key: string]: any;
    } = medal.styles || {};
    const icon = styles.icon || {};
    const rarity = styles.rarity || {};

    modal.innerHTML = `
      <div class="${options.modalBgColor} ${options.modalBorderRadius} p-6 max-w-md w-full relative">
        <button data-close-modal class="absolute top-3 right-3 ${options.buttonCloseColor} hover:${options.buttonCloseHoverColor} text-2xl">
          &times;
        </button>

        <div class="flex flex-col items-center">
          <div class="group ${styles.size || 'w-24 h-24'} ${styles.format || 'rounded-full'}
               ${styles.texture || ''} ${styles.color || 'bg-blue-500'}
               ${rarity.border_class || 'border-2 border-white'}
               ${rarity.glow_class || ''}
               flex items-center justify-center relative overflow-hidden
               transition-all duration-300 hover:scale-105 mx-auto mb-4">

            ${styles.texture?.includes('gradient') ? `
              <div class="absolute inset-0 ${styles.color}"></div>
            ` : ''}

            <div class="${icon.size || 'w-10 h-10'} text-white drop-shadow-lg">
              ${renderIcon(icon)}
            </div>
          </div>

          <div class="text-center">
            <h3 class="text-xl font-bold ${options.titleTextColor}">${medal.name}</h3>
            <p class="mt-2 text-gray-600 ${options.descriptionTextColor}">${medal.description}</p>
          </div>

          <div class="mt-6 flex gap-3 w-full">
            <button class="flex-1 px-4 py-2 ${options.buttonBgColor} ${options.buttonTextColor} hover:${options.buttonHoverColor} rounded-lg transition">
              Compartilhar
            </button>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  /**
   * Comportamento de fechar
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