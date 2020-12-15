import { DocumentReference } from '@angular/fire/firestore';

import { Model } from './abstract-model';
import { CategoryGroup, ICategoryGroup } from './category-group';
import SubCategory from './sub-category';

class Category extends Model {
  name: string;
  products_count = 0; // eslint-disable-line  @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  sortIndex = 0;
  img: string;
  key?: string;
  enabled: boolean;
  businesses?: {
    [business: string]: boolean;
  };
  subCategories: SubCategory[];

  categoryGroupRef: DocumentReference | null = null;

  constructor(data: Partial<Category> = {}, id?: string) {
    super({});

    this.key = id || data.key;

    this.name = data.name || '';
    this.sortIndex = data.sortIndex || 0;
    this.img = data.img || '';
    this.enabled = data.enabled === true;
    this.subCategories = data.subCategories || [];
    this.categoryGroupRef = data.categoryGroupRef || null;
    this.businesses = data.businesses || {};
  }

  /**
   * Obtiene la instancia (promise) del grupo de la categoría actual, si la posee.
   *
   * @since 0.2.0
   * @author Nelson Martell <nelson6e65[at]gmail.com>
   */
  async categoryGroup(): Promise<CategoryGroup | undefined> {
    if (this.categoryGroupRef) {
      const snapshot = await this.categoryGroupRef.get();

      if (snapshot.exists) {
        return new CategoryGroup(
          snapshot.data() as ICategoryGroup,
          snapshot.id
        );
      }
    }

    return undefined;
  }
}

export default Category;
