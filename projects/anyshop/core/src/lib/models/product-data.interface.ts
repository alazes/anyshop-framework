import firebase from 'firebase/app';

import { IProductOption } from '../interfaces';

/**
 * Data en crudo almacenada para el producto
 */
interface IProductData extends firebase.firestore.DocumentData {
  key?: string;
  SKU?: string; // eslint-disable-line  @typescript-eslint/naming-convention
  name: string;
  enabled: boolean;
  description?: string;
  owner: string | null;
  ownerRef: firebase.firestore.DocumentReference | null;
  picture?: string;
  category: string;

  /**
   * Temporal stock max
   */
  stock?: number;

  price?: number;

  options: IProductOption[];

  createdBy?: string;
  createdAt?: Date | firebase.firestore.Timestamp | null;
  updatedAt?: Date | firebase.firestore.Timestamp | null;
}

export default IProductData;
