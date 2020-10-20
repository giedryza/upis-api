export class Helpers {
  static stripUndefined = (obj: { [key: string]: any }) =>
    Object.keys(obj)
      .filter((k) => obj[k] !== undefined)
      .reduce((filtered, k) => ({ ...filtered, [k]: obj[k] }), {});
}
