import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryFn,
} from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';

export interface FirebaseItems<T> {
  afs: AngularFirestore;
  itemsCollection: AngularFirestoreCollection<T>;
  items: Observable<T[]>;

  defaultItem?: T;

  query(params?: QueryFn): Observable<T[]>;

  add(item: T): Promise<firestore.DocumentReference<T>>;

  delete(item: T | string): Promise<void>;
}
