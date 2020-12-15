import { PaymentMethod } from '../enums';

import { Model } from './abstract-model';
import Address from './address';
import DeliveryMethod from './delivery-method';
import Schedule from './schedule';

class Business extends Model {
  _id: string; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  active: boolean;
  email: string;
  name: string;
  img: string;
  profilePic: string;
  owner: string;
  address: Address;
  radio: any;
  key: string;
  ruc: string;
  minOrder = 0;
  geolocation: any;
  category?: any;
  categories?: { [category: string]: boolean };
  custom_area: string; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  polygon_area: any; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  phone: any;
  /**
   * @deprecated Use `paymentMethods` property instead.
   */
  payment_methods: Array<any> = []; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match
  paymentMethods: PaymentMethod = PaymentMethod.None;
  activeCategories: any;
  delivery_methods: DeliveryMethod[] = []; // eslint-disable-line  @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  timeToAttend: number | undefined;
  pendingOrders: number | undefined;
  totalOrders?: number;
  canDeferOrders = false;
  schedule?: Schedule;

  /**
   * Clientes que tienen a este negocio como favorito.
   *
   * No modificar este campo directamente.
   */
  favoritedByCustomer: { [userId: string]: boolean } = {};

  /**
   * Indica si el usuario especificado ha agregaro este negocio como favorito.
   */
  isFavoriteFor(userId: string): boolean {
    return this.favoritedByCustomer[userId] === true;
  }
}

export default Business;
