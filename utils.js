function getRandomElementsFromArray(array, count) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray.slice(0, count);
}

function convertExcel(excelFile) {
  const XLSX = require("xlsx");
  const workbook = XLSX.readFile(`./${excelFile}.csv`);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const column = data[0];
  return data.slice(1).map((item) => {
    const obj = {};
    column.forEach((x, index) => {
      obj[x] = item[index];
    });
    return obj;
  });
}

function getRandomPort(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


module.exports = { getRandomElementsFromArray, convertExcel, getRandomPort, waitFor };
