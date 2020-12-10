import IKeyable from '../interfaces/keyable';

export class Model implements IKeyable {
  /**
   * Document ID.
   */
  key?: string;
  constructor(fields: { [a: string]: any }) {
    // Quick and dirty extend/assign fields to this model
    for (const f in fields) {
      if (fields[f]) {
        this[f] = fields[f];
      }
    }
  }
}
