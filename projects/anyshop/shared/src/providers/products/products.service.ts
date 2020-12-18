import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Business, IProductData, Product } from '@anyshop/core';
import { firestore, storage } from 'firebase/app';

import { FileStorageService } from '../file-storage/file-storage.service';
import { FirebaseItemsAbstractService } from '../firebase/firebase-items-abstract.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends FirebaseItemsAbstractService<Product> {
  constructor(
    public afs: AngularFirestore,
    protected fileStorage: FileStorageService,
    protected userService: UserService
  ) {
    super('/products', afs);
  }

  /**
   * Sube la imagen y devuelve la URL.
   */
  protected async uploadPicture(
    id: string,
    businessId: string,
    imageData: { data: string; extension: string; type: string }
  ) {
    const uploadRef = `uploads/businesses/${businessId}/products/${id}`;
    const uploadFilename = `picture.${imageData.extension}`;

    const { downloadURL } = await this.fileStorage.uploadFileFromString(
      uploadRef,
      uploadFilename,
      imageData.data
    );

    return downloadURL as string;
  }

  async create(
    businessId: string,
    data: IProductData,
    imageData: { data: string; extension: string; type: string }
  ) {
    const id = `${this.afs.createId()}`;

    if (!data.SKU) {
      data.SKU = id;
    }

    if (!data.product) {
      data.product = data.name;
    }

    data.picture = await this.uploadPicture(id, businessId, imageData);

    const normalizedProduct: any = this.toJSON(data);

    const productDoc = this.itemsCollection.doc(id).ref;
    const businessDoc = this.afs
      .collection<Business>('businesses')
      .doc(businessId).ref;

    normalizedProduct.createdBy = this.userService.currentUserId;
    normalizedProduct.owner = businessDoc.id;
    normalizedProduct.ownerRef = businessDoc;

    await productDoc.set(normalizedProduct);

    return productDoc as firestore.DocumentReference<Product>;
  }

  async updateByKey(
    id: string,
    data: Partial<IProductData>,
    imageData?: { data: string; extension: string; type: string }
  ) {
    if (imageData) {
      const businessId = data.owner || data.ownerRef?.id;

      if (!businessId) {
        throw new Error(
          'Owner ID is not set in data (required for image upload)'
        );
      }

      data.picture = await this.uploadPicture(id, businessId, imageData);
    }

    const normalizedProduct: Partial<IProductData> = this.toJSON(data);

    delete normalizedProduct.owner;
    delete normalizedProduct.ownerRef;

    return await this.itemsCollection.doc(id).update(normalizedProduct);
  }

  /**
   * @param  businessId Owner ID
   *
   * @deprecated Use create() method instead.
   */
  async add(
    item: Product,
    businessId?: string,
    imageData?: { data: string; extension: string; type: string }
  ) {
    if (!businessId) {
      throw new Error('Owner ID is mandatory');
    }

    if (!imageData) {
      throw new Error('Image Data is mandatory');
    }

    return await this.create(businessId, item, imageData);
  }

  uploadList(list: Array<any>) {
    list.forEach((e) => {
      this.add(e);
    });
  }

  updateList(list: Array<any>) {
    list.forEach((e) => {
      this.update(e, e).then((r) => {
        console.log('update element');
      });
    });
  }

  async getProductImageSrc(prod: Product) {
    const pathReference = storage().ref(
      `products/Abarrotes/Aceites Comestibles/${prod.SKU}.png`
    );
    const downloadURL = await pathReference.getDownloadURL();

    console.log('el link ahor a es', downloadURL);

    return downloadURL;
  }
}
