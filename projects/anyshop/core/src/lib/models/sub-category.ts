import { Model } from './abstract-model';

class SubCategory extends Model {
  name: string;
  category: string;
  img?: string;
  key?: string;
  enabled: boolean;
}

export default SubCategory;
