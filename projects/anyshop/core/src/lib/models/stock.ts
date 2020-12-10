import { firestore } from 'firebase/app';
import { IProductData } from '../../lib/models';
import { Model } from './abstract-model';
import Business from './business';
import Category from './category';
import Product from './product';

class Stock extends Model {
  /**
   * @deprecated Usar businessRef para obtener la instancia.
   */
  business?: Business;
  businessRef: firestore.DocumentReference | null = null;
  key: string | undefined;

  /**
   * @deprecated Usar productRef para obtener la instancia.
   */
  product?: Product;
  productRef: firestore.DocumentReference<IProductData> | null = null;

  /**
   * @deprecated Usar el categoryRef para obtener la instancia.
   */
  category?: Category;
  categoryRef: firestore.DocumentReference | null = null;
  price = 0;
  quantity = 0;

  /**
   * Mapea a los usuarios que marcaron el producto/stock como favorito.
   */
  favoritedByCustomer: { [userId: string]: boolean };

  constructor(fields: Partial<Stock> = {}, id?: string) {
    super(fields);

    this.categoryRef = fields.categoryRef || null;
    this.businessRef = fields.businessRef || null;
    this.productRef = fields.productRef || null;

    this.key = id;

    this.favoritedByCustomer = fields.favoritedByCustomer || {};
  }
}

export default Stock;
