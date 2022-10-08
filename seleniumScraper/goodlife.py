from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.keys import Keys

from .utils.date import getLastMonthDate
from .headlessClient import HeadlessChrome
from .config import CONFIG
import os
import time


def fillForm():
    chrome = HeadlessChrome.getInstance()
    driver = chrome.driver

    driver.find_element(By.ID, "Copy_first_name").send_keys(os.getenv("FIRST_NAME"))
    driver.find_element(By.ID, "Copy_last_name").send_keys(os.getenv("LAST_NAME"))
    driver.find_element(By.ID, "Copy_revcan_number").send_keys(os.getenv("BAR_CODE"))
    driver.find_element(By.ID, "Copy_street").send_keys(os.getenv("STREET"))
    driver.find_element(By.ID, "Copy_city").send_keys(os.getenv("CITY"))
    driver.find_element(By.ID, "Copy_postal_code").send_keys(os.getenv("POSTAL"))
    driver.find_element(By.ID, "Copy_email").send_keys(os.getenv("EMAIL"))
    driver.find_element(By.ID, "Copy_email2").send_keys(os.getenv("EMAIL"))
    driver.find_element(By.ID, "Copy_telephone").send_keys(os.getenv("PHONE"))

    monthSelect = Select(driver.find_element(By.ID, "Copy_drpBirthMonth"))
    daySelect = Select(driver.find_element(By.ID, "Copy_drpBirthDay"))
    yearSelect = Select(driver.find_element(By.ID, "Copy_drpBirthYear"))
    provinceSelect = Select(driver.find_element(By.ID, "Copy_province"))

    monthSelect.select_by_value(os.getenv("BIRTH_MONTH"))
    daySelect.select_by_value(os.getenv("BIRTH_DAY"))
    yearSelect.select_by_value(os.getenv("BIRTH_YEAR"))
    provinceSelect.select_by_value(os.getenv("PROVINCE"))

    endDateSelect = driver.find_element(By.ID, "Copy_enddate")
    endDateSelect.click()
    endDateSelect.send_keys(Keys.RETURN)

    endDate = endDateSelect.get_attribute("value")
    startDate = getLastMonthDate(endDate)
    driver.find_element(By.ID, "Copy_startdate").send_keys(startDate)

    driver.find_element(By.ID, "Copy_CheckBox1").click()


def scrapeGoodLife():
    try:
        chrome = HeadlessChrome.getInstance()
        driver = chrome.driver

        driver.get(CONFIG.get("goodLifeUrl"))
        fillForm()

        driver.find_element(By.ID, "Copy_btnSubmit3day").click()
        time.sleep(10)

        # driver.find_element(By.ID, 'Copy_btnSubmit3day').click()

    except Exception as e:
        print(e.with_traceback())
