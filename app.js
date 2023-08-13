const { Builder, By, until, Capabilities } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("./config.js");
const {
  getRandomElementsFromArray,
  convertExcel,
  getRandomPort,
} = require("./utils.js");

async function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const loginTwitter = async (profile, username, password) => {
  const chromeCapabilities = Capabilities.chrome();
  chromeCapabilities.set("chromeOptions");

  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments([
    "user-data-dir=" + profile,
    `--remote-debugging-port=${getRandomPort(8000, 9000)}`,
  ]);

  const driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .withCapabilities(chromeCapabilities)
    .build();

  try {
    // await driver.get(config.loginUrl);
    // await waitFor(2000);
    // await driver.wait(
    //   until.elementLocated(By.xpath("//input[@autocomplete='username']")),
    //   10000
    // );
    // const usernameElement = await driver.findElement(
    //   By.xpath("//input[@autocomplete='username']")
    // );
    // usernameElement.click();
    // await usernameElement.sendKeys(username);
    // const nextBtn = await driver.executeScript(
    //   "return document.querySelectorAll('[role=\"button\"]')"
    // );
    // nextBtn[3].click();
    // await waitFor(2000);

    // const isCheckNickname = await isElementPresent(
    //   driver,
    //   By.xpath("//div[@name='text']")
    // );
    // if (isCheckNickname) {
    //   const nickname = await driver.findElement(
    //     By.xpath("//div[@name='text']")
    //   );
    //   nickname.click();
    //   await nickname.sendKeys("@" + username);
    //   const nextBtn = await driver.executeScript(
    //     "return document.querySelectorAll('[role=\"button\"]')"
    //   );
    //   nextBtn[3].click();
    //   await waitFor(2000);
    // }

    // await driver.wait(
    //   until.elementLocated(
    //     By.xpath("//input[@autocomplete='current-password']")
    //   ),
    //   10000
    // );
    // const passwordelement = await driver.findElement(
    //   By.xpath("//input[@autocomplete='current-password']")
    // );
    // passwordelement.click();
    // await passwordelement.sendKeys(password);
    // await waitFor(2000);

    // const loginBtn = await driver.executeScript(
    //   "return document.querySelectorAll('[role=\"button\"]')"
    // );
    // loginBtn[3].click();
    // await waitFor(2000);
    const twitterIdurl = config.twitterURL + config.twitterID;
    driver.get(twitterIdurl);
    if (config.isLike) {
      await likeTwitter(driver);
    }
    if (config.isRetweet) {
      await retweetTW(driver);
    }
    if (config.isReply) {
      await replyTW(driver);
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

const replyTW = async (driver) => {
  const twitterUsers = excelData.map((x) => "@" + x.Twitter);
  const textEditorElementId = "//div[@aria-label='Tweet text']";
  await driver.wait(until.elementLocated(By.xpath(textEditorElementId)), 10000);
  const textEditorElement = await driver.findElement(
    By.xpath(textEditorElementId)
  );
  driver.executeScript("arguments[0].click();", textEditorElement);
  textEditorElement.sendKeys(
    "7 Restaurants in Rome Locals Love " +
      getRandomElementsFromArray(twitterUsers, 3).join(" ")
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
  await driver.get(config.dcomURL);
  const btnElementId = "//button[@id='home_connect_btn']";
  await driver.wait(until.elementLocated(By.xpath(btnElementId)), 10000);
  return await driver.findElement(By.xpath(btnElementId));
};

const excelData = convertExcel("excel");
// const length = excelData.length;
const length = 5;

let i = 0;

(async () => {
  // const btn = await openDcom();
  // btn.click();
  let drivers = [];
  while (i <= length) {
    const promiseAll = [];
    excelData.slice(i, i + config.groupChrome).forEach((item) => {
      const profile = `${config.profile}\\${item.STT}\\Data\\profile`;
      console.log({ profile });
      promiseAll.push(
        loginTwitter.bind({ ...this }, profile, item.Twitter, item.PassTwitter)
      );
    });
    drivers = await Promise.all(promiseAll.map((x) => x()));
    i += config.groupChrome;
  }
  drivers.forEach((driver) => {
    driver.close();
  });
  console.log(drivers);
  // btn.click();
})();
