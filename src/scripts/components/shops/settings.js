import shop from '../../services/shop';
import auth from '../../services/auth';
import ShopInfo from './ShopInfo.vue';
import ShopLegal from './ShopLegal.vue';
import ShopLogo from './ShopLogo.vue';

export default {
  ready () {
    //App.init();
  },

  components: {
    'shop-info': ShopInfo,
    'shop-legal': ShopLegal,
    'shop-logo': ShopLogo
  },

  data () {
    return {
      shop: {
      },
      user: {
      },
      legal: {
      }
    }
  },

  methods: {
  }
}
