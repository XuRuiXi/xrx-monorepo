import React from 'react';
import renderer from "react-test-renderer";
import HKTable from "../src/HKTable";

describe("HKTable", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<HKTable />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
