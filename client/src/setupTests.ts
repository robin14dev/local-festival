// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import nock from "nock";
import axios from "axios";

axios.defaults.adapter = "http";
// global.fetch = require("node-fetch"); // ! 이걸 해줘야함
beforeAll(() => {});
afterEach(() => {
  // nock.restore();
});
afterAll(() => {
  nock.cleanAll();
  nock.restore();
});
