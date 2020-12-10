import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirebaseItemsAbstractService } from '../firebase/firebase-items-abstract.service';

@Injectable({ providedIn: 'any' })
export class PaymentMethodsService extends FirebaseItemsAbstractService<any> {
  constructor(public db: AngularFirestore) {
    super('/payment_methods', db);
  }
}
