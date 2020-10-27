export class Basics {
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
}
