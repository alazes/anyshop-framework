import { IFirebaseData } from '../interfaces/firebase-data.interface';

/**
 * Provee un funcionalidad para serializar el objeto compatible con Firebase.
 */
export interface ISerializable {
  serialize(): IFirebaseData;
}

/**
 * Constructor de una clase serializable.
 *
 * @param data Data de firebase.
 */
export type IUnserializable = new (data: IFirebaseData) => ISerializable;

/**
 * Clase base para generar modelos serializables con datos basados en una interfaz.
 *
 * @since 0.2.0
 * @author Nelson Martell <nelson6e65[at]gmail.com>
 */
export abstract class SerializableModel<T extends IFirebaseData>
  implements ISerializable {
  /**
   * Almacén en crudo de la data de firestore.
   */
  protected readonly rawData: T;

  constructor(rawData: T, public readonly id: string | undefined) {
    this.rawData = rawData;
  }

  serialize(): T {
    return this.rawData;
  }
}
