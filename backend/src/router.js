import {listFile , DeleteFile , download} from "./controller/fileController.js"
export function router(req ,res) {
    let url = new URL(req.url , `http://${req.headers.host}`) ;
    console.log(url.pathname)
    let searchParams = Object.fromEntries(url.searchParams)
    if(req.method === "GET" && url.pathname === "/files"){
        listFile(req ,res, searchParams)
    }
    if(req.method === "POST" && url.pathname === "/files"){
    }
    if(req.method === "DELETE" && url.pathname === "/files"){
        console.log("req is entering the delete router")
        DeleteFile(req ,res , searchParams)
    }
    if (req.method === "GET" , url.pathname === "/files/download"){
        download(req ,res, searchParams)
        console.log("gets the download router")
    }
    if (req.method === "OPTIONS") {
    res.statusCode = 204; // No Content
    res.end();
    return;
  }
}