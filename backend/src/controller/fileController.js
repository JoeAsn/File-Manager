import { fileDelete, downlaodFile, fileInfo , fileUpload } from "../service/fileService.js";
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
  console.log("enters the controller");
  res.setHeader("content-type", "application/json");
  try {
    const status = await fileDelete(searchParams);
    console.log(status);
    if (!status.success) {
      throw new Error("sth unexprected happened");
    }
    res.statusCode = 201;
    res.end(JSON.stringify({ message: `deleted ${searchParams.name}` }));
  } catch (error) {
    console.log(error);
    res.statusCode = 404;
    res.end(
      JSON.stringify({ message: `unable to delete the ${searchParams.name}` }),
    );
  }
}
export async function download(req, res, searchParams) {
  try {
    let downlaodRes = await downlaodFile(searchParams);
    if (downlaodRes.success) {
      console.log(downlaodRes.contentType);
      res.statusCode = downlaodRes.statusCode;
      res.setHeader("content-type", downlaodRes.contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${searchParams.name}"`,
      );
      res.end(downlaodRes.message);
    } else {
      res.statusCode = downlaodRes.statusCode;
      res.end(downlaodRes.message);
    }
  } catch (error) {
    console.log(error);
    res.end(JSON.stringify({ message: "Error happened" }));
  }
}
export async function uploadFile(req ,res){
  let uploadResponse = await fileUpload(req) ;
  if (uploadResponse.success === true){
    res.end(JSON.stringify({message : uploadResponse.message}))
  }
  else{
    res.end(JSON.stringify({message : uploadResponse.message}))
  }
}
