import { DocumentReference } from '@angular/fire/firestore';
import * as _ from 'lodash';

import { Model } from './abstract-model';
import IProductData from './product-data.interface';
import ProductOption from './product-option';

class Product extends Model implements IProductData {
  id: string | undefined;
  category: string;
  subCategory: any;
  brand: string | undefined;
  key: string | undefined;
  product: string | undefined;
  picture: any;
  hasPicture?: boolean;
  parent: Product | undefined;
  children: Product[] | undefined;
  primary: boolean | undefined;
  principal: string | undefined;
  price: number;
  SKU: string | undefined; // eslint-disable-line  @typescript-eslint/naming-convention
  presentation: string | undefined;
  quantity: string | undefined;
  type: string | undefined;
  flavor: string | undefined;
  infoExtra: string | undefined;
  num_product: number | undefined; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match,
  order: number | undefined;
  fullName?: string; // ghost variable
  qty?: number; // ghost variable
  stock?: number; // ghost variable
  stockPrice?: number; // ghost variable
  stock_id: string | undefined; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match,
  bar_code?: any; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match,
  business_code?: any; // eslint-disable-line  @typescript-eslint/naming-convention,no-underscore-dangle,id-blacklist,id-match,
  status: any;
  accepted: boolean | undefined;
  acceptedAt: Date | undefined;
  pending: boolean | undefined;
  rejected: boolean | undefined;
  enabled: boolean;
  exclusive: boolean | undefined;
  products_by_rack: number | undefined; // eslint-disable-line  @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  requestBy: any;
  createdBy: string | undefined;
  createdAt: Date | firebase.firestore.Timestamp | undefined;
  updatedAt: Date | firebase.firestore.Timestamp | undefined;
  owner: string | null = null;
  ownerRef: DocumentReference | null = null;
  name = '';
  description: string | undefined;

  pictureThumb: any;
  pictureThumb40: any;

  options: ProductOption[] = [];

  constructor(data: Partial<IProductData>, id?: string) {
    super(data);

    const options = data.options || [];

    this.id = this.key = id;

    this.name = data.name || '';

    this.owner = data.owner || null;
    this.ownerRef = data.ownerRef || null;
    this.category = data.category || '';
    this.enabled = data.enabled === true;
    this.price = data.price || 0;

    this.options = options.map(
      (opt) =>
        new ProductOption(opt.name, opt.values, {
          required: opt.required,
          multiple: opt.multiple,
        })
    );
  }

  addChild(product: Product) {
    if (!this.children) {
      this.children = [];
    }

    this.children.push(product);

    return this;
  }

  setForRequest() {
    this.accepted = false;
    this.pending = true;
    this.enabled = true;
    this.rejected = false;
    this.exclusive = true;
    this.createdAt = new Date();
    this.order = 1;
  }

  initializeForImport() {
    this.accepted = true;
    this.pending = false;
    this.enabled = true;
    this.rejected = false;
    this.exclusive = false;
  }

  /**
   * Convierte el objeto para ser guardado.
   */
  serialize(): IProductData {
    const data: IProductData = {
      category: this.category,
      description: this.description,
      enabled: this.enabled === true,
      name: this.name,
      options: this.options.map((opt) => opt.serialize()),
      owner: this.owner,
      ownerRef: this.ownerRef,
      price: this.price,
      picture: this.picture,
      SKU: this.SKU, // eslint-disable-line  @typescript-eslint/naming-convention
      createdBy: this.createdBy,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    };

    // Quitar los valores undefined
    return _.pickBy<IProductData>(data, (v) => v !== undefined) as IProductData;
  }
}

export default Product;
