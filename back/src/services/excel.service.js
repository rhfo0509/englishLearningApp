const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const bucket = require("../config/firebaseAdmin");

const { LANGUAGES } = require("../common/constants");

function convertExcelToJSON(buffer, version, category, chapter) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[category];
  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const basePath = "/data/user/0/com.englishlearningapp/files/learning";

  let json = {
    version,
    category: +category,
    chapter: +chapter,
    data: [],
  };

  json.data = data.slice(1).map((row) => {
    let entry = {
      num: row[2],
      image: `${basePath}/${category}/${chapter}/images/${row[3]}.jpg`,
      sounds: Array.from(
        { length: 5 },
        (_, i) => `${basePath}/${category}/${chapter}/sounds/${row[4]}_${i}.mp3`
      ),
    };
    for (const [lang, i] of Object.entries(LANGUAGES)) {
      entry[lang] = row[i];
    }

    return entry;
  });
  return json;
}

async function uploadJSONToFirebase(json) {
  const { category, chapter } = json;
  const fileName = `${category}_${chapter}.json`;
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

  try {
    await bucket.upload(filePath, {
      destination: `learning/${category}/${chapter}/${fileName}`,
      metadata: { contentType: "application/json" },
    });
    console.log("JSON file saved to Firebase Storage");
  } catch (error) {
    console.error("Failed to upload JSON file to Firebase Storage", error);
  } finally {
    fs.unlinkSync(filePath);
  }
}

module.exports = { convertExcelToJSON, uploadJSONToFirebase };
