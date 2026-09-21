import path from "node:path";
import fs from "node:fs/promises";
import fsp from "node:fs";
import Busboy from "busboy";
const __dirname = import.meta.dirname;
const storagePath = path.join(__dirname, "..", "..", "storage", "files");
const files = await fs.readdir(storagePath);
console.log("the files are : ", files);
export async function fileInfo(searchParams) {
  let fileInfo = [];
  for (let file of files) {
    try {
      let fileState = await fs.stat(path.join(storagePath, file));
      let mime = path.extname(path.join(storagePath, file));
      let eligibale = true;
      if (Object.keys(searchParams).length > 0) {
        for (let prop in searchParams) {
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
  try {
    if (!searchParams.name) {
      throw new Error("no file is selected to delete");
    }
    const filePath = path.join(storagePath, searchParams.name);
    console.log("before delteing a file");
    await fs.unlink(filePath);
    console.log("file is delted sucessfully");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}
export async function downlaodFile(searchParams) {
  console.log("entered the function");
  console.log(searchParams.name);
  const mimeTypes = {
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  let fileExists = await fileInfo(searchParams);
  if (!fileExists) {
    console.log("the file does not exist");
    return { success: false, message: "file does not exist", statusCode: 404 };
  }
  console.log("the file exists here");
  try {
    const readFile = await fs.readFile(
      path.join(storagePath, searchParams.name),
    );
    console.log("file is readed successfully");
    const extension = path.extname(path.join(storagePath, searchParams.name));
    console.log(extension.length);
    return {
      success: true,
      message: readFile,
      statusCode: 200,
      contentType: mimeTypes[extension],
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "sth bad happened while reading the file",
      statusCode: 500,
    };
  }
}
export function fileUpload(req) {
  const busboy = Busboy({
    headers: req.headers,
  });

  return new Promise((resolve, reject) => {
    busboy.on("file", (fieldname, file, info) => {
      const { filename, mimeType } = info;

      const writeStream = fsp.createWriteStream(
        path.join(storagePath, filename)
      );

      writeStream.on("finish", () => {
        console.log("File Uploading is Successful");

        resolve({
          success: true,
          message: "File is uploaded successfully",
        });
      });

      writeStream.on("error", (error) => {
        console.log(error);

        reject({
          success: false,
          message: "Unable to write the uploaded file",
        });
      });

      // The actual uploaded file → destination file
      file.pipe(writeStream);
    });

    busboy.on("error", (error) => {
      console.log(error);

      reject({
        success: false,
        message: "Unable to read the uploaded file",
      });
    });

    // HTTP request → Busboy
    req.pipe(busboy);
  });
}
