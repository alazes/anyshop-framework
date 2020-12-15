import Color from './color.enum';

/**
 * Valoración o calificación.
 */
enum Rate {
  None = 0,
  Awful = 1,
  Bad = 2,
  Neutral = 3,
  Good = 4,
  Great = 5,
}

/**
 * Obtiene el color correspondiente de la valoración especificada.
 *
 * @deprecated
 */
export const color = (rate: Rate): Color => {
  switch (rate) {
    case Rate.Awful:
      return Color.Danger;

    case Rate.Bad:
      return Color.Warning;

    case Rate.Neutral:
      return Color.Light;

    case Rate.Good:
      return Color.Primary;

    case Rate.Great:
      return Color.Success;

    default:
      return Color.None;
  }
};

/**
 * Obtiene el nombre del ícono correspondiente.
 *
 * @deprecated
 */
export const icon = (rate: Rate): string => {
  // TODO: Diferenciar más los íconos
  switch (rate) {
    case Rate.Awful:
      return 'sad';

    case Rate.Bad:
      return 'sad';

    case Rate.Neutral:
      return 'happy';

    case Rate.Good:
      return 'happy';

    case Rate.Great:
      return 'happy';

    default:
      return 'help-circle-outline';
  }
};

export default Rate;
