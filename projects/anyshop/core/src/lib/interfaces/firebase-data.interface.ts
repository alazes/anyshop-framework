import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import 'firebase/firestore';

/**
 * Datos en crudo desde Firebase, restringido a los compatibles.
 *
 * @since 0.2.0
 * @author Nelson Martell <nelson6e65[at]gmail.com>
 *
 * @todo Completar tipos de datos compatibles.
 */
export interface IFirebaseData extends DocumentData {
  [field: string]: IFirebaseFieldType;
}

/**
 * Tipos de valores válidos para los campos.
 */
export type IFirebaseFieldType =
  | null
  | string
  | number
  | boolean
  | DocumentReference
  | firestore.DocumentReference
  | firestore.Timestamp
  | IFirebaseData
  | Array<
      | null
      | string
      | number
      | boolean
      | DocumentReference
      | firestore.DocumentReference
      | firestore.Timestamp
      | IFirebaseData
    >;
