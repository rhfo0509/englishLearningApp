const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const {
  convertExcelToJSON,
  uploadJSONToFirebase,
} = require("./src/services/excel.service");

const upload = multer({ storage: multer.memoryStorage() });

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/upload-excel", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const { version, category, chapter } = req.body;

  try {
    const json = convertExcelToJSON(req.file.buffer, version, category);
    await uploadJSONToFirebase(json);
    console.log("Successfully converted the Excel file to JSON.");
    res.send("ok");
  } catch (error) {
    console.error("An error occurred during the conversion.", error);
    res.status(500).send("An error occurred during the conversion");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
