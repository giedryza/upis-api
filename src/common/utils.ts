export class Utils {
  static get nowInSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  static stripUndefined = (obj: { [key: string]: any }) =>
    Object.keys(obj)
      .filter((k) => obj[k] !== undefined)
      .reduce((filtered, k) => ({ ...filtered, [k]: obj[k] }), {});

  static filterObject = <T extends { [key: string]: any }>(
    obj: T,
    keys: string[]
  ): Partial<T> =>
    Object.keys(obj).reduce(
      (acc, cur) => (keys.includes(cur) ? acc : { ...acc, [cur]: obj[cur] }),
      {}
    );

  static isObject = (obj: any): obj is 'object' =>
    typeof obj === 'object' && obj !== null;

  static isNumeric = (str: any) => {
    if (typeof str !== 'string') {
      return false;
    }

    return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
  };

  static toPositive = (value: any, fallback: number) => {
    if (!Utils.isNumeric(value)) return fallback;

    const number = +value;

    if (number < 1) return fallback;

    return number;
  };
}
