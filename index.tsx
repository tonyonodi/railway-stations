import React, { useState } from "react";
import { render, Box } from "ink";
import TextInput from "ink-text-input";
import {
  createStringMap,
  searchStrings,
  StringMap,
  stringListFromMap,
  getNextChars,
} from "./lib/strings";
import stationList from "./stations";

const stationsStringMap = createStringMap(stationList);

if (!stationsStringMap) {
  throw "Stations list was empty.";
}

const NotFound = () => {
  return <Box>No stations found.</Box>;
};

const Station = ({ name }: { name: string }) => {
  return <Box>{name}</Box>;
};

const StationsList = ({
  stringMap,
  searchTerm,
}: {
  stringMap: StringMap;
  searchTerm: string;
}) => {
  const stringList = stringListFromMap(stringMap);
  return (
    <Box flexDirection="column">
      <Box>{getNextChars(stringMap).join(" ")}</Box>
      {stringList.map(string => (
        <Station
          key={`${searchTerm}${string}`}
          name={`${searchTerm}${string}`}
        />
      ))}
    </Box>
  );
};

const App = () => {
  const [text, updateText] = useState("");

  const matchesStringMap = searchStrings(stationsStringMap, text);

  return (
    <Box flexDirection="column">
      <Box>
        <Box>Station name: </Box>
        <TextInput onChange={updateText} value={text} />
      </Box>
      {matchesStringMap ? (
        <StationsList stringMap={matchesStringMap} searchTerm={text} />
      ) : (
        <NotFound />
      )}
    </Box>
  );
};

render(<App />);
