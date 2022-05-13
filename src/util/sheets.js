/**
 * 
 * Utility functions to interact with Google Sheets.
 * 
 * @author Nausher Rao
 * @see https://github.com/WinHacks/2022-bot/blob/main/src/helpers/sheetsAPI.ts
 * 
 */
const SHEETS_ID = "18l2IrquSjLyyu0LqOt_s92J-B3Nj4vpPRMqa-7CLgxI";

const process = require("node:process");
const { google } = require("googleapis");
const sheets = google.sheets({
    version: "v4",
    auth: process.env.GOOGLE_SHEETS_API_KEY
}).spreadsheets;

/**
 * 
 * @param {string} sheet 
 * @param {string} startCell 
 * @param {string} endCell 
 * @returns 
 */
const buildRange = (startCell, endCell, sheet = SHEETS_ID) => (`${sheet}!${startCell}:${endCell}`);


/**
 * Gets data from `target`
 * @param {string} targetId the ID of the sheet to read from
 * @param {string} range the range of cells to read
 * @param {String} major the major dimension. When ROWS, the data is returned as an array of rows (cols => array of cols)
 * @returns a response from the Sheets API containing the data
 */
const getRange = async (targetId = SHEETS_ID, range, major = "ROWS") =>
    sheets.values.get({
        spreadsheetId: targetId,
        range: range,
        majorDimension: major,
    });


/**
 * Returns the data in a single column of `targetSheet` on page `sheetNumber` in column-major form
 * @param {string} target the ID of the sheet to read data from
 * @param {string} col a single letter, identifying the column read from
 * @param {string} targetSheet an optional number, specifying the page number of the `target` to read from
 * @returns {Promise<string[]>} a string array of the data in column `col` of `target`'s page `page`
 */
const getColumn = async (col, targetId = SHEETS_ID, targetSheet = "Final Decisions (No Duplicates)") => {
    const range = buildRange(col, col, targetSheet);
    const response = await getRange(targetId, range, "COLUMNS");

    return (response.data.values ? response.data.values[0] : []);
};


/**
 * Returns the data in a single row of `target` on page `page` in row-major form
 * @param {string} targetId the ID of the sheet to read data from
 * @param {number | string} row a single number, identifying the row to get data from. First row is `1`.
 * @param {string} page an optional number, specifying the page number of the `target` to read from
 * @returns {Promise<string[]>} a string array of the data in row `row` of `target`'s page `page`
 */
const getRow = async (row, targetId = SHEETS_ID, targetSheet = "Final Decisions (No Duplicates)") => {
    const range = buildRange(`${row}`, `${row}`, targetSheet);
    const response = await getRange(targetId, range, "ROWS");

    return (response.data.values ? response.data.values[0] : []);
};


/**
 * 
 * @param {string} targetId 
 * @param {string} targetSheet 
 * @param {number | string} row a single number, identifying the row to get data from. First row is `1`.
 * @returns {Promise<CardInfoType>}
 */
const getUserData = async (targetId, targetSheet, row) => {
    const rowData = await getRow(row, targetId, targetSheet);
    return {
        authorizedCard: rowData[15] === "TRUE",
        firstName: rowData[0],
        lastName: rowData[1],
        pronouns: rowData[6],
        github: rowData[11],
        linkedIn: rowData[10],
        website: rowData[12],
        resume: rowData[13],
        studyArea: rowData[7],
        studyLocation: rowData[4],
        phone: rowData[2],
        email: rowData[3],
    };
};

module.exports = { buildRange, getRange, getColumn, getRow, getUserData };