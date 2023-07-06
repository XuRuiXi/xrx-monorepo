import React from 'react';
import renderer from "react-test-renderer";
import Title from "../components/Title";

describe("Tabs", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<Title title="我是标题" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
