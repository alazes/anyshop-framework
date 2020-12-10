import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ComponentsConfigService } from '../../components-config.service';
import { ProductStockSavedEvent, ProductStockSavingEvent, ProductStockValue } from '../../events';
import { normalizeBooleanAttribute } from '../../helpers';

@Component({
  selector: 'product-stock-card',
  templateUrl: './product-stock-card.component.html',
  styleUrls: ['./product-stock-card.component.scss'],
})
export class ProductStockCardComponent implements OnInit {
  private _editable = false;
  private _picture = '';

  protected value: ProductStockValue = {
    price: 0,
    quantity: 0,
  };

  newValue: ProductStockValue = {
    price: 0,
    quantity: 0,
  };

  priceFormControl: FormControl;
  quantityFormControl: FormControl;

  /**
   * Moneda a usar.
   */
  @Input()
  currencyCode: string;

  @Input()
  public innerClass = 'ion-no-margin ion-margin-bottom';

  @Input()
  public set editable(value) {
    this._editable = normalizeBooleanAttribute(value);
  }
  public get editable() {
    return this._editable;
  }

  editing = false;

  @Input()
  public set picture(value) {
    this._picture = value || '';
  }
  public get picture(): string {
    return this._picture;
  }

  @Input()
  public set quantity(value: number) {
    this.value.quantity = +value || 0;
  }
  public get quantity(): number {
    return this.value.quantity;
  }

  @Output()
  readonly saving: EventEmitter<ProductStockSavingEvent> = new EventEmitter<ProductStockSavingEvent>();

  @Output()
  readonly saved: EventEmitter<ProductStockSavedEvent> = new EventEmitter<ProductStockSavedEvent>();

  @Input()
  public name = '';

  @Input()
  public brand = '';

  @Input()
  public set price(value: number) {
    this.value.price = +value || 0;
  }
  public get price(): number {
    return this.value.price;
  }

  constructor(config: ComponentsConfigService) {
    this.currencyCode = config.defaultCurrency;

    this.priceFormControl = new FormControl(0, [Validators.required, Validators.min(0)]);
    this.quantityFormControl = new FormControl(0, [Validators.required, Validators.min(0)]);
  }

  ngOnInit() {
    //
  }

  get isValid(): boolean {
    return this.quantityFormControl.valid && this.priceFormControl.valid;
  }

  getNewValue(): ProductStockValue {
    return {
      price: parseFloat(this.priceFormControl.value),
      quantity: parseInt(this.quantityFormControl.value, 10),
    };
  }

  toggleEdit() {
    if (this.editing) {
      if (this.isValid && this.save()) {
        this.editing = false;
      }
    } else {
      this.quantityFormControl.patchValue(this.quantity);
      this.priceFormControl.setValue(this.price);

      this.editing = true;
    }
  }

  cancelEdit() {
    this.editing = false;
  }

  save(): boolean {
    const newValue = this.getNewValue();
    const savingEvent = new ProductStockSavingEvent(newValue, this.value);

    this.saving.emit(savingEvent);

    if (savingEvent.isDefaultPrevented()) {
      return false;
    }

    this.value = newValue;

    const savedEvent = new ProductStockSavedEvent(this.value);

    this.saved.emit(savedEvent);

    return true;
  }

  incrementQuantity() {
    this.quantityFormControl.setValue((+this.quantityFormControl.value || 0) + 1);
  }

  decrementQuantity() {
    const currentValue = +this.quantityFormControl.value || 0;

    if (currentValue > 0) {
      this.quantityFormControl.setValue(currentValue - 1);
    } else {
      console.warn('Intentando decrementar por debajo de cero');
    }
  }
}
