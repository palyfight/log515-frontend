import authService from '../../services/auth'
import userService from '../../services/user'
import Earnings from './Earnings.vue';
import Customers from './Customers.vue';

export default {
  ready () {
    //App.init();
    $('[data-toggle="counter"]').each(function(i, e){
      const _el     = $(this);
      let prefix    = '';
      let suffix    = '';
      let start     = 0;
      let end       = 0;
      let decimals  = 0;
      let duration  = 2.5;

      if( _el.data('prefix') ){ prefix = _el.data('prefix'); }

      if( _el.data('suffix') ){ suffix = _el.data('suffix'); }

      if( _el.data('start') ){ start = _el.data('start'); }

      if( _el.data('end') ){ end = _el.data('end'); }

      if( _el.data('decimals') ){ decimals = _el.data('decimals'); }

      if( _el.data('duration') ){ duration = _el.data('duration'); }

      const count = new CountUp(_el.get(0), start, end, decimals, duration, { 
        suffix: suffix,
        prefix: prefix,
      });

      count.start();
    });

    userService.getShops()
    .then((response) => {
      if (response.data.length === 0) {
        router.go('/admin/shops/new')
        return;
      }

      if (localStorage.getItem('shop_id') === null) {
        localStorage.setItem('shop_id', response.data[0].id);
      }

      this.shouldDisplayDashboard();
    })
    .catch((response) => {
      console.log(response);
    });
  },

  components: {
    'shop-earnings': Earnings,
    'shop-customers': Customers,
  },

  data () {
    return {
      error: '',
      displayDashboard: false
    }
  },

  methods: {
    submit () {
    },

    shouldDisplayDashboard () {
      const shopId = parseInt(localStorage.getItem('shop_id'), 10);

      // we show the dashboard if it's not in the list shopIdToHideDashboard
      if (_.indexOf(config.shopsToHideDashboard, shopId) === -1) {
        this.$set('displayDashboard', true);
      }
    }
  }
}
