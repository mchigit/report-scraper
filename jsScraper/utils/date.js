const moment = require("moment");

function getPreviousMonthStart() {
  const now = moment();
  const lastMonthStart = now.subtract(1, "month").startOf("month");

  return lastMonthStart.format("MM/DD/YYYY");
}

function getPreviousMonthEnd() {
    const now = moment();
    const lastMonthEnd = now.subtract(1, "month").endOf("month");
  
    return lastMonthEnd.format("MM/DD/YYYY");
}

module.exports = {
  getPreviousMonthEnd,
  getPreviousMonthStart,
};
