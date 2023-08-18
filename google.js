const config = require("./config.js");
const {
  convertExcel,
  getDriver,
  getElement,
  getElements,
  convertArrayToExcel,
  executeDriver,
} = require("./utils.js");

const onLoginGoogle = async (profile, item) => {
  const driver = getDriver(profile);
  try {
    driver.get(config.googleURL);
    const usernameElement = await getElement(driver, "//input[@type='email']");
    usernameElement.sendKeys(item.Mail);

    const nextBtn = await getElement(driver, "//div[@id='identifierNext']");
    driver.executeScript("arguments[0].click();", nextBtn);

    const passElement = await getElement(driver, "//input[@type='password']");
    passElement.sendKeys(item.PassMail);

    const loginBtn = await getElement(driver, "//div[@id='passwordNext']");
    driver.executeScript("arguments[0].click();", loginBtn);
  } catch (error) {
  } finally {
    return { ...driver };
  }
};

const main = async () => {
  const excelData = convertExcel("excel");
  let i = 0;
  while (i <= excelData.length) {
    await executeDriver(this, excelData, i, onLoginGoogle);
    i += config.groupChrome;
  }
  //   convertArrayToExcel(excelData);
};

main();
