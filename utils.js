const { Builder, By, until, Capabilities } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("./config.js");

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
  const excelData = data.slice(1).map((item) => {
    const obj = {};
    column.forEach((x, index) => {
      obj[x] = item[index];
    });
    return obj;
  });
  return config.isRunAllExcel
    ? excelData
    : excelData.slice(config.startExcelIndex, config.EndExcelIndex);
}

function convertArrayToExcel(dataArray) {
  const worksheet = XLSX.utils.json_to_sheet(dataArray);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, config.outputExcelName);
}

function getRandomPort(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getDriver(profile) {
  const chromeCapabilities = Capabilities.chrome();
  chromeCapabilities.set("chromeOptions");

  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments([
    "user-data-dir=" + profile,
    `--remote-debugging-port=${getRandomPort(8000, 9000)}`,
  ]);

  return new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .withCapabilities(chromeCapabilities)
    .build();
}

async function getElement(driver, idElement) {
  await driver.wait(until.elementLocated(By.xpath(idElement)), 10000);
  return await driver.findElement(By.xpath(idElement));
}

async function getElements(driver, idElement) {
  await driver.wait(until.elementLocated(By.xpath(idElement)), 10000);
  return await driver.findElements(By.xpath(idElement));
}

async function executeDriver(that, excelData, i, func) {
  let drivers = [];
  const promiseAll = [];
  excelData.slice(i, i + config.groupChrome).forEach((item) => {
    const profile = `${config.profile}\\${item.STT}\\Data\\profile`;
    promiseAll.push(func.bind(that, profile, item));
  });
  drivers = await Promise.all(promiseAll.map((x) => x()));
  waitFor(1000);
  drivers.forEach(async (x) => {
    await x.close();
  });
  waitFor(1000);
  console.log(drivers);
}

module.exports = {
  getRandomElementsFromArray,
  convertExcel,
  getRandomPort,
  waitFor,
  getDriver,
  getElement,
  getElements,
  convertArrayToExcel,
  executeDriver,
};
