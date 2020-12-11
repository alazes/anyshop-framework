/**
 * Clase base para enums extendidos.
 *
 * @since 0.1.26
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
abstract class EnumExtension<E extends number | string> {
  constructor(public readonly value: E) {}

  public static for<T extends EnumExtension<E>, E extends number | string>(
    this: new (value: E) => T,
    value: E
  ) {
    return new this(value);
  }

  public label(): string {
    return this.value.toString();
  }
}

export default EnumExtension;
