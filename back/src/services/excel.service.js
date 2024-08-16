const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const bucket = require("../config/firebaseAdmin");

const { LANGUAGES } = require("../common/constants");

// type = 0 : category / type = 1 : chapter / type = 2 : data
function convertExcelToJSON(buffer, type, version, category) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[+type];
  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const basePath = "/data/user/0/com.englishlearningapp/files";

  if (type == 2) {
    let json = {
      version,
      category: +category,
      data: data
        .slice(1)
        .filter((row) => row[1] === +category)
        .map((row) => {
          let entry = {
            tnum: row[0],
            chapter: row[2],
            num: row[3],
            image: row[4]
              ? `${basePath}/learning/${category}/images/${row[4]}.jpg`
              : "",
            sounds: row[5]
              ? Array.from(
                  { length: 5 },
                  (_, i) =>
                    `${basePath}/learning/${category}/sounds/${row[5]}_${i}.mp3`
                )
              : [],
          };
          for (const [lang, i] of Object.entries(LANGUAGES)) {
            entry[lang] = row[i];
          }
          return entry;
        }),
    };
    return { json, type };
  } else {
    const headers = data[0];
    const json = {
      version,
      data: data.slice(1).map((row) => {
        let entry = {};
        headers.forEach((header, index) => {
          entry[header] = row[index];
        });
        return entry;
      }),
    };
    return { json, type };
  }
}

async function uploadJSONToFirebase(json, type) {
  const fileName = type == 2 ? `${json.category}.json` : "data.json";
  const destination =
    type == 0 ? "" : type == 1 ? "learning/" : `learning/${json.category}/`;
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

  try {
    await bucket.upload(filePath, {
      destination: `${destination}${fileName}`,
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
