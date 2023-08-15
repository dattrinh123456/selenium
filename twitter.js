const { Builder, By, until, Capabilities } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("./config.js");
const {
  getRandomElementsFromArray,
  convertExcel,
  waitFor,
  getDriver,
  executeDriver,
} = require("./utils.js");

const loginTwitter = async (profile, username, password, comment, metamask) => {
  const driver = getDriver(profile);

  try {
    await driver.get(config.loginUrl);
    await waitFor(2000);
    await driver.wait(
      until.elementLocated(By.xpath("//input[@autocomplete='username']")),
      10000
    );
    const usernameElement = await driver.findElement(
      By.xpath("//input[@autocomplete='username']")
    );
    usernameElement.click();
    await usernameElement.sendKeys(username);
    const nextBtn = await driver.executeScript(
      "return document.querySelectorAll('[role=\"button\"]')"
    );
    nextBtn[3].click();
    await waitFor(2000);

    const isCheckNickname = await isElementPresent(
      driver,
      By.xpath("//div[@name='text']")
    );
    if (isCheckNickname) {
      const nickname = await driver.findElement(
        By.xpath("//div[@name='text']")
      );
      nickname.click();
      await nickname.sendKeys("@" + username);
      const nextBtn = await driver.executeScript(
        "return document.querySelectorAll('[role=\"button\"]')"
      );
      nextBtn[3].click();
      await waitFor(2000);
    }

    await driver.wait(
      until.elementLocated(
        By.xpath("//input[@autocomplete='current-password']")
      ),
      10000
    );
    const passwordelement = await driver.findElement(
      By.xpath("//input[@autocomplete='current-password']")
    );
    passwordelement.click();
    await passwordelement.sendKeys(password);
    await waitFor(2000);

    const loginBtn = await driver.executeScript(
      "return document.querySelectorAll('[role=\"button\"]')"
    );
    loginBtn[3].click();
    await waitFor(2000);
  } catch (error) {
  } finally {
    return { ...driver };
  }
};

const onHandleActionTwitter = async (profile, comment, metamask) => {
  const driver = getDriver(profile);

  try {
    const twitterIdurl = config.twitterURL + config.twitterID;
    driver.get(twitterIdurl);
    if (config.isLike) {
      await likeTwitter(driver);
    }
    if (config.isRetweet) {
      await retweetTW(driver);
    }
    if (config.isReply) {
      await replyTW(driver, comment, metamask);
    }
  } catch (error) {
  } finally {
    return { ...driver };
  }
};

const likeTwitter = async (driver) => {
  try {
    const idElement = "//div[@aria-label='Like']";
    await driver.wait(until.elementLocated(By.xpath(idElement)), 10000);
    const likeBtnEle = await driver.findElement(By.xpath(idElement));
    driver.executeScript("arguments[0].click();", likeBtnEle);
  } catch (error) {
    return;
  }
};

const retweetTW = async (driver) => {
  try {
    const iconIdElement = "//div[@aria-label='Retweet']";
    await driver.wait(until.elementLocated(By.xpath(iconIdElement)), 10000);
    const retweetIcon = await driver.findElement(By.xpath(iconIdElement));
    driver.executeScript("arguments[0].click();", retweetIcon);

    const retweetElement = "//div[@data-testid='retweetConfirm']";
    await driver.wait(until.elementLocated(By.xpath(retweetElement)), 10000);
    const retweetBtn = await driver.findElement(By.xpath(retweetElement));
    driver.executeScript("arguments[0].click();", retweetBtn);
  } catch (error) {
    return;
  }
};

const replyTW = async (driver, comment, metamask) => {
  const twitterUsers = excelData.map((x) => "@" + x.Twitter);
  const textEditorElementId = "//div[@aria-label='Tweet text']";
  await driver.wait(until.elementLocated(By.xpath(textEditorElementId)), 10000);
  const textEditorElement = await driver.findElement(
    By.xpath(textEditorElementId)
  );
  driver.executeScript("arguments[0].click();", textEditorElement);
  const newComment = config.isCustomComment ? metamask : comment;
  textEditorElement.sendKeys(
    newComment + getRandomElementsFromArray(twitterUsers, 3).join(" ")
  );

  const replyElementBtn = "//div[@data-testid='tweetButtonInline']";
  await driver.wait(until.elementLocated(By.xpath(replyElementBtn)), 10000);
  const replyBtn = await driver.findElement(By.xpath(replyElementBtn));
  driver.executeScript("arguments[0].click();", replyBtn);
};

const openDcom = async () => {
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
};

const getBtnDcom = async (driver) => {
  const btnElementId = "//button[@id='home_connect_btn']";
  await driver.wait(until.elementLocated(By.xpath(btnElementId)), 10000);
  return await driver.findElement(By.xpath(btnElementId));
};

const main = async () => {
  const excelData = convertExcel("excel");
  let i = 0;
  const waitingTime = 10000;
  const driverDcom = await openDcom();
  const btn = await getBtnDcom(driverDcom);
  while (i <= excelData.length) {
    driverDcom.executeScript("arguments[0].click();", btn);
    await waitFor(waitingTime);
    drivers = await executeDriver(this, excelData, i, onHandleActionTwitter);
    i += config.groupChrome;
    driverDcom.executeScript("arguments[0].click();", btn);
    waitFor(waitingTime);
  }
};

main();
