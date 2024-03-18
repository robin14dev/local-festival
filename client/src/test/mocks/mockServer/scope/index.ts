import nock from "nock";

const api = process.env.REACT_APP_SERVER_URL || "no api url";
console.log(process.env.REACT_APP_SERVER_URL)
console.log(api);

const scope = nock(api);

export default scope;
