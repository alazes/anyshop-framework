import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Address } from '@anyshop/core';
import { FirebaseItemsAbstractService } from '../firebase/firebase-items-abstract.service';

@Injectable({ providedIn: 'any' })
export class AddressesService extends FirebaseItemsAbstractService<Address> {

  constructor(public db: AngularFirestore) {
    super('/addresses', db);
  }

  add(item: Address) {
    return super.add(item);
  }
}
