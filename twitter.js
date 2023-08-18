const { By, until } = require("selenium-webdriver");
const config = require("./config.js");
const {
  getRandomElementsFromArray,
  convertExcel,
  waitFor,
  getDriver,
  executeDriver,
  getBtnDcom,
  openDcom,
} = require("./utils.js");

const loginTwitter = async (profile, item) => {
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
    await usernameElement.sendKeys(item.Twitter);
    const nextBtn = await driver.executeScript(
      "return document.querySelectorAll('[role=\"button\"]')"
    );
    nextBtn[3].click();
    await waitFor(2000);

    try {
      const isCheckNickname = await driver.wait(
        until.elementLocated(By.xpath("//div[@name='text']")),
        2000
      );
      if (isCheckNickname) {
        const nickname = await driver.findElement(
          By.xpath("//div[@name='text']")
        );
        nickname.click();
        await nickname.sendKeys("@" + item.Twitter);
        const nextBtn = await driver.executeScript(
          "return document.querySelectorAll('[role=\"button\"]')"
        );
        nextBtn[3].click();
        await waitFor(2000);
      }
    } catch (error) { }

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
    await passwordelement.sendKeys(item.PassTwitter);
    await waitFor(2000);

    const loginBtn = await driver.executeScript(
      "return document.querySelectorAll('[role=\"button\"]')"
    );
    loginBtn[3].click();
    await waitFor(4000);
  } catch (error) {
  } finally {
    return { ...driver };
  }
};

const onHandleActionTwitter = async (profile, item) => {
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
      await replyTW(driver, item.comment, item.metamask);
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

const main = async () => {
  const excelData = convertExcel("excel");
  let i = 0;
  const driverDcom = await openDcom();
  const btn = await getBtnDcom(driverDcom);
  while (i <= excelData.length) {
    driverDcom.executeScript("arguments[0].click();", btn);
    await waitFor(10000);
    await executeDriver(
      this,
      excelData,
      i,
      config.isLoginTwitter ? loginTwitter : onHandleActionTwitter
    );
    i += config.groupChrome;
    await driverDcom.executeScript("arguments[0].click();", btn);
    await waitFor(10000);
  }
};

main();
