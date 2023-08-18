const config = require("./config.js");

const {
  convertExcel,
  getDriver,
  convertArrayToExcel,
  executeDriver,
  waitFor,
  waitForPageToDisplay,
  getElement,
} = require("./utils.js");

const onHandleActionDiscord = async (profile, item) => {
  const driver = getDriver(profile);
  try {
    await driver.get(config.discordURL);
    await waitForPageToDisplay(driver);
    await waitFor(5000);
    var token = item.TokenDiscord;
    await driver.executeScript(
      'function login(e){setInterval(()=>{document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token=`"${e}"`},50),setTimeout(()=>{location.reload()},2500)}login("' +
        token +
        '");'
    );
    await waitFor(2000);
    const username = await getElement(
      driver,
      "//div[@data-text-variant='text-xs/normal']"
    );
    item["discordUsername"] = await username.getText();
    waitFor(1000);
  } catch (error) {
  } finally {
    return { ...driver };
  }
};

const main = async function () {
  const excelData = convertExcel("excel");
  let i = 0;
  const driverDcom = await openDcom();
  const btn = await getBtnDcom(driverDcom);
  while (i <= excelData.length) {
    driverDcom.executeScript("arguments[0].click();", btn);
    await waitFor(10000);
    await executeDriver(this, excelData, i, onHandleActionDiscord);
    i += config.groupChrome;
    driverDcom.executeScript("arguments[0].click();", btn);
    waitFor(10000);
  }
  convertArrayToExcel(excelData);
};

main();
