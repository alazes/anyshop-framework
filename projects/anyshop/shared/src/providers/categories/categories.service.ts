import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
  QueryFn,
} from '@angular/fire/firestore';
import { Business, Category, Stock, SubCategory } from '@anyshop/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirebaseItemsAbstractService } from '../firebase/firebase-items-abstract.service';
import { StockService } from '../stock/stock.service';

@Injectable({ providedIn: 'root' })
export class CategoriesService extends FirebaseItemsAbstractService<Category> {
  items: Observable<Category[]>;

  defaultCategorie: any = {
    name: 'Abarrotes',
    profilePic: 'assets/img/speakers/bear.jpg',
    about: 'Burt is a Bear.',
  };

  constructor(public afs: AngularFirestore, public stock: StockService) {
    super('/categories', afs);
  }

  add(item: Category) {
    return super.add(item);
  }

  mapElements(action: DocumentChangeAction<Category>) {
    const itemEl = new Category(
      action.payload.doc.data(),
      action.payload.doc.id
    );

    return itemEl;
  }

  getActiveCategories(): Observable<Category[]> {
    const enabledFunction: QueryFn = (ref) => ref.where('enabled', '==', true);

    return this.query(enabledFunction);
  }

  getCategoryStockBusiness(category: Category, business: Business | any) {
    const categoryRef = this.itemsCollection.doc(category.key).ref;
    const stockFilterFunction: QueryFn = (ref) =>
      ref
        .where('categoryRef', '==', categoryRef)
        .where('businessRef', '==', business);

    return this.stock.query(stockFilterFunction);
  }

  /**
   * @deprecated Use StockService.filterByBusiness() instead.
   */
  getUniqueCountProductsCategoryStockBusiness(
    category: Category,
    business: Business | any
  ) {
    const categoryStockBusiness = this.getCategoryStockBusiness(
      category,
      business
    );

    return categoryStockBusiness.pipe(
      map((stock: Stock[]) => {
        const groupStock = _.groupBy(stock, 'product.num_product');

        return _.size(groupStock);
      })
    );
  }

  getCountProductsCategoryStockBusiness(
    category: Category,
    business: Business | any
  ) {
    const categoryStockBusiness = this.getCategoryStockBusiness(
      category,
      business
    );

    return categoryStockBusiness.pipe(
      map((stock: Stock[]) => {
        let sum = 0;
        stock.forEach((product) => {
          product.quantity = product.quantity * 1;
          sum += product.quantity || 0;
        });

        return sum;
      })
    );
  }

  getActiveCategoriesBusiness(businessId: string): Observable<any> {
    return this.query((ref) =>
      ref.where(`businesses.${businessId}`, '==', true)
    );
  }

  getSubCategories(category: string): Observable<SubCategory[]> {
    const queryFunction: QueryFn = (ref) => {
      return ref.where('category', '==', category);
    };
    return this.afs
      .collection('sub_categories', queryFunction)
      .snapshotChanges()
      .pipe(
        map((list) => {
          return list.map(this.mapElements.bind(this));
        })
      );
  }
}
