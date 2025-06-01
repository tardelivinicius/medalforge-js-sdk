import { MedalForgeSDK } from '../core/client';
import { Medal, MedalViewerOptions } from '../types/medal';
import { renderIcon } from './icons';

/**
 * Modal Manager - Mantido conforme sua implementação original
 */
export class ViewerManager {
  constructor(private readonly sdk: MedalForgeSDK) {}

  /**
   * Mostra uma única medal
   */
  async showMedal(medal: Medal, options?: MedalViewerOptions): Promise<void> {
    try {
      if (!medal) {
        throw new Error('Invalid payload: missing medal data');
      }

      const modalOptions: MedalViewerOptions = {
        size: 'w-[100px]',
        bgColor: 'bg-white',
        textColor: 'text-black',
        ...options
      };

      const medalElement = this.viewer(medal, modalOptions, 'single');
      this.sdk.getConfig().modalContainer.appendChild(medalElement);
      this.setupCloseBehavior(medalElement);

    } catch (error) {
      if (this.sdk.getConfig().debug) {
        console.error('Error showing medal modal:', error);
      }
      throw error;
    }
  }

  /**
   * Mostra todas as medals em um modal
   */
  async showAllMedals(medals: Medal[], options?: MedalViewerOptions): Promise<void> {
    try {
      if (medals.length === 0) {
        throw new Error('Invalid payload: missing medal data');
      }

      const modalOptions: MedalViewerOptions = {
        size: 'w-[100px]',
        bgColor: 'bg-white',
        textColor: 'text-black',
        showTitle: true,
        ...options
      };

      const modal = this.viewer(medals, modalOptions, 'all');
      this.sdk.getConfig().modalContainer.appendChild(modal);
      this.setupCloseBehavior(modal);

    } catch (error) {
      if (this.sdk.getConfig().debug) {
        console.error('Error showing medals modal:', error);
      }
      throw error;
    }
  }

  async showAsContainer(
    medals: Medal[],
    options?: MedalViewerOptions & {
      containerClass?: string;   // Classes CSS customizadas para o container
      gridClass?: string;       // Classes CSS para o grid interno
    }
  ): Promise<HTMLElement> {
    if (!medals.length) {
      throw new Error('Invalid payload: missing medal data');
    }

    const container = document.createElement('div');
    container.className = options?.containerClass || 'p-4';

    const grid = document.createElement('div');
    grid.className = options?.gridClass || 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4';
    container.appendChild(grid);

    medals.forEach(medal => {
      const medalElement = this.createSingleMedal(medal, {
        size: 'w-[100px]',
        bgColor: 'bg-transparent',
        textColor: 'text-black',
        showTitle: true,
        ...options
      });
      grid.appendChild(medalElement);
    });
    console.log(container)
    this.sdk.getConfig().modalContainer.appendChild(container);
    return container;
  }

  /**
   * Criação do viewer (single medal ou modal com todas)
   */
  private viewer(medal: Medal | Medal[], options: MedalViewerOptions, mode: 'single' | 'all'): HTMLElement {
    if (mode === 'single') {
      return this.createSingleMedal(medal as Medal, options);
    } else {
      return this.createAllMedalsModal(medal as Medal[], options);
    }
  }

  /**
   * Cria um elemento para uma única medal
   */
  private createSingleMedal(medal: Medal, options: MedalViewerOptions): HTMLElement {
    const styles: {
      icon?: any;
      rarity?: any;
      [key: string]: any;
    } = medal.styles || {};
    const icon = styles.icon || {};
    const rarity = styles.rarity || {};

    const medalContainer = document.createElement('div');
    medalContainer.className = 'p-4';

    medalContainer.innerHTML = `
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
        ${options.showTitle ? `<h3 class="text-sm font-medium ${options.textColor} text-center">${medal.name}</h3>` : ''}
      </div>
    `;
    return medalContainer;
  }

  /**
   * Cria um modal com todas as medals
   */
  private createAllMedalsModal(medals: Medal[], options: MedalViewerOptions): HTMLElement {
    const modal = document.createElement('div');
    modal.className = `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`;

    const modalContent = document.createElement('div');
    modalContent.className = `${options.bgColor} rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto`;

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-6';
    header.innerHTML = `
      <h2 class="text-xl font-bold ${options.textColor}">Your medals:</h2>
      <button data-close-modal class="text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;
    modalContent.appendChild(header);

    const medalsGrid = document.createElement('div');
    medalsGrid.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4';

    medals.forEach(medal => {
      const medalElement = this.createSingleMedal(medal, {
        ...options,
        showTitle: true
      });
      medalsGrid.appendChild(medalElement);
    });

    modalContent.appendChild(medalsGrid);
    modal.appendChild(modalContent);

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