import { ParamMap } from '@angular/router';
import { isArray, isNil } from 'lodash';

/**
 * Convierte un objeto plano en su representación como query string para URLs.
 *
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
export function objectToQueryString(params: { [key: string]: number | string | undefined | Array<string> }): string {
  const queryString = Object.keys(params)
    .map((key) => {
      let q = '';
      const value = params[key];

      if (!isNil(value)) {
        if (isArray(value)) {
          const values = (value as string[]).map((val) => {
            return key + '=' + val;
          });

          q = values.join('&');
        } else {
          q = key + '=' + value.toString();
        }
      }

      return q;
    })
    .filter((param) => {
      return param.length > 1;
    })
    .join('&');

  return queryString;
}

/**
 * Convierte un valor a booleano el valor de un atributo HTML.
 *
 * Compatible con `true`, `false`, `undefined` y las cadenas `''`, `'on'`, `'true'` (true) y `off`, `'false'`. (false).
 *
 * Su mera presencia asume que es `true`.
 *
 * @since 0.1.25
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
export function normalizeBooleanAttribute(value: string | boolean | undefined): boolean {
  let val: boolean;

  // Verificar conversión al establecerlo desde markup
  if (typeof value === 'string') {
    const valueAsString = value.toLowerCase().trim();

    val = valueAsString === '' || valueAsString === 'true' || valueAsString === 'on';
  } else {
    val = value === true || value === undefined;
  }

  return val;
}

/**
 * Determina si el parámetro especificado está en los parámetros y contiene un
 * valor correspondiente a `true`.
 *
 * @param  name   Nombre del parámetro.
 * @param  params [description]
 *
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
export function paramIsTrue(name: string, params: ParamMap): boolean {
  if (params.has(name)) {
    return stringIsTrue(params.get(name) ?? '');
  }

  return false;
}

/**
 * Determina si una cadena contiene el valor entendible como `true`.
 * Por ejemplo 'true', 'yes' o '1'.
 *
 * @param  value Cadena a evaluar.
 *
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
export function stringIsTrue(value: string | boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  const val = value.toLowerCase().trim();

  switch (val) {
    case '1':
    case 'true':
    case 'yes':
      return true;
    default:
      return false;
  }
}
