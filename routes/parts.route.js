const express = require("express");
const { google } = require("googleapis");
require('dotenv').config(); // Load environment variables from .env file

const router = express.Router();

router.get("/getpart/:id", async (req, res) => {
  const partCode = +req.params.id;

  if (!partCode)
    return res.status(404).json({ success: false, message: "Enter a valid part code" });

  const sheetId = process.env.SHEET_ID; // Use environment variable for the sheet ID
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS); // Parse the JSON string from the environment variable

  const seriesMapping = {
    1: "SERIES-1",
    2: "SERIES-2",
    3: "SERIES-3",
    4: "SERIES-4",
    5: "SERIES-5",
    6: "SERIES-6",
    7: "SERIES-7",
    8: "SERIES-8",
    9: "SERIES-9",
    // Add more mappings as needed
  };

  const firstCharacter = partCode.toString().charAt(0);
  const sheetName = seriesMapping[firstCharacter] || "DefaultSheet"; // Use 'DefaultSheet' as a fallback

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetName,
    });

    const rows = response.data.values;

    // Assuming the PARTCODE is in the second column (index 1)
    const matchingRow = rows.find((row) => row[1] === partCode.toString());

    if (matchingRow) {
      const partInfo = {
        srNumber: matchingRow[0],
        partCode: matchingRow[1],
        subPart: matchingRow[2],
        nameDesc: matchingRow[3],
        sample: matchingRow[4],
        Photos: matchingRow[5],
        drawing: matchingRow[6],
        stock: matchingRow[7],
        location: matchingRow[8],
        remark: matchingRow[9],
        // Add more fields as needed
        imageLink: matchingRow[10],
      };

      return res.status(200).json({ success: true, partInfo });
    } else {
      return res.status(404).json({ success: false, message:`${partCode} not found`}); // Part not found
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message }); // Part not found
  }
});

module.exports = router;
