const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const assert = require("assert");
const chrome = require('selenium-webdriver/chrome');
const environment = require('../URL_Website.js');
const { writeLastValue, readLastValue } = require('../fileUtils.js');
const { user_default } = require('../user_login.js')

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
    

    await driver.get(environment.URL + "/#/login")
    await driver.wait(until.elementLocated(By.id('inputUserID')), 10000);
    let userName = await driver.findElement(By.id('inputUserID'))
    await driver.wait(until.elementLocated(By.id('inputPassword')), 10000);
    let password = await driver.findElement(By.id('inputPassword'))
    let submitButtonLogin = await driver.findElement(By.id('loginButton'))

    await userName.sendKeys(adminLogin.username);
    await password.sendKeys(adminLogin.password)
    await submitButtonLogin.click()
    await driver.sleep(2000);

    // Tunggu hingga login berhasil dan halaman berikutnya dimuat
    await driver.wait(until.urlIs(environment.URL + '/#/dashboard'), 10000);

    // Verifikasi jika login berhasil (misalnya, dengan memeriksa elemen tertentu di halaman home)
    let homeElement = await driver.findElement(By.id('dashboardTitle'));
    let text = await homeElement.getText();
    assert.strictEqual(text, 'Dashboard' || 'Beranda'); // Sesuaikan dengan elemen halaman Anda

    // Klik menu utama menggunakan class name
    await driver.wait(until.elementLocated(By.id('wrapper-MENU002')), 10000);
    let listMenu = await driver.findElement(By.id('wrapper-MENU002'));
    let textListMenu = await listMenu.getText();
    assert.strictEqual(textListMenu, 'User');
    await listMenu.click();

    await driver.wait(until.elementLocated(By.id('sub-menu-MENU003-MENU002')), 10000);
    let listSubmenu = await driver.findElement(By.id('sub-menu-MENU003-MENU002'));
    await listSubmenu.click();

    // await driver.sleep(3000);

    // Tunggu hingga halaman submenu dimuat
    await driver.wait(until.urlContains(environment.URL + '/#/user'), 10000);

    // Verifikasi jika navigasi ke submenu berhasil (misalnya, dengan memeriksa elemen tertentu di halaman submenu)
    let menuUser = await driver.findElement(By.id('breadcrumb'));
    let MenuText = await menuUser.getText();
    assert.strictEqual(MenuText, 'User List'); // Sesuaikan dengan elemen halaman submenu Anda

    await driver.sleep(3000);

    //Create User
    await driver.wait(until.elementLocated(By.id("AddUser")), 10000);
    await driver.findElement(By.id("AddUser")).click();

    await driver.findElement(By.id('userLoginName')).sendKeys(`user_maker${newValue}`);
    await driver.findElement(By.id('userName')).sendKeys(`user maker${newValue}`);
    await driver.findElement(By.id('email')).sendKeys(`user_maker${newValue}@gmail.com`);
    await driver.findElement(By.id('userPassword')).sendKeys('Abcabc123!');

    await driver.wait(until.elementLocated(By.id('roles')), 10000);
    await driver.findElement(By.id('roles')).click();
    await driver.findElement(By.xpath("//li[@aria-label='Maker']")).click();

    await driver.wait(until.elementLocated(By.id('userGroup')), 10000);
    await driver.findElement(By.id('userGroup')).click();
    await driver.wait(until.elementLocated(By.xpath("//input[@aria-activedescendant='p-highlighted-option']")), 10000);
    await driver.findElement(By.xpath("//input[@aria-activedescendant='p-highlighted-option']")).sendKeys('user_groupMaker')
    await driver.findElement(By.xpath("//li[@aria-label='user_groupMaker']")).click();

    await driver.findElement(By.id('saveUser')).click()

    await driver.sleep(2000);

    //Update User
    let searchUserInput1 = driver.wait(until.elementLocated(By.css('input[placeholder="Search by Login Name..."]')), 10000);;
    await searchUserInput1.click();
    await searchUserInput1.sendKeys(`user_maker${newValue}`);

    await driver.sleep(3000);
    let clickRowUser = await driver.wait(until.elementLocated(By.xpath("//tbody[@class='p-element p-datatable-tbody']")), 10000)
    await clickRowUser.click();

    let editUserName = await driver.wait(until.elementLocated(By.id('userName')), 10000);
    await editUserName.clear(); // Bersihkan input jika perlu
    await editUserName.sendKeys(`user_maker${newValue} Edit`);

    let editPassword = await driver.wait(until.elementLocated(By.id('userPassword')), 10000);
    await editPassword.clear(); // Bersihkan input jika perlu
    await editPassword.sendKeys(`UserMaker123!`);

    await driver.wait(until.elementLocated(By.id('updateUser')), 10000);
    await driver.findElement(By.id('updateUser')).click();

    await driver.sleep(3000);

    let confirmationMessageSuccess = await driver.wait(until.elementLocated(By.xpath("//div[contains(text(), 'User updated successfully!')]")), 10000);
    // Verifikasi pesan konfirmasi
    let messageText = await confirmationMessageSuccess.getText();
    // await driver.sleep(10000);
    if (messageText === 'User updated successfully!') {
      console.log('Update Success');
      await driver.sleep(3000);

      //Delete User
      let clickRowUser = await driver.wait(until.elementLocated(By.xpath("//tbody[@class='p-element p-datatable-tbody']")), 1000)
      await clickRowUser.click();

      let clickDeleteUser = await driver.wait(until.elementLocated(By.id('deleteUser')), 1000)
      await clickDeleteUser.click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Yes')]")), 1000).click();

      await driver.sleep(3000);

      // p-toast-detail ng-tns-c20-12
      let confirmationMessageSuccess = await driver.wait(until.elementLocated(By.xpath("//div[contains(text(), 'Success')]")), 10000);
      // Verifikasi pesan konfirmasi
      let messageText = await confirmationMessageSuccess.getText();
      console.log(messageText)
      await driver.sleep(4000);
      if (messageText === 'Success') {
        console.log('Data successfully deleted');
        await driver.wait(until.elementLocated(By.xpath("//span[@id='profileCard']")), 10000)
        await driver.findElement(By.xpath("//span[@id='profileCard']")).click()

        await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Logout')]")), 10000)
        await driver.findElement(By.xpath("//span[contains(text(), 'Logout')]")).click()
        writeLastValue(identifier, newValue);
        console.log('Test Case Positive USER Success')

      } else {
        console.error('Confirmation message does not match.');
      }
    } else {
      console.error('Confirmation message does not match.');
    }

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // await driver.sleep(5000);
    await driver.quit();
  }
}

test_script('test_script')