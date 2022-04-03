import { Exceptionable, IExceptionInfo } from './contracts';

/**
 * Excepción genérica con metadata extra para complementar un error.
 */
export default class Exception<TData = unknown>
  extends Error
  implements Exceptionable<TData>
{
  public readonly message: string;
  public readonly code: string | number | undefined;
  public readonly innerError: Error | Exception | unknown | undefined;
  public readonly data: TData | undefined;

  constructor(info: IExceptionInfo<TData> | string) {
    if (typeof info === 'string') {
      info = { message: info } as IExceptionInfo<TData>;
    }

    super(info.message);

    this.message = info.message;
    this.code = info.code;
    this.data = info.data;

    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
