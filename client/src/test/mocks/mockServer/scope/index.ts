import nock from "nock";

const api = process.env.REACT_APP_SERVER_URL || "no api url";
const scope = nock(api);

export default scope;
