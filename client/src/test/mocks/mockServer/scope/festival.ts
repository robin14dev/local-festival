import scope from ".";
import { mockSummary } from "../../mockData";

const interceptGetFestivalItems = () => {
  scope.get("/festivals").reply(200, []);
};

const interceptGetFestivalDetail = () => {
  scope.get("/festivals/1?userId=0").reply(200, { data: mockSummary });
};

const interceptGetFestivalItemsError = () => {};

export { interceptGetFestivalItems, interceptGetFestivalDetail };
