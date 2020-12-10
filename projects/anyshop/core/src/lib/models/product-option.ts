import * as _ from 'lodash';
import { IProductOption, ProductOptionValueInterface } from '../interfaces';

export default class ProductOption implements IProductOption {
  name = '';
  values: ProductOptionValueInterface[] = [];
  multiple = false;
  required = false;
  minSelections: number | undefined;
  maxSelections: number | undefined;

  constructor(data: IProductOption);

  constructor(name: string, values: ProductOptionValueInterface[], config: { multiple?: boolean; required?: boolean });

  constructor(
    nameOrData: IProductOption | string,
    values: ProductOptionValueInterface[] = [],
    config: { multiple?: boolean; required?: boolean } = {}
  ) {
    if (typeof nameOrData === 'string' || typeof nameOrData === 'undefined') {
      this.name = nameOrData || '';
      this.values = values;
      this.multiple = config.multiple || false;
      this.required = config.required || false;
    } else {
      this.name = nameOrData.name;
      this.values = nameOrData.values || [];
      this.multiple = nameOrData.multiple;
      this.required = nameOrData.required;
    }
  }

  getSelectedTotal(): number {
    const { price } = this.values
      .filter((val) => val.selected === true)
      .reduce(
        (a, b) => {
          return { price: a.price + b.price, name: '' };
        },
        { price: 0 }
      );

    return price;
  }

  serialize(): IProductOption {
    const serialized = _.pickBy<ProductOption>(this, (v) => v !== undefined && typeof v !== 'function');

    return serialized as IProductOption;
  }
}
