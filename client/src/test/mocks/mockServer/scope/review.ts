import scope from ".";

const interceptGetReviews = () => {
  scope.get("/reviews/1?limit=5&offset=0").reply(200, []);
};

export { interceptGetReviews };
