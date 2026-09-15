import { fileInfo } from "../service/fileService.js";
export async function listFile(req, res, searchParams) {
  res.setHeader("content-type", "application/json");
  try {
    const files = await fileInfo(req, res, searchParams);
    res.statusCode = 200;
    res.end(JSON.stringify(files));
  } catch (error) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({ message: "cannot find the files from the server" }),
    );
  }
}
