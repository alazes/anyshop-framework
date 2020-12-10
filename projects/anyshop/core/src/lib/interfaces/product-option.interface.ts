import ProductOptionValueInterface from './product-option-value.interface';

interface IProductOption {
  name: string;
  multiple: boolean;
  required: boolean;
  minSelections?: number;
  maxSelections?: number;
  values: ProductOptionValueInterface[];
}

export default IProductOption;
