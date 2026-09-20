import http from "node:http";
import {router} from "./router.js"
const server = http.createServer((req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-headers", "Content-Type");
  res.setHeader("access-control-allow-methods" , 'GET,DELETE,POST,OPTIONS')
  router(req , res) ;
  console.log("the request is" , req.method)
});
server.listen(5200, () => console.log("the server is created sucessfully"));
