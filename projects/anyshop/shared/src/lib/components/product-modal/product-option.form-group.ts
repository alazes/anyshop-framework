import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ProductOptionValueInterface } from '@anyshop/core';
import { ProductOption } from '@anyshop/core';
import * as _ from 'lodash';

/**
 * Validaciones personalizadas para ProductOption.
 */
export class CustomValidators {
  /**
   * Comprueba que se hayan seleccionado un mínimo de opciones.
   */
  public static minSelections(min: number): ValidatorFn {
    const validator = <T extends AbstractControl>(
      control: T
    ): ValidationErrors | null => {
      // console.log({ min });
      if (min > 0) {
        const values = control.value as ProductOptionValueInterface[];

        const selectedValues = values.filter((val) => {
          return val.selected === true;
        });

        // console.log({ selectedValues, valid: selectedValues.length >= min });

        if (selectedValues.length < min) {
          return {
            minSelections: {
              message: `Is required at least ${min} selections!`,
            },
          } as ValidationErrors;
        }
      }

      return null;
    };

    return validator;
  }

  /**
   * Comprueba que no se hayan seleccionado demasiadas opciones.
   */
  public static maxSelections(max: number): ValidatorFn {
    const validator = <T extends AbstractControl>(
      control: T
    ): ValidationErrors | null => {
      // console.log({ max });
      if (max > 0) {
        const values = control.value as ProductOptionValueInterface[];

        const selectedValues = values.filter((val) => {
          return val.selected === true;
        });

        // console.log({ selectedValues, valid: selectedValues.length <= max });

        if (selectedValues.length > max) {
          return {
            maxSelections: {
              message: `There's too many selections (${selectedValues.length}/${max})!`,
            },
          } as ValidationErrors;
        }
      }

      return null;
    };

    return validator;
  }
}

export class ProductOptionValueFormGroup extends FormGroup {
  constructor(optionValue?: ProductOptionValueInterface) {
    super({
      name: new FormControl(optionValue?.name, Validators.required),
      price: new FormControl(optionValue?.price || 0, [
        Validators.min(0),
        Validators.required,
      ]),
      selected: new FormControl(optionValue?.selected || false, [
        Validators.required,
      ]),
    });
  }
}

/**
 * Formulario para ProductOption.
 */
export class ProductOptionFormGroup extends FormGroup {
  constructor(option: ProductOption) {
    let { minSelections = 0, maxSelections = Number.MAX_SAFE_INTEGER } = option;
    const { required = false, multiple = false, name = '' } = option;

    minSelections = required ? _.max([minSelections, 1]) || 0 : 0;
    maxSelections = multiple
      ? _.min([maxSelections, option.values.length]) || Number.MAX_SAFE_INTEGER
      : 1;

    let selectedIndex = -1;
    // const selectedIndexes: number[] = [];

    const values = option.values.map(
      (value: ProductOptionValueInterface, i) => {
        if (!multiple && value.selected) {
          selectedIndex = i;
        }

        // if (value.selected) {
        //   selectedIndexes.push(i);
        // }

        return new ProductOptionValueFormGroup(value);
      }
    );

    // const selectedIndexesValidations = multiple
    //   ? [Validators.minLength(minSelections), Validators.maxLength(maxSelections)]
    //   : [Validators.min(minSelections - 1), Validators.max(maxSelections - 1)];

    super({
      name: new FormControl(name, [Validators.required]),
      // selectedIndexes: new FormControl(selectedIndexes, selectedIndexesValidations),
      selectedIndex: new FormControl(selectedIndex), // Auxiliar para radio
      values: new FormArray(values, [
        // FIXME: 🐛 No se disparan con los radiobutton
        CustomValidators.minSelections(minSelections),
        CustomValidators.maxSelections(maxSelections),
      ]),
      required: new FormControl(required),
      multiple: new FormControl(multiple),
      minSelections: new FormControl(minSelections),
      maxSelections: new FormControl(maxSelections),
    });
  }

  get values(): FormArray {
    return this.get('values') as FormArray;
  }

  addValue(data?: ProductOptionValueInterface): void {
    this.values.push(new ProductOptionValueFormGroup(data));
  }

  removeValue(index: number): void {
    this.values.removeAt(index);
  }
}
