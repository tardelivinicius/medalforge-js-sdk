import { MedalForgeSDK } from '../core/client';
import { Medal, MedalViewerOptions } from '../types/medal';
import { renderIcon } from './icons';

export class MedalViewer {
  constructor(private readonly sdk: MedalForgeSDK) {}

  /**
   * Flexible medal display method that handles both modal and inline rendering
   * @param medals Single medal or array of medals to display
   * @param options Display options including container target
   * @returns HTMLElement if in inline mode, void if modal mode
   */
  async displayMedals(
    medals: Medal | Medal[],
    options: MedalViewerOptions & {
      displayMode?: 'modal' | 'inline';
      targetContainer?: HTMLElement;
      gridClass?: string;
      containerClass?: string;
    } = { displayMode: 'modal' }
  ): Promise<HTMLElement | void> {
    try {
      // Normalize input to always work with array
      const medalsArray = Array.isArray(medals) ? medals : [medals];

      if (!medalsArray.length) {
        throw new Error('At least one medal is required');
      }

      // Default options
      const displayOptions: MedalViewerOptions = {
        size: 'w-[100px]',
        bgColor: 'bg-white',
        textColor: 'text-black',
        showTitle: true,
        ...options
      };

      // Create medal elements
      const medalElements = medalsArray.map(medal =>
        this.createMedalElement(medal, displayOptions)
      );

      if (options.displayMode === 'inline') {
        // Inline mode - return container for user to place in their DOM
        return this.createInlineContainer(medalElements, options);
      } else {
        // Modal mode - auto show modal
        const modal = this.createModal(medalElements, displayOptions);
        this.sdk.getConfig().modalContainer.appendChild(modal);
        this.setupModalCloseBehavior(modal);
      }
    } catch (error) {
      if (this.sdk.getConfig().debug) {
        console.error('Error displaying medals:', error);
      }
      throw error;
    }
  }

  private createMedalElement(medal: Medal, options: MedalViewerOptions): HTMLElement {
    const styles: {
      icon?: any;
      rarity?: any;
      [key: string]: any;
    } = medal.styles || {};
    const iconStyles = styles.icon || {};
    const rarityStyles = styles.rarity || {};

    const medalElement = document.createElement('div');
    medalElement.className = 'flex flex-col items-center p-2';

    medalElement.innerHTML = `
      <div class="group ${styles.size || 'w-24 h-24'} ${styles.format || 'rounded-full'}
            ${styles.texture || ''} ${styles.color || 'bg-blue-500'}
            ${rarityStyles.border_class || 'border-2 border-white'}
            ${rarityStyles.glow_class || ''}
            flex items-center justify-center relative overflow-hidden
            transition-all duration-300 hover:scale-105 mx-auto mb-2">

        ${styles.texture?.includes('gradient') ? `
          <div class="absolute inset-0 ${styles.color}"></div>
        ` : ''}
        <div class="${iconStyles.size || 'w-10 h-10'} text-white drop-shadow-lg">
          ${renderIcon(iconStyles)}
        </div>
      </div>
      ${options.showTitle ? `<h3 class="text-sm font-medium ${options.textColor} text-center">${medal.name}</h3>` : ''}
    `;

    return medalElement;
  }

  private createInlineContainer(
    medalElements: HTMLElement[],
    options: {
      gridClass?: string;
      containerClass?: string;
      targetContainer?: HTMLElement;
    }
  ): HTMLElement {
    const container = document.createElement('div');
    container.className = options.containerClass || 'p-4';

    const grid = document.createElement('div');
    grid.className = options.gridClass || 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4';
    container.appendChild(grid);

    medalElements.forEach(element => grid.appendChild(element));

    // Append to target container if provided
    if (options.targetContainer) {
      options.targetContainer.appendChild(container);
    }

    return container;
  }

  private createModal(medalElements: HTMLElement[], options: MedalViewerOptions): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';

    const modalContent = document.createElement('div');
    modalContent.className = `${options.bgColor} rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto`;

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-6';
    header.innerHTML = `
      <h2 class="text-xl font-bold ${options.textColor}">Your Medals</h2>
      <button data-close-modal class="text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;
    modalContent.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4';
    medalElements.forEach(element => grid.appendChild(element));
    modalContent.appendChild(grid);

    modal.appendChild(modalContent);
    return modal;
  }

  private setupModalCloseBehavior(modal: HTMLElement): void {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    const closeButton = modal.querySelector('[data-close-modal]');
    if (closeButton) {
      closeButton.addEventListener('click', () => modal.remove());
    }
  }
}