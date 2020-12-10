import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirebaseItemsAbstractService } from '../firebase/firebase-items-abstract.service';

@Injectable()
export class Zones extends FirebaseItemsAbstractService<any> {
  constructor(public db: AngularFirestore) {
    super('/zones', db);
  }
}
