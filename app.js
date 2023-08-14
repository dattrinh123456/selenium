const { Builder, By, until, Capabilities } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const config = require("./config.js");
const {
  getRandomElementsFromArray,
  convertExcel,
  getRandomPort,
  waitFor
} = require("./utils.js");


const loginTwitter = async (profile, username, password, comment, metamask) => {
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
      await replyTW(driver, comment, metamask);
    }
  } catch (error) {
  } finally {
    return { ...driver }
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
  const newComment = config.isCustomComment ? metamask : comment
  textEditorElement.sendKeys(
    newComment +
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
  try {
    driver.get(config.dcomURL);
    return driver
  } catch (error) {
    return;
  } finally {
    return { ...driver }
  }
};

const getBtnDcom = async (driver) => {
  const btnElementId = "//button[@id='home_connect_btn']";
  await driver.wait(until.elementLocated(By.xpath(btnElementId)), 10000);
  return await driver.findElement(By.xpath(btnElementId));
}

let excelData = convertExcel("excel");
excelData = config.isRunAllExcel ? excelData : excelData.slice(config.startExcelIndex, config.EndExcelIndex)
const length = excelData.length;
let i = 0;

(async () => {
  const waitingTime = 10000;
  let drivers = [];
  const driverDcom = await openDcom();
  const btnConnect = await getBtnDcom(driverDcom);
  while (i <= length) {
    driverDcom.executeScript("arguments[0].click();", btnConnect);
    await waitFor(waitingTime)
    const promiseAll = [];
    excelData.slice(i, i + config.groupChrome).forEach((item) => {
      const profile = `${config.profile}\\${item.STT}\\Data\\profile`;
      console.log({ profile });
      promiseAll.push(
        loginTwitter.bind({ ...this }, profile, item.Twitter, item.PassTwitter, item.Comment, item.Metamask
        )
      );
    });
    waitFor(5000);
    drivers = await Promise.all(promiseAll.map((x) => x()));
    waitFor(5000);
    (async () => {
      await drivers.forEach(async (x) => { await x.close() })
    })();
    waitFor(5000);
    i += config.groupChrome;
    // const btnDisconnect = await getBtnDcom(driverDcom);
    driverDcom.executeScript("arguments[0].click();", btnConnect);
    waitFor(waitingTime)
    console.log(drivers)
  }
})();
