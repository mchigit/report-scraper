from .goodlife import scrapeGoodLife

items_to_scrape = [
    {
        "name": 'GoodLife',
        "fn": scrapeGoodLife
    },
]

def scrape():
    scrapeGoodLife()