import { Map, Set } from "immutable";
import {
  createStringMap,
  applicativeSplit,
  stringListFromMap,
  searchStrings,
  searchStringsIter,
  getNextChars,
} from "./strings";

describe(`applicativeSplit`, () => {
  test(`applicative split works`, () => {
    expect(applicativeSplit(["abcd", "aacd", "aaad", "bacd"])).toEqual([
      ["a", "b", "c", "d"],
      ["a", "a", "c", "d"],
      ["a", "a", "a", "d"],
      ["b", "a", "c", "d"],
    ]);
  });
});

describe(`createStringMap`, () => {
  test(`creates string map`, () => {
    const stations = ["abcd", "aacd", "aaad", "bacd"];

    expect(createStringMap(stations)).toEqual(
      Map({
        a: Map({
          a: Map({
            a: Map({
              d: Map({
                "\n": null,
              }),
            }),
            c: Map({
              d: Map({
                "\n": null,
              }),
            }),
          }),
          b: Map({
            c: Map({
              d: Map({
                "\n": null,
              }),
            }),
          }),
        }),
        b: Map({
          a: Map({
            c: Map({
              d: Map({
                "\n": null,
              }),
            }),
          }),
        }),
      })
    );
  });

  test(`creates string map where strings have differing lengths`, () => {
    const stations = ["a", "bb"];

    expect(createStringMap(stations)).toEqual(
      Map({
        a: Map({ "\n": null }),
        b: Map({
          b: Map({ "\n": null }),
        }),
      })
    );
  });

  test(`creates string map where one string is a substring of another`, () => {
    const stations = ["a", "aa"];

    expect(createStringMap(stations)).toEqual(
      Map({
        a: Map({
          "\n": null,
          a: Map({ "\n": null }),
        }),
      })
    );
  });
});

const mediumStringMap = Map({
  a: Map({
    a: Map({
      a: Map({
        d: Map({ "\n": null }),
      }),
      c: Map({
        d: Map({ "\n": null }),
      }),
    }),
    b: Map({
      c: Map({
        d: Map({ "\n": null }),
      }),
    }),
  }),
  b: Map({
    a: Map({
      c: Map({
        d: Map({ "\n": null }),
      }),
    }),
  }),
});

describe(`stringListFromMap`, () => {
  test(`works on single char strings`, () => {
    expect(
      stringListFromMap(Map({ c: Map({ "\n": null }), d: Map({ "\n": null }) }))
    ).toEqual(Set(["c", "d"]));
  });

  test(`works on two char strings`, () => {
    expect(
      stringListFromMap(
        Map({
          a: Map({
            c: Map({ "\n": null }),
            d: Map({ "\n": null }),
          }),
        })
      )
    ).toEqual(Set(["ac", "ad"]));
  });

  test(`works on four char strings`, () => {
    expect(stringListFromMap(mediumStringMap)).toEqual(
      Set([`abcd`, `aacd`, `aaad`, `bacd`])
    );
  });
});

describe(`searchStringsIter`, () => {
  test(`can search a StringMap for matches`, () => {
    expect(searchStringsIter(mediumStringMap, ["a", "a"])).toEqual(
      Map({
        a: Map({
          d: Map({ "\n": null }),
        }),
        c: Map({
          d: Map({ "\n": null }),
        }),
      })
    );
  });
});

describe(`searchStrings`, () => {
  test(`can search a StringMap for matches`, () => {
    expect(searchStrings(mediumStringMap, "aa")).toEqual(
      Map({
        a: Map({
          d: Map({ "\n": null }),
        }),
        c: Map({
          d: Map({ "\n": null }),
        }),
      })
    );
  });

  test(`searches are case insensitive`, () => {
    expect(searchStrings(mediumStringMap, "AA")).toEqual(
      Map({
        a: Map({
          d: Map({ "\n": null }),
        }),
        c: Map({
          d: Map({ "\n": null }),
        }),
      })
    );
  })
});

describe(`getNextChars`, () => {
  test(`returns list of next characters`, () => {
    expect(getNextChars(mediumStringMap)).toEqual(Set(["a", "b"]));
  });
});
