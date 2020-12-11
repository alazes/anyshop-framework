import { Rate } from '@anyshop/core';

import EnumExtension from './enum-extension';

/**
 * @since 0.1.26
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
export default class RateExtension extends EnumExtension<Rate> {
  faIcon(mode?: 'fas' | 'far'): string[] {
    const iconValue: string[] = [mode || 'fas'];

    switch (this.value) {
      case Rate.Awful:
        iconValue.push('angry');
        break;

      case Rate.Bad:
        iconValue.push('frown');
        break;

      case Rate.Neutral:
        iconValue.push('meh');
        break;

      case Rate.Good:
        iconValue.push('smile');
        break;

      case Rate.Great:
        iconValue.push('grin');
        break;

      default:
        iconValue.push('meh-blank');
    }

    return iconValue;
  }

  label() {
    let text: string;

    switch (this.value) {
      case Rate.Awful:
        text = 'Horrible';
        break;

      case Rate.Bad:
        text = 'Mala';
        break;

      case Rate.Neutral:
        text = 'Normal';
        break;

      case Rate.Good:
        text = 'Buena';
        break;

      case Rate.Great:
        text = 'Excelente';
        break;

      default:
        text = '';
    }

    return text;
  }

  name(): string | undefined {
    return Rate[this.value];
  }

  color() {
    const name = this.name();

    if (name) {
      return `rate-${name.toLowerCase()}`;
    } else {
      return 'medium';
    }
  }
}
