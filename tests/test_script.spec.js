const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const environment = require('../URL_Website.js');
const { writeLastValue, readLastValue } = require('../fileUtil.js');
const { user_invalid, user_valid } = require('../user_login.js')

async function test_script(identifier) {
  let options = new chrome.Options();
  options.addArguments('--force-device-scale-factor=0.85'); // Mengatur zoom ke 80%
  options.addArguments('--start-maximized'); // Membuka Chrome dalam mode layar penuh

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    let lastValue = readLastValue(identifier);
    let newValue = lastValue + 1;

    // Scenario Login
    await driver.get(environment.URL)

    await driver.wait(until.elementLocated(By.id('menu-toggle')), 10000);
    await driver.findElement(By.id('menu-toggle')).click()

    await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Login')]")), 1000).click();
    await driver.sleep(2000);

    await driver.get(environment.URL + "/profile.php#login")

    // Input invalid username and password
    await driver.wait(until.elementLocated(By.id('txt-username')), 10000);
    await driver.findElement(By.id('txt-username')).sendKeys(user_invalid.username);
    await driver.wait(until.elementLocated(By.id('txt-password')), 10000);
    await driver.findElement(By.id('txt-password')).sendKeys(user_invalid.password)
    await driver.findElement(By.id('btn-login')).click()
    await driver.sleep(2000);

    // Error message checking
    await driver.wait(until.elementLocated(By.xpath("//p[contains(text(), 'Login failed! Please ensure the username and password are valid.')]")), 10000);
    let isErrorDisplayed = await driver.findElement(By.xpath("//p[contains(text(), 'Login failed! Please ensure the username and password are valid.')]"))

    if (isErrorDisplayed) {
      console.log('Login gagal, mencoba login ulang dengan data valid.');

      // Input valid username and password
      await driver.wait(until.elementLocated(By.id('txt-username')), 10000);
      await driver.findElement(By.id('txt-username')).sendKeys(user_valid.username);
      await driver.wait(until.elementLocated(By.id('txt-password')), 10000);
      await driver.findElement(By.id('txt-password')).sendKeys(user_valid.password)
      await driver.findElement(By.id('btn-login')).click()
      await driver.sleep(2000);
    }

    // Login Success
    await driver.get(environment.URL + "/#appointment")
    await driver.wait(until.elementLocated(By.id('btn-make-appointment')), 5000);
    await driver.findElement(By.id('btn-make-appointment')).click()

    await driver.sleep(2000);

    //Scenario Make Appointment

    //Make Appointment - without input mandatory field
    await driver.findElement(By.id('combo_facility')).click()
    await driver.findElement(By.xpath("//option[@value='Seoul CURA Healthcare Center']")).click();
    await driver.findElement(By.id('chk_hospotal_readmission')).click()
    await driver.findElement(By.id('radio_program_medicaid')).click()
    await driver.findElement(By.id('txt_comment')).sendKeys(`Book Appointment ${newValue}`);
    await driver.findElement(By.id('btn-book-appointment')).click()
    await driver.sleep(2000);

    //Make Appointment - Success
    await driver.findElement(By.xpath("//td[contains(text(), '29')]")).click();
    await driver.findElement(By.id('txt_comment')).click();
    await driver.findElement(By.id('btn-book-appointment')).click()
    await driver.sleep(2000);

    await driver.findElement(By.xpath("//a[contains(text(), 'Go to Homepage')]")).click();

    // Logout
    await driver.wait(until.elementLocated(By.id('menu-toggle')), 10000);
    await driver.findElement(By.id('menu-toggle')).click()

    await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Logout')]")), 1000).click();
    await driver.sleep(2000);
    await driver.get(environment.URL)

    writeLastValue(identifier, newValue);
    console.log('Test Case All Completed!')
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // await driver.sleep(5000);
    await driver.quit();
  }
}

test_script('test_script')