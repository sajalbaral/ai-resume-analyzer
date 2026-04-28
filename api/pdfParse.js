import formidable from "formidable";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const PDFParser = require("pdf2json");

export default async function pdfParser(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);
    const file = files.file[0];

    const text = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      pdfParser.on("pdfParser_dataReady", (data) => {
        const text = data.Pages.flatMap((page) =>
          page.Texts.map((t) => decodeURIComponent(t.R[0].T)),
        ).join(" ");
        resolve(text);
      });
      pdfParser.on("pdfParser_dataError", reject);
      pdfParser.loadPDF(file.filepath);
    });

    return res.status(200).json({ text });
  } catch (err) {
    console.log("Error in PDF parsing API route:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
