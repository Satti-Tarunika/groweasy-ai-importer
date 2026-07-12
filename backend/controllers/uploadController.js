const fs = require("fs");
const Papa = require("papaparse");
const { getFieldMapping } = require("../utils/gemini");

const uploadCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No CSV uploaded"
            });
        }

        // Read CSV
        const csv = fs.readFileSync(req.file.path, "utf8");

        const parsed = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
        });

        const rows = parsed.data;

        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "CSV is empty"
            });
        }

        // Get headers
        const headers = Object.keys(rows[0]);

        // Ask Gemini to map headers
        const mapping = await getFieldMapping(headers);

        // Convert rows using AI mapping
        const mappedData = rows.map((row) => {
            const obj = {};

            for (const originalHeader in mapping) {
                const standardField = mapping[originalHeader];
                obj[standardField] = row[originalHeader];
            }

            return obj;
        });

        res.json({
            success: true,
            totalRows: mappedData.length,
            mapping,
            preview: mappedData
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    uploadCSV
};