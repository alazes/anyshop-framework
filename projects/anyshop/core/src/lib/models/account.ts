import { UserAccountInterface } from '../interfaces';

import { Model } from './abstract-model';
import { Roles } from './roles';

class Account extends Model {
  uid?: string;
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  phone: string;
  type: string;
  roles?: Roles;

  /**
   * IDs de negocios favoritos del usuario.
   */
  favoriteBussinesses: { [businessId: string]: boolean } = {};

  /**
   * IDs de pedidos favoritos del usuario.
   */
  favoriteOrders: { [orderId: string]: boolean } = {};

  constructor(data: UserAccountInterface | any = {}) {
    super(data);

    this.key = this.uid = data.uid;

    this.favoriteBussinesses = data.favoriteBussinesses;
    this.favoriteOrders = data.favoriteOrders;
  }

  /**
   * Indica si el usuario tienen al negocio especificado como favorito.
   */
  hasFavorite(businessId: string): boolean {
    return this.favoriteBussinesses[businessId] === true;
  }
}

export default Account;
