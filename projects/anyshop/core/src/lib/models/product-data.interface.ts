import { firestore } from 'firebase/app';
import 'firebase/firestore';

import { IProductOption } from '../interfaces';

/**
 * Data en crudo almacenada para el producto
 */
interface IProductData extends firestore.DocumentData {
  key?: string;
  SKU?: string; // eslint-disable-line  @typescript-eslint/naming-convention
  name: string;
  enabled: boolean;
  description?: string;
  owner: string | null;
  ownerRef: firestore.DocumentReference | null;
  picture?: string;
  category: string;

  /**
   * Temporal stock max
   */
  stock?: number;

  price?: number;

  options: IProductOption[];

  createdBy?: string;
  createdAt?: Date | firestore.Timestamp | null;
  updatedAt?: Date | firestore.Timestamp | null;
}

export default IProductData;
