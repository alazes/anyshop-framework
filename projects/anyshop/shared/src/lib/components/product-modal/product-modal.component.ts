import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IProductOption } from '@anyshop/core';
import { IOrderItem, OrderItem, ProductOption } from '@anyshop/core';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { startWith } from 'rxjs/operators';

import { normalizeBooleanAttribute } from '../../helpers';

import {
  ProductOptionFormGroup,
  ProductOptionValueFormGroup,
} from './product-option.form-group';

export interface IOrderItemModalData {
  options: IProductOption[];
  quantity: number;
}

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
})
export class ProductModalComponent implements OnInit {
  private _readonly = false;
  private _max = 28;
  currentItem = new OrderItem();

  form!: FormGroup;

  quantityRange = {
    value: 1,
    max: 15,
  };

  /**
   * Indica si el componente será de sólo lectura.
   *
   * @todo Implementar funcionalidad para solo lectura.
   */
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(readonly: boolean) {
    this._readonly = normalizeBooleanAttribute(readonly);
  }

  @Input()
  item!: OrderItem;

  @Input()
  quantity = 1;

  /**
   * Obtiene o estable el máximo de productos que se pueden agregar.
   *
   * Tiene valor tope para que el <ion-range/> se muestre eficientemente.
   */
  get max() {
    return this._max;
  }
  @Input()
  set max(max) {
    this._max =
      _.min([max, Number.MAX_SAFE_INTEGER]) || Number.MAX_SAFE_INTEGER;
  }

  /**
   * Indica si el formulario es válido.
   */
  get isValid() {
    return this.form?.valid || false;
  }

  get optionsForm() {
    return this.form.controls.options as FormArray;
  }

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.currentItem = new OrderItem(this.item as IOrderItem);

    const options = this.item.product.options.map(
      (o: ProductOption | IProductOption) => {
        let productOption: ProductOption;

        if (o instanceof ProductOption) {
          productOption = o;
        } else {
          productOption = new ProductOption(o);
        }

        return new ProductOptionFormGroup(productOption);
      }
    );

    this.form = new FormGroup({
      quantity: new FormControl(this.item.quantity || 1, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.max),
      ]),
      options: new FormArray([...options]),
    });

    this.quantityRange = {
      value: this.form.value.quantity,
      max: _.max<number>([this.form.value.quantity, 15]) || 15,
    };

    if (this.readonly) {
      this.form.disable();
    }

    // this.form.updateValueAndValidity();

    this.form.valueChanges
      // Inicia  apenas cambia, obtiene valores viejos + nuevos
      .pipe(startWith<IOrderItemModalData>(this.form.value))
      .subscribe((v: IOrderItemModalData) => {
        // console.log(v.options);

        this.currentItem.product.options = v.options.map(
          (o) =>
            new ProductOption(o.name, o.values, {
              multiple: o.multiple,
              required: o.required,
            })
        );

        this.currentItem.quantity = v.quantity;
      });

    // console.log(this.form);
  }

  async dismiss(role: string = 'none') {
    let data: IOrderItemModalData | undefined;

    if (role === 'submit') {
      const raw = this.form.getRawValue() as IOrderItemModalData;

      // raw.options = raw.options.map((o) => {
      //   const { selectedIndex } = (o as unknown) as { selectedIndex: number };
      //
      //   if (!o.multiple) {
      //     // Selecciona sólo uno según el index seleccionado con el radio-group
      //     o.values = o.values.map((val, i) => {
      //       val.selected = i === selectedIndex;
      //
      //       return val;
      //     });
      //   }
      //
      //   return o;
      // });

      data = raw;
    }

    return this.modalController.dismiss(data, role);
  }

  syncRadioSelectionWithForm(
    { detail }: CustomEvent<{ value: number }>,
    formArray: ProductOptionValueFormGroup[]
  ) {
    formArray.forEach((f, i) => {
      f.patchValue({ selected: detail.value === i });
    });
  }

  syncQuantityRangeWithForm(_ev: MouseEvent | TouchEvent) {
    this.form.patchValue({ quantity: this.quantityRange.value });

    if (
      this.currentItem.quantity >= this.quantityRange.max &&
      this.currentItem.quantity < this.max
    ) {
      this.quantityRange.max = _.min([
        this.quantityRange.max + 5,
        this.max,
      ]) as number;
    }
  }
}
