import {listFile} from "./controller/fileController.js"
export function router(req ,res) {
    let url = new URL(req.url , `http://${req.headers.host}`) ;
    let searchParams = Object.fromEntries(url.searchParams)
    if(req.method === "GET" && url.pathname === "/files"){
        listFile(req ,res, searchParams)
    }
    if(req.method === "POST" && url.pathname === "/files"){
    }
    if(req.method === "DELETE" && url.pathname[0] === "files" && url.pathname[1]){

    }
}