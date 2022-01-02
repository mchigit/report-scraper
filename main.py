from seleniumScraper.scraper import scrape
from seleniumScraper.headlessClient import HeadlessChrome
from dotenv import load_dotenv

if __name__ == "__main__":
    load_dotenv()
    scrape()
    HeadlessChrome.close()
