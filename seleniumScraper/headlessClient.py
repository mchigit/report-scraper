from selenium.webdriver.chrome.options import Options
from selenium import webdriver
import os

def set_chrome_options():
    """Sets chrome options for Selenium.
    Chrome options for headless browser is enabled.
    """
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_prefs = {}
    chrome_options.experimental_options["prefs"] = chrome_prefs
    chrome_prefs["profile.default_content_settings"] = {"images": 2}
    return chrome_options


class HeadlessChrome:
    __instance = None

    @staticmethod
    def getInstance():
        if HeadlessChrome.__instance == None:
            HeadlessChrome()
        return HeadlessChrome.__instance

    def __init__(self):
        if HeadlessChrome.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            chrome_options = set_chrome_options()
            driver = webdriver.Chrome(os.getenv('CHROME_DRIVER_PATH'))
            HeadlessChrome.driver = driver
            HeadlessChrome.__instance = self

    @staticmethod
    def close():
        if HeadlessChrome.__instance != None:
            HeadlessChrome.__instance.driver.close()
        # else:
        #     raise Exception("Calling close before initializing!")
