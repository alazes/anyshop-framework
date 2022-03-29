import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { ArxisSmsAuthService } from '../services';
import { ArxisFireAuthService } from '../services/user/fire-auth.service';
import { ArxisFireStoreAuthService } from '../services/user/firestore-auth.service';
import {
  ArxisIonicFireStoreAuthService,
  ROUTE_FCM_DOC,
} from '../services/user/ionic-firestore-auth.service';

@NgModule({
  declarations: [],
  imports: [AngularFireModule, AngularFireAuthModule, AngularFirestoreModule],
  exports: [],
  providers: [],
})
export class AuthModule {
  static forRoot(options: {
    [key: string]: any;
  }): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        { provide: FIREBASE_OPTIONS, useValue: options },
        { provide: ROUTE_FCM_DOC, useValue: 'FCM' },
        ArxisFireAuthService,
        ArxisFireStoreAuthService,
        ArxisIonicFireStoreAuthService,
        ArxisSmsAuthService,
      ],
    };
  }
}
