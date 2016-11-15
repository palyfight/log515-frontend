import authService from '../../services/auth';
import dashboardChartService from '../../services/reporting';
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

        this.getCustomersInfos();
        this.getYearReturningCustomers();
        this.getYearNewCustomers();
        this.getYearTotalCustomers();
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
        yearNewCustomers: 0,
        yearReturningCustomers: 0,
        yearTotalCustomers: 0,
        yearReturningCustomersPercentage: 0,
        yearNewCustomersPercentage: 0
      }
    },

    getYearReturningCustomers () {
      const shopId = localStorage.getItem('shop_id');

      const year = moment(new Date()).format("Y");

      reportingService.getCustomers(shopId, {returning: 1})
        .then((response) => {
          const customers = response.data[year];
          this.$set('yearReturningCustomers', _.size(customers));
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getYearNewCustomers () {
      const shopId = localStorage.getItem('shop_id');

      const year = moment(new Date()).format("Y");

      reportingService.getCustomers(shopId, {new: 1})
        .then((response) => {
          const customers = response.data[year];
          this.$set('yearNewCustomers', _.size(customers));
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getYearTotalCustomers () {
      const shopId = localStorage.getItem('shop_id');
      const year = moment(new Date()).format("Y");
      const totalCustomers = 0,
        newCustomers = 0,
        returningCustomers = 0;

      reportingService.getCustomers(shopId, {all: 1})
        .then((response) => {
          const totalCustomers = _.size(response.data[year])

          this.$set('yearTotalCustomers', totalCustomers);

          return reportingService.getCustomers(shopId, {returning: 1});
        })
        .then((response) => {
          const returningCustomers = _.size(response.data[year]);

          this.$set('yearReturningCustomers', returningCustomers);

          return reportingService.getCustomers(shopId, {new: 1});
        })
        .then((response) => {
          const newCustomers = _.size(response.data[year]);

          this.$set('yearNewCustomers', newCustomers);

          const yearReturningCustomersPercentage = parseInt(this.$get('yearTotalCustomers'), 10) > 0 ?
            parseFloat((this.$get('yearReturningCustomers')/this.$get('yearTotalCustomers')) * 100 ).toFixed(2) : 0;

          const yearNewCustomersPercentage = parseInt(this.$get('yearTotalCustomers'), 10) > 0 ?
            parseFloat((this.$get('yearNewCustomers')/this.$get('yearTotalCustomers')) * 100 ).toFixed(2) : 0;

          this.$set('yearReturningCustomersPercentage', yearReturningCustomersPercentage);
          this.$set('yearNewCustomersPercentage', yearNewCustomersPercentage);

          var pieData = [
            { data: this.$get('yearNewCustomers'), color: '#F44336', label: 'New Customers ' + this.$get('yearNewCustomers') },
            { data: this.$get('yearReturningCustomers'), color: '#03A9F4', label: 'Returning Customers ' + this.$get('yearReturningCustomers') },
          ];
          $.plot('#donut-chart', pieData, {
            series: {
              pie: {
                innerRadius: 0.5,
                show: true,
                stroke: { 
                    width: 2,
                },
              },
            },
            legend: {
              container: '.flc-donut',
              backgroundOpacity: 0.5,
              noColumns: 0,
              backgroundColor: "white",
              lineWidth: 0
            },
            grid: {
              hoverable: true,
              clickable: true
            },
            tooltip: true,
            tooltipOpts: {
              content: "%p.0%, %s",
              shifts: {
                  x: 20,
                  y: 0
              },
              defaultTheme: false,
              cssClass: 'flot-tooltip'
            } 
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getCustomersInfos () {
      const shopId = localStorage.getItem('shop_id');
      const color = "#000";
      const color1 = "#2196F3";
      const color2 = "#009688";

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthsDigits = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

      const lastYear = moment(new Date()).subtract(1, "year").format("Y");
      const currentYear = moment(new Date()).format("Y");
      const years = lastYear + "TO" + currentYear;

      const monthsLength = parseInt(moment(new Date()).format('M'), 10);

      reportingService.getCustomers(shopId)
        .then((response) => {
          const customersData = response.data;
          const data = [];

          for (let i = 0; i < monthsLength; i++) {
            let chartDots = {month: monthsDigits[i], last: 0, current: 0};

            _.forEach(customersData[lastYear], (customer) => {
              if (customer.invoice_month === monthsDigits[i]) {
                chartDots.last += 1;
              }
            });

            _.forEach(customersData[currentYear], (customer) => {
              if (customer.invoice_month === monthsDigits[i]) {
                chartDots.current += 1;
              }
            });

            data.push(chartDots);
          }

          new Morris.Bar({
            element: 'bar-chart',
            data: data,
            parseTime: false,
            barColors: [color1, color2],
            barRatio: 0.4,
            xLabelAngle: 35,
            hideHover: 'auto',
            xkey: 'month',
            xLabels: 'month',
            ykeys: ['last', 'current'],
            labels: [lastYear, currentYear],
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
