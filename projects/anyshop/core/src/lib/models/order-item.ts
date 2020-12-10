import * as _ from 'lodash';
import IOrderItem from './order-item.interface';
import Product from './product';
import IProductData from './product-data.interface';

class OrderItem implements IOrderItem {
  /**
   * Cantidad seleccionada del producto.
   */
  quantity = 0;

  /**
   * @deprecated Use `quantity` instead
   */
  get qty() {
    return this.quantity;
  }
  set qty(amount) {
    this.quantity = amount;
  }

  /**
   * @deprecated usar product.price
   */
  price = 0;

  product: Product;
  stockKey: string | undefined;

  // tslint:disable-next-line variable-name

  /**
   * @deprecated usar stockKey
   *
   */
  get stock_id() {
    return this.stockKey;
  }

  set stock_id(stockKey) {
    this.stockKey = stockKey;
  }

  constructor(data: IOrderItem = {}) {
    let product: Product | IProductData = data.product || ({ options: [], name: '', category: '' } as IProductData);

    if (!(product instanceof Product)) {
      this.product = product = new Product(product);
    } else {
      this.product = product;
    }

    if (!this.product.price) {
      this.product.price = data.price || 0;
    }

    this.price = this.product.price;

    this.stockKey = this.stock_id = data.stockKey || data.stock_id;

    this.quantity = data.quantity || data.qty || 0;
  }

  /**
   * Obtiene el coste de los elementos opcionales seleccionados.
   */
  getExtrasTotal() {
    let totalExtras = 0;

    this.product.options.forEach((option) => {
      totalExtras += option.getSelectedTotal();
    });

    return totalExtras;
  }

  /**
   * Obtiene el costo total del producto.
   *
   */
  getTotal() {
    let total = 0;

    total += this.getExtrasTotal();

    total += this.product.price;

    return total * this.quantity;
  }

  serialize(): IOrderItem {
    const data: IOrderItem = {
      price: this.price,
      quantity: this.quantity,
      qty: this.quantity,
      stockKey: this.stockKey,
      stock_id: this.stockKey,
      product: this.product.serialize(),
    };

    return _.pickBy<IOrderItem>(data, (v) => v !== undefined) as IOrderItem;
  }
}

export default OrderItem;
