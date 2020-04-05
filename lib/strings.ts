import { Set, Map } from "immutable";
import { map, split, groupBy, head, tail, equals, append, init } from "ramda";

export const applicativeSplit = map(split(""));

export interface StringMap extends Map<string, StringMap | null> {}

export const createStringMapIter = (
  stringList: string[][]
): StringMap | null => {
  if (equals([[]], stringList)) return null;

  const groupedStrings = groupBy(head, stringList);
  const groupedStringTails = map(map(tail), groupedStrings) as {
    [letter: string]: string[][];
  };
  const stringMap = map(createStringMapIter, groupedStringTails);
  return Map(stringMap);
};

export const createStringMap = (strings: string[]): StringMap | null => {
  const stringsWithTerminator = map(s => s + `\n`, strings);
  const charArrayArray = applicativeSplit(stringsWithTerminator);

  return createStringMapIter(charArrayArray);
};

export const stringListFromMapIter = function(
  stringMap: StringMap | null
): Set<string> {
  return stringMap === null
    ? Set([""])
    : stringMap.reduce((acc: Set<string>, value, key) => {
        return acc.merge(
          stringListFromMapIter(value).map((tail: string) => key + tail)
        );
      }, Set([]));
};

export const stringListFromMap = function(stringMap: StringMap) {
  return stringListFromMapIter(stringMap).map(init);
};

export const searchStringsIter = function(
  stringMap: StringMap,
  searchChars: string[]
): StringMap | undefined {
  const [searchChar, ...restSearchChars] = searchChars;
  const matches = stringMap.filter((value, key) => {
    return searchChar.toLowerCase() === key.toLowerCase();
  });
  if (matches.size === 0) {
    return undefined;
  }

  const nextStringMap = matches.reduce(
    (acc, stringMap) => {
      return stringMap ? acc.merge(stringMap) : acc;
    },
    Map({}) as StringMap
  );

  return restSearchChars.length === 0
    ? nextStringMap
    : searchStringsIter(nextStringMap, restSearchChars);
};

export const searchStrings = function(
  stringMap: StringMap,
  searchString: string
): StringMap | null {
  const resultsStringMap = searchStringsIter(stringMap, searchString.split(""));
  return resultsStringMap ? resultsStringMap : null;
};

export const getNextChars = function(stringMap: StringMap) {
  return stringMap.keySeq().toSet();
};
