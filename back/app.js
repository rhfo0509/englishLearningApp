const express = require("express");
const path = require("path");
const multer = require("multer");

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
  const { type, version, category } = req.body;

  try {
    const result = convertExcelToJSON(req.file.buffer, type, version, category);
    await uploadJSONToFirebase(result.json, result.type);
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
