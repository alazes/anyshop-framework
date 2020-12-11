export interface ProductStockValue {
  quantity: number;
  price: number;
}

export class ProductStockSavedEvent {
  constructor(public readonly value: ProductStockValue) {
    if (isNaN(value.quantity) || value.quantity < 0) {
      throw new Error('La cantidad no puede ser negativa.');
    }

    if (isNaN(value.price) || value.price < 0) {
      throw new Error('EL precio no puede ser negativo.');
    }
  }
}

/**
 * Evento cancelable para la acción de guardar. Puede ser usado para validar los datos antes de establecer los valores.
 */
export class ProductStockSavingEvent extends ProductStockSavedEvent {
  private _isDefaultPrevented = false;

  constructor(
    newValue: ProductStockValue,
    public readonly oldValue: ProductStockValue
  ) {
    super(newValue);
  }

  /**
   * Set the default behavior as been prevented.
   */
  preventDefault(): void {
    this._isDefaultPrevented = true;
  }

  /**
   * Determine if the default behavior has been prevented.
   */
  isDefaultPrevented(): boolean {
    return this._isDefaultPrevented;
  }
}
