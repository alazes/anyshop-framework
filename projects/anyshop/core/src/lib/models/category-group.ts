import { IFirebaseData } from '../interfaces';
import { SerializableModel } from './serializable-model';
// import Category from './category';

/**
 * Grupo de categoría.
 *
 * @since 0.2.0
 * @author Nelson Martell <nelson6e65[at]gmail.com>
 */
export class CategoryGroup extends SerializableModel<ICategoryGroup> {
  set name(value: string) {
    this.rawData.name = value;
  }
  get name() {
    return this.rawData.name;
  }

  get enabled() {
    return this.rawData.enabled;
  }

  get sortIndex() {
    return this.rawData.sortIndex;
  }

  // categories: Category[] = [];

  set image(url: string) {
    this.rawData.image = url;
  }
  get image(): string {
    return this.rawData.image || '';
  }

  constructor(rawData: ICategoryGroup, id: string | undefined) {
    super(rawData, id);

    // Corregir los que están undefined
    if (this.rawData.enabled === undefined) {
      this.rawData.enabled = false;
    }
    if (this.rawData.sortIndex === undefined) {
      this.rawData.enabled = false;

      this.rawData.sortIndex = -1;
    }
  }
}

export interface ICategoryGroup extends IFirebaseData {
  name: string;
  image: string;
  enabled: boolean;
  sortIndex: number;
  // categories: string[];
}
