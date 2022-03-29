import firebase from 'firebase/app';
import { Observable } from 'rxjs';

export interface ArxisFirestoreAuthAbstractInterface<T> {
  authFillAction(user: firebase.User | null): Observable<T>;
}
