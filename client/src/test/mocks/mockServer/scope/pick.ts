import scope from ".";

const interceptGetPickItems = () => {
  scope.get("/pick").reply(200, []);
};

const interceptAddPickItem = () => {
  scope.post("/pick", { festivalId: 1 }).reply(201);
};

const interceptDeletePickItem = () => {
  scope.delete("/pick", { festivalId: 1 }).reply(204);
};

const interceptError = () => {};

export { interceptAddPickItem, interceptGetPickItems, interceptDeletePickItem };
