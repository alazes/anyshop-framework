import { User } from 'firebase/app';

import { Roles } from '../models/roles';

export interface UserAccountInterface extends User {
  uid: string;
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  phone: string;
  type: string;
  roles?: Roles;
  favoriteBussinesses?: { [businessId: string]: boolean };
  favoriteOrders?: { [orderId: string]: boolean };
  favoriteStocks?: { [stockId: string]: boolean };
}
