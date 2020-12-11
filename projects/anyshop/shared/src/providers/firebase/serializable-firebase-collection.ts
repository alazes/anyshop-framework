import { DocumentChangeAction, QueryFn } from '@angular/fire/firestore';
import { IFirebaseData } from '@anyshop/core';
import { SerializableModel } from '@anyshop/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirebaseItemsAbstractService } from './firebase-items-abstract.service';

/**
 * @since 1.0.4
 */
export abstract class SerializableFirebaseCollection<
  T extends IFirebaseData,
  U extends SerializableModel<T>
> extends FirebaseItemsAbstractService<T> {
  abstract serialize(action: DocumentChangeAction<T>): U;

  /**
   *
   * @deprecated Use serialize() instead
   */
  mapElements(action: DocumentChangeAction<T>) {
    return action.payload.doc.data();
  }

  query(params?: QueryFn) {
    if (!params) {
      return this.getItems();
    }

    this.filteredCollection = this.afs.collection<T>(
      this.firebaseRoute,
      params
    );

    return this.filteredCollection.snapshotChanges().pipe(
      map((list) => {
        return list.map<T>(this.serialize.bind(this));
      })
    );
  }

  async set(key: string, data: T) {
    return await super.set(key, data);
  }

  getItems(): Observable<T[]> {
    return this.itemsCollection.snapshotChanges().pipe(
      map((list) => {
        return list.map(this.serialize.bind(this));
      })
    );
  }

  async updateByKey(key: string, data: T) {
    return await this.itemsCollection.doc(key).update(data);
  }

  toSimpleObject(item: U) {
    return item.serialize();
  }

  toJSON(item: U) {
    return item.serialize();
  }
}
