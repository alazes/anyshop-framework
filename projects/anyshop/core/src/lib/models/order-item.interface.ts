import IProductData from './product-data.interface';

interface IOrderItem {
  /**
   * Cantidad
   */
  quantity?: number;

  /**
   * @deprecated
   */
  qty?: number;

  /**
   * @deprecated Usar product.price
   */
  price?: number;
  product?: IProductData;
  stockKey?: string;
  /**
   * @deprecated
   */
  stock_id?: string; // tslint:disable-line variable-name
}

export default IOrderItem;
