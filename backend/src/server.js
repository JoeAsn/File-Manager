import http from "node:http";
import {router} from "./router.js"
const server = http.createServer((req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "Content-Type");
  router(req , res)
});
server.listen(5200, () => console.log("the server is created sucessfully"));
