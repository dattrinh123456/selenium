const config = require("./config.js");
const {
  convertExcel,
  getDriver,
  getElement,
  getElements,
  convertArrayToExcel,
  executeDriver,
} = require("./utils.js");

const onHandleActionMetamask = async (profile, item) => {
  const driver = getDriver(profile);
  try {
    driver.get(config.metamaskURL);
    const checkboxElement = await getElement(
      driver,
      "//input[@id='onboarding__terms-checkbox']"
    );
    driver.executeScript("arguments[0].click();", checkboxElement);

    const createBtn = await getElement(
      driver,
      "//button[@data-testid='onboarding-create-wallet']"
    );
    driver.executeScript("arguments[0].click();", createBtn);

    const agreeBtn = await getElement(
      driver,
      "//button[@data-testid='metametrics-i-agree']"
    );
    driver.executeScript("arguments[0].click();", agreeBtn);

    const password = await getElement(
      driver,
      "//input[@data-testid='create-password-new']"
    );
    password.sendKeys(config.password);

    const confirmPassword = await getElement(
      driver,
      "//input[@data-testid='create-password-confirm']"
    );
    confirmPassword.sendKeys(config.password);

    const passwordCheckbox = await getElement(
      driver,
      "//input[@data-testid='create-password-terms']"
    );
    driver.executeScript("arguments[0].click();", passwordCheckbox);

    const createWalletBtn = await getElement(
      driver,
      "//button[@data-testid='create-password-wallet']"
    );
    driver.executeScript("arguments[0].click();", createWalletBtn);

    const remindLaterBtn = await getElement(
      driver,
      "//button[@data-testid='secure-wallet-later']"
    );
    driver.executeScript("arguments[0].click();", remindLaterBtn);

    const skipSecurityCheckbox = await getElement(
      driver,
      "//input[@data-testid='skip-srp-backup-popover-checkbox']"
    );
    driver.executeScript("arguments[0].click();", skipSecurityCheckbox);

    const skipBtn = await getElement(
      driver,
      "//button[@data-testid='skip-srp-backup']"
    );
    driver.executeScript("arguments[0].click();", skipBtn);

    const gotItBtn = await getElement(
      driver,
      "//button[@data-testid='onboarding-complete-done']"
    );
    driver.executeScript("arguments[0].click();", gotItBtn);

    const nextBtn = await getElement(
      driver,
      "//button[@data-testid='pin-extension-next']"
    );
    driver.executeScript("arguments[0].click();", nextBtn);

    const doneBtn = await getElement(
      driver,
      "//button[@data-testid='pin-extension-done']"
    );
    driver.executeScript("arguments[0].click();", doneBtn);

    const closeDialogBtn = await getElement(
      driver,
      "//button[@data-testid='popover-close']"
    );
    driver.executeScript("arguments[0].click();", closeDialogBtn);

    const dropdownBtn = await getElement(
      driver,
      "//button[@data-testid='account-options-menu-button']"
    );
    driver.executeScript("arguments[0].click();", dropdownBtn);

    const accountDetailBtn = await getElement(
      driver,
      "//button[@data-testid='account-list-menu-details']"
    );
    driver.executeScript("arguments[0].click();", accountDetailBtn);

    const addressBtn = await getElements(
      driver,
      "//button[@data-testid='address-copy-button-text']"
    );
    item.metamaskURL = await addressBtn[1].getText();
  } catch (error) {
  } finally {
    return { ...driver };
  }
};

const main = async () => {
  const excelData = convertExcel("excel");
  let i = 0;
  while (i <= excelData.length) {
    await executeDriver(this, excelData, i, onHandleActionMetamask);
    i += config.groupChrome;
  }
  convertArrayToExcel(excelData);
};

main();
