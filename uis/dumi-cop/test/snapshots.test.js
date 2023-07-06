import React from 'react';
import renderer from "react-test-renderer";
import Title from "../src/Title";

describe("Tabs", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<Title title="我是标题new" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
