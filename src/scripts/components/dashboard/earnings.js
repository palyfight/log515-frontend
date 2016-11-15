import authService from '../../services/auth';
import reportingService from '../../services/reporting';
import userService from '../../services/user';

export default {
  ready () {
    userService.getShops()
    .then((response) => {
      if (response.data.length === 0) {
        router.go('/admin/shops/new')
        return;
      }
      if (localStorage.getItem('shop_id') === null) {
        localStorage.setItem('shop_id', response.data[0].id);
      }

      this.getYearsEarnings();
      this.getDayEarnings();
      this.getWeekEarnings();
      this.getMonthEarnings();
      this.getYearEarnings();
    })
    .catch((error) => {
      console.log(error)
    });
  },

  data () {
    return this.initiate();
  },

  methods: {
    initiate () {
      return {
        todayEarnings: 0,
        weekEarnings: 0,
        monthEarnings: 0,
        yearEarnings: 0
      }
    },

    getDayEarnings () {
      const shopId = localStorage.getItem('shop_id');

      const today = moment(new Date()).format("Y-MM-DD");

      reportingService.getEarnings(shopId, {date: today})
      .then((response) => {
        const earnings = response.data;

        if (_.size(earnings) === 0) {
          this.$set('todayEarnings', 0);
        } else {
          this.$set('todayEarnings', numeral(_.head(earnings).earnings, 10).format('0,00.00$'));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },

    getWeekEarnings () {
      const shopId = localStorage.getItem('shop_id');

      const startWeek = moment().startOf('week').format("Y-MM-DD");
      const endWeek = moment().endOf('week').format("Y-MM-DD");
      const date = startWeek + "TO" + endWeek;

      reportingService.getEarnings(shopId, {date: date})
      .then((response) => {
        const earnings = response.data;

        if (_.size(earnings) === 0) {
          this.$set('weekEarnings', 0);
        } else {
          let earningsAmount = 0;

          _.forEach(earnings, (earning) => {
            earningsAmount += parseFloat(earning.earnings, 10);
          });

          this.$set('weekEarnings', numeral(earningsAmount).format('0,00.00$'));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },

    getMonthEarnings () {
      const shopId = localStorage.getItem('shop_id');

      const year = moment(new Date()).format("Y");
      const month = moment(new Date()).format("MM");

      reportingService.getEarnings(shopId, {year: year, month: month})
      .then((response) => {
        const earnings = response.data;

        if (_.size(earnings) === 0) {
          this.$set('monthEarnings', 0);
        } else {
          let earningsAmount = 0;

          _.forEach(earnings, (earning) => {
            earningsAmount += parseFloat(_.head(earning).earnings, 10);
          });

          this.$set('monthEarnings', numeral(earningsAmount).format('0,0.00$'));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },

    getYearEarnings () {
      const shopId = localStorage.getItem('shop_id');

      const year = moment(new Date()).format("Y");

      reportingService.getEarnings(shopId, {year: year})
      .then((response) => {
        const earnings = response.data[year];

        if (_.size(earnings) === 0) {
          this.$set('yearEarnings', 0);
        } else {
          let earningsAmount = 0;

          _.forEach(earnings, (earning) => {
            earningsAmount += parseFloat(earning.earnings, 10);
          });

          this.$set('yearEarnings', numeral(earningsAmount).format('0,0.00$'));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },

    getYearsEarnings () {
      const shopId = localStorage.getItem('shop_id');

      const color1 = "#F44336";
      const color2 = "#009688";

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthsDigits = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

      const lastYear = moment(new Date()).subtract(1, "year").format("Y");
      const currentYear = moment(new Date()).format("Y");
      const years = lastYear + "TO" + currentYear;

      const monthsLength = parseInt(moment(new Date()).format('M'), 10);

      reportingService.getEarnings(shopId, {year: years})
      .then((response) => {
        const earningsData = response.data;
        const data = [];

        for (let i = 0; i < monthsLength; i++) {
          let chartDots = {month: monthsDigits[i], last: 0, current: 0};

          _.forEach(earningsData[lastYear], (earning) => {
            if (earning.earnings_month === monthsDigits[i]) {
              chartDots.last = parseFloat(earning.earnings, 10);
            }
          });

          _.forEach(earningsData[currentYear], (earning) => {
            if (earning.earnings_month === monthsDigits[i]) {
              chartDots.current = parseFloat(earning.earnings, 10);
            }
          });

          data.push(chartDots);
        }

        new Morris.Line({
          element: 'line-chart',
          data: data,
          lineColors: [color1, color2],
          parseTime: false,
          postUnits: "$",
          xkey: 'month',
          xLabels: 'month',
          ykeys: ['last', 'current'],
          labels: [lastYear, currentYear],
          hoverCallback: function (index, options, content, row) {
            return _.replace(content, ',', ' ');
          },
          xLabelFormat: function(label) {
            return months[label.x];
          },
        });

      })
      .catch((error) => {
        console.log(error);
      });
    }
  }
}
