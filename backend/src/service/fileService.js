import path from "node:path";
import fs from "node:fs/promises";
const __dirname = import.meta.dirname;
const storagePath = path.join(__dirname, "..", "..", "storage", "files");
const files = await fs.readdir(storagePath);
export async function fileInfo(searchParams) {
  let fileInfo = [];
  for (let file of files) {
    try {
      let fileState = await fs.stat(path.join(storagePath, file));
      let mime = path.extname(path.join(storagePath, file));
      let eligibale = true;
      if (Object.keys(searchParams).length > 0) {
        for (let prop in searchParams) {
          console.log(searchParams[prop]);
          console.log(file);
          eligibale = file === searchParams[prop];
        }
      }
      eligibale &&
        fileInfo.push({
          id: file,
          name: file,
          size: `${fileState.size / 2 ** 10} KB`,
          mimeType: mime.slice(1),
          createdAt: fileState.birthtime.toISOString(),
        });
    } catch (error) {
      console.log(error);
    }
  }
  return fileInfo;
}
export async function fileDelete(searchParams) {
  try{
    if(!searchParams.name) {
      throw new Error("no file is selected to delete") ;
    }
    const filePath = path.join(storagePath , searchParams.name ) ;
    await fs.unlink(filePath) ;
    return {success : true }
  }
  catch(error){
    console.log(error)
    return {success : false}
  }
}
