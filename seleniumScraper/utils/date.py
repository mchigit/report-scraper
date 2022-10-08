from datetime import datetime, timedelta


def getPreviousMonthStart():
    today = datetime.today()
    first = today.replace(day=1)
    lastMonth = first - timedelta(days=1)
    month = "{:02d}".format(lastMonth.month)
    year = lastMonth.year

    return "{0}/01/{1}".format(month, year)


def getPreviousMonthEnd():
    # month = datetime.now().month
    # year = datetime.now().year

    # (_, lastDay) = calendar.monthrange(year, month)

    # return '{0}/{1}/{2}'.format('{:02d}'.format(month), lastDay, year)
    today = datetime.today()
    first = today.replace(day=1)
    lastMonth = first - timedelta(days=1)
    month = "{:02d}".format(lastMonth.month)
    year = lastMonth.year
    day = lastMonth.day

    return "{0}/{1}/{2}".format(month, day, year)


def getLastMonthDate(currentDate):
    curDateTime = datetime.strptime(currentDate, "%m/%d/%Y")

    if curDateTime.month == 1:
        one_month_ago = curDateTime.replace(year=curDateTime.year - 1, month=12)
    else:
        extra_days = 0
    while True:
        try:
            one_month_ago = curDateTime.replace(
                month=curDateTime.month - 1, day=curDateTime.day - extra_days
            )
            break
        except ValueError:
            extra_days += 1

    return one_month_ago.strftime("%m/%d/%Y")
