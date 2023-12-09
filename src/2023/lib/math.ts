export function sum<T>(array: T[], numberGetter?: (anObject: T) => number) {
  return array.reduce(
    (result, object) =>
      result + (numberGetter ? numberGetter(object) : (object as number)),
    0,
  );
}
