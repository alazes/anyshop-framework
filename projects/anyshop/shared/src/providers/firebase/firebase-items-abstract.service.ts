import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction,
  DocumentReference,
  QueryFn,
} from '@angular/fire/firestore';
import { IFirebaseData, IKeyable } from '@anyshop/core';
import firebase from 'firebase/app';
import { clone } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirebaseItems } from './firebase-items';

export abstract class FirebaseItemsAbstractService<
  T extends IKeyable | IFirebaseData
> implements FirebaseItems<T>
{
  itemsCollection: AngularFirestoreCollection<T>;
  items: Observable<T[]>;
  filteredCollection: AngularFirestoreCollection<T>;

  // defaultItem?: any;

  constructor(public firebaseRoute: string, public afs: AngularFirestore) {
    this.itemsCollection = afs.collection<T>(firebaseRoute);
    // this.items = this.getItems();
  }

  mapElements(action: DocumentChangeAction<T>) {
    const itemEl = action.payload.doc.data();

    itemEl.key = action.payload.doc.id;

    return itemEl;
  }

  query(params?: QueryFn): Observable<T[]> {
    if (!params) {
      return this.getItems();
    }

    this.filteredCollection = this.afs.collection<T>(
      this.firebaseRoute,
      params
    );

    return this.filteredCollection
      .snapshotChanges()
      .pipe(map((list) => list.map<T>(this.mapElements.bind(this))));
  }

  async add(item: T): Promise<firebase.firestore.DocumentReference<T>> {
    return (await this.itemsCollection.add(
      item
    )) as firebase.firestore.DocumentReference<T>;
  }

  async set(item: any, data: any) {
    return await this.itemsCollection.doc(item.key).set(data);
  }

  getDocByKey(key: string): AngularFirestoreDocument<T> {
    return this.itemsCollection.doc(key);
  }

  findBy(
    field: string,
    value: string | number | boolean | DocumentReference
  ): Observable<T[]> {
    const findByFilterFunction: QueryFn = (ref) =>
      ref.where(field, '==', value);

    return this.query(findByFilterFunction);
  }

  findOneBy(
    field: string,
    value: string | number | boolean | DocumentReference
  ): Observable<T> {
    return this.findBy(field, value).pipe(
      map((elements: T[]) => {
        if (elements) {
          return elements[0];
        } else {
          return null;
        }
      })
    );
  }

  getItems(): Observable<T[]> {
    return this.itemsCollection
      .snapshotChanges()
      .pipe(map((list) => list.map(this.mapElements.bind(this))));
  }

  update(item: any, data: any) {
    return this.itemsCollection.doc(item.key).update(data);
  }

  async updateByKey(key: string, data: any) {
    return await this.itemsCollection.doc(key).update(data);
  }

  async delete(item: IKeyable | string): Promise<void> {
    let key: string;

    if (typeof item === 'string') {
      key = item;
    } else {
      key = item.key;
    }

    return await this.itemsCollection.doc(key).delete();
  }

  toSimpleObject(item: any) {
    return JSON.parse(JSON.stringify(item));
  }

  toJSON(obj) {
    const json = {};

    Object.keys(obj).forEach((e) => {
      json[e] = clone(obj[e]);
    });

    return json;
  }
}
