from datetime import datetime, timedelta
import calendar

def getPreviousMonthStart():
    today = datetime.today()
    first = today.replace(day=1)
    lastMonth = first - timedelta(days=1)
    month = '{:02d}'.format(lastMonth.month)
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
    month = '{:02d}'.format(lastMonth.month)
    year = lastMonth.year
    day = lastMonth.day

    return '{0}/{1}/{2}'.format(month, day, year)