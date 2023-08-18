const { Builder, By, until, Capabilities } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("./config.js");
const XLSX = require("xlsx");

function getRandomElementsFromArray(array, count) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray.slice(0, count);
}

function convertExcel(excelFile) {
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

function getDriver(profile) {
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
  excelData.slice(i, i + config.groupChrome).forEach(async (item) => {
    const profile = `${config.profile}\\${item.STT}\\Data\\profile`;
    await promiseAll.push(func.bind(that, profile, item));
  });
  drivers = await Promise.all(promiseAll.map((x) => x()));
  waitFor(4000);
  drivers.forEach(async (x) => {
    await x.close();
  });
  waitFor(4000);
  console.log(drivers);
}

async function waitForPageToDisplay(driver, timeout = 10000) {
  try {
    const allElementsSelector = "body *"; // Replace with a more specific selector if needed

    await driver.wait(
      until.elementLocated(By.css(allElementsSelector)),
      timeout
    );
    await driver.wait(
      until.elementIsVisible(driver.findElement(By.css(allElementsSelector))),
      timeout
    );
  } catch (error) {
    console.error("Error waiting for page to display:", error);
  }
}
async function openDcom() {
  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments("user-data-dir=" + config.dcomProfile);
  const driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();
  try {
    driver.get(config.dcomURL);
    return driver;
  } catch (error) {
    return;
  } finally {
    return { ...driver };
  }
}

async function getBtnDcom(driver) {
  const btnElementId = "//button[@id='home_connect_btn']";
  await driver.wait(until.elementLocated(By.xpath(btnElementId)), 10000);
  return await driver.findElement(By.xpath(btnElementId));
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
  waitForPageToDisplay,
  getBtnDcom,
  openDcom,
};
