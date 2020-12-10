import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Account, Business } from '@anyshop/core';
import { FirebaseItemsAbstractService } from '../firebase/firebase-items-abstract.service';

@Injectable({ providedIn: 'any' })
export class UsersService extends FirebaseItemsAbstractService<Account> {
  constructor(public afs: AngularFirestore) {
    super('/users', afs);
  }
}
