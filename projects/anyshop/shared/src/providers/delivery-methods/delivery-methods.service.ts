import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DeliveryMethod } from '@anyshop/core';
import { ApiService } from '@arxis/api';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';

import { FirebaseItemsAbstractService } from '../firebase/firebase-items-abstract.service';

@Injectable({ providedIn: 'any' })
export class DeliveryMethodsService extends FirebaseItemsAbstractService<DeliveryMethod> {
  constructor(public db: AngularFirestore, private api: ApiService) {
    super('/delivery_methods', db);
  }

  getAvaliableDeliveryMethodsAtPoint(
    geoPoint: firestore.GeoPoint
  ): Observable<any> {
    // partial fix
    if (!geoPoint) {
      geoPoint = {
        latitude: 0,
        longitude: 0,
        isEqual: null,
      };
    }

    return this.api.get('searchDeliveryMethods', {
      lat: geoPoint.latitude,
      long: geoPoint.longitude,
    });
  }
}
