import {listFile , DeleteFile} from "./controller/fileController.js"
export function router(req ,res) {
    console.log("DELETE" === req.method);
    console.log(req.method)
    let url = new URL(req.url , `http://${req.headers.host}`) ;
    let searchParams = Object.fromEntries(url.searchParams)
    if(req.method === "GET" && url.pathname === "/files"){
        listFile(req ,res, searchParams)
    }
    if(req.method === "POST" && url.pathname === "/files"){
    }
    if(req.method === "DELETE" && url.pathname === "/files"){
        console.log("the method is delete")
        DeleteFile(req ,res , searchParams)
    }
}