import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProductOption, OrderItem, ProductOption } from '@anyshop/core';

import { AlertController, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

import { ComponentsConfigService } from '../../components-config.service';
import { normalizeBooleanAttribute } from '../../helpers';
import {
  IOrderItemModalData,
  ProductModalComponent,
} from '../product-modal/product-modal.component';

const MIN_QUANTITY = 0;

@Component({
  selector: 'order-product-card',
  templateUrl: './order-product-card.component.html',
  styleUrls: ['./order-product-card.component.scss'],
})
export class OrderProductCardComponent implements OnInit {
  private _min = MIN_QUANTITY;
  private _max = Infinity;
  private _readonly = false;
  private _item: OrderItem = new OrderItem();
  private _favorited: boolean | null;

  get item() {
    return this._item;
  }
  @Input()
  set item(item) {
    if (!(item instanceof OrderItem)) {
      throw new TypeError('`item` prop must to ve an OrderItem instance');
    }

    this._item = item;
  }

  /**
   * Moneda a usar.
   */
  @Input()
  currencyCode: string;

  /**
   * Indica si el componente será o no de sólo lectura.
   */
  get readonly(): boolean {
    return this._readonly;
  }
  @Input()
  set readonly(readonly: boolean) {
    this._readonly = normalizeBooleanAttribute(readonly);
  }

  /**
   * Obtiene o establece la cantidad del producto.
   */
  get quantity(): number {
    return this.item.quantity;
  }
  @Input()
  set quantity(quantity: number) {
    let value = parseInt(`${quantity}`, 10);

    if (value < this.min) {
      this.minReached.emit(this.min);
      value = this.min;
    }

    if (value > this.max) {
      this.maxReached.emit(this.max);
      value = this.max;
    }

    if (this.item.quantity !== value) {
      this.quantityChange.emit(value);
    }

    this.item.quantity = value;
  }

  /**
   * Obtiene o establece un valor que indica si el componente marcará favorito.
   *
   * Se admite "null" para indicar que no se debe mostrar el botón para colocar favorito.
   */
  @Input()
  set favorited(favorited: boolean | undefined | null) {
    if (favorited === null) {
      this._favorited = null;
    } else {
      this._favorited = normalizeBooleanAttribute(favorited);
    }
  }
  get favorited() {
    return this._favorited;
  }

  get options() {
    return this.item.product.options;
  }
  set options(options: Array<ProductOption | IProductOption>) {
    this.item.product.options = options.map((o) => new ProductOption(o));

    this.optionsChange.emit(this.item.product.options);
  }

  /**
   * Se dispara cuando se cambia manualmente la cantidad.
   */
  @Output()
  readonly quantityChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Se dispara cuando se cambian las optiones.
   */
  @Output()
  readonly optionsChange: EventEmitter<ProductOption[]> = new EventEmitter<
    ProductOption[]
  >();

  /**
   * Se dispara al intentar sobrepasar el máximo.
   */
  @Output()
  readonly maxReached: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Se dispara al intentar establecer la cantidad por debajo del mínimo.
   */
  @Output()
  readonly minReached: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Se dispara cuando el usuario hace click en el ícono de favorito.
   */
  @Output()
  readonly favoritedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Obtiene o establece la cantidad mínima.
   */
  get min(): number {
    return this._min;
  }
  @Input()
  set min(min: number) {
    this._min = min;
  }

  /**
   * Obtiene o establece la cantidad máxima.
   */
  get max(): any {
    return this._max;
  }
  @Input()
  set max(max: any) {
    this._max = max;
  }

  /**
   * Obtiene el precio total.
   */
  get total(): number {
    return this.item.getTotal();
  }

  get hasOptions() {
    return this.item.product.options.length > 0;
  }

  /**
   * <ion-card/> class attribute.
   */
  @Input()
  innerClass: string | undefined;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    config: ComponentsConfigService
  ) {
    this.currencyCode = config.defaultCurrency;
    //
  }

  ngOnInit() {
    //
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    this.quantity--;
  }

  async openFormModal() {
    const modal = await this.modalController.create({
      component: ProductModalComponent,
      componentProps: {
        item: this.item,
        // readonly: true,
        readonly: this.readonly,
        max: this.max,
      },
    });

    await modal.present();

    const result = (await modal.onDidDismiss()) as OverlayEventDetail<IOrderItemModalData>;

    // console.log(result);

    if (result.role === 'submit' && result.data) {
      const { data } = result;

      this.options = data.options;
      this.quantity = data.quantity;
    }
  }

  async handleAdd() {
    if (!this.hasOptions) {
      this.increaseQuantity();
    } else {
      await this.openFormModal();
    }
  }

  async handleDelete() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      subHeader: '¿Deseas quitar este producto de su carrito?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.quantity = 0;
          },
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }

  toggleFavorited() {
    if (this.favorited !== null) {
      this.favoritedChange.emit(!this.favorited);
    }
  }
}
