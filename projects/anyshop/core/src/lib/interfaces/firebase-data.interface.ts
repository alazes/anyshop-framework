import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import firebase from 'firebase/app';

export declare type Timestamp = firebase.firestore.Timestamp;
export declare type GeoPoint = firebase.firestore.GeoPoint;
export declare type FieldValue = firebase.firestore.FieldValue;

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
  | Timestamp
  | GeoPoint
  | FieldValue
  | IFirebaseData
  | Array<
      | string
      | number
      | boolean
      | DocumentReference<IFirebaseData>
      | Date
      | Timestamp
      | GeoPoint
      | FieldValue
      | IFirebaseData
    >;

/**
 * @deprecated Use FirebaseDataType directly instead
 */
export type IFirebaseFieldType = FirebaseDataType;
