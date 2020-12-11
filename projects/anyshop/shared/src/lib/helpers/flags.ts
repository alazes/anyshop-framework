import EnumExtension from './enum-extension';

/* tslint:disable:no-bitwise */

/**
 * Provee métodos para operar con flags en enums.
 *
 * @since 0.1.26
 * @since 2020-01-06
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
export default class Flags<E extends number> extends EnumExtension<E> {
  constructor(value: E) {
    if (value < 0) {
      throw Error('Valores negativos no son compatibles con flags.');
    }

    super(value);
  }

  hasFlag(value: E) {
    return (this.value & value) === value;
  }

  isFlag(value: E) {
    return this.value === value;
  }

  addFlag(value: E) {
    return (this.value | value) as E;
  }

  removeFlag(value: E): E {
    return (this.value & ~value) as E;
  }

  /**
   * Obtiene los flags individuales.
   */
  getFlags(): E[] {
    if (this.value === 0) {
      return [];
    }

    const flags: E[] = [];

    let i = 0;
    let flag = 0;
    let val = this.value.valueOf();

    while (val > 0) {
      flag = 1 << i;

      if (this.hasFlag(flag as E)) {
        flags.push(flag as E);
        val -= flag;
      }

      i++;
    }

    return flags;
  }
}
