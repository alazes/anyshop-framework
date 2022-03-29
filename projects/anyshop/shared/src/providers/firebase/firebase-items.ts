import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryFn,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';

export interface FirebaseItems<T> {
  afs: AngularFirestore;
  itemsCollection: AngularFirestoreCollection<T>;
  items: Observable<T[]>;

  defaultItem?: T;

  query(params?: QueryFn): Observable<T[]>;

  add(item: T): Promise<firebase.firestore.DocumentReference<T>>;

  delete(item: T | string): Promise<void>;
}
