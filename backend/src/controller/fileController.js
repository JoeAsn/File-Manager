import { fileInfo } from "../service/fileService.js";
import { fileDelete } from "../service/fileService.js";
export async function listFile(req, res, searchParams) {
  res.setHeader("content-type", "application/json");
  try {
    const files = await fileInfo(searchParams);
    res.statusCode = 200;
    res.end(JSON.stringify(files));
  } catch (error) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({ message: "cannot find the files from the server" }),
    );
  }
}
export async function DeleteFile(req, res, searchParams) {
  res.setHeader("content-type", "application/json");
  try {
    const status = await fileDelete(searchParams)
    console.log(status)
    if(!(status.success)){
      throw new Error("sth unexprected happened")
    }
    res.statusCode = 201 ;
    res.end(JSON.stringify({message :  `deleted ${searchParams.name}` }))
  } catch (error) {
    console.log(error);
    res.statusCode = 404;
    res.end(
      JSON.stringify({ message: `unable to delete the ${searchParams.name}` }),
    );
  }
}
