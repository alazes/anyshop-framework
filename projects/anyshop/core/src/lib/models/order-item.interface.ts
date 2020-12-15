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
  stock_id?: string; // eslint-disable-line  @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
}

export default IOrderItem;
