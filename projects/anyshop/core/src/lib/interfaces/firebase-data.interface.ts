import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import firebase from 'firebase/app';

/**
 * Datos en crudo desde Firebase, restringido a los compatibles.
 *
 * @since 0.2.0
 * @author Nelson Martell <nelson6e65@gmail.com>
 *
 * @todo Completar tipos de datos compatibles.
 */
export interface IFirebaseData extends DocumentData {
  [field: string]: FirebaseDataType;
}

/**
 * Tipos de valores válidos para los campos.
 *
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
export type FirebaseDataType =
  | null
  | string
  | number
  | boolean
  | DocumentReference<IFirebaseData>
  | Date
  | firebase.firestore.Timestamp
  | firebase.firestore.GeoPoint
  | firebase.firestore.FieldValue
  | IFirebaseData
  | Array<FirebaseDataType>;

/**
 * @deprecated Use FirebaseDataType directly instead
 */
export type IFirebaseFieldType = FirebaseDataType;
