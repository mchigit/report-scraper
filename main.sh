#!/bin/sh

docker build . -t report-scraper

docker run report-scraper
