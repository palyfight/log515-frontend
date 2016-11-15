import shopService from '../../services/shop';
import geoService from '../../services/geo';
import authService from '../../services/auth';

export default {
  ready () {
    this.getShop();

    $("#shop-phone").mask("(999) 999-9999? x99999");
  },

  props: ['shop', 'user'],

  data () {
    return {
      shopInfoSubmitted: false,
      countries: '',
      selectedCountry: '',
      regions: '',
      selectedRegion: '',
    }
  },

  methods: {
    getShop () {
      const shopId = localStorage.getItem('shop_id');
      shopService.getShopById(shopId)
      .then((response) => {
        this.shop = response.data;

        this.getCountries();
      })
      .catch((err) => {
        this.$dispatch('danger-notification', { title: 'Internal Error', text: 'Please communicate with our support team' });
        console.log(err);
      });
    },

    getCountries () {
      geoService.getCountries()
      .then((response) => {
        this.$set('countries', response.data);
        this.$set('selectedCountry', parseInt(this.shop.country_id, 10));
        this.getRegions();
      })
      .catch((error) => {
        console.log(error);
      })
    },

    getRegions () {
      geoService.getRegions(this.$get('selectedCountry'))
      .then((response) => {
        const regions = response.data;
        this.$set('regions', regions);
        this.$set('selectedRegion', parseInt(this.shop.region_id, 10));
      })
      .catch((error) => {
        console.log(error);
      })
    },

    updateShopInformation () {
      this.shopInfoSubmitted = true;
      if (this.$shopInfoValidation.errors && this.$shopInfoValidation.errors.length > 0) {
        let errors = _.map(this.$shopInfoValidation.errors, (error) => {
          return error.message;
        });

        this.$broadcast('error-messages', errors);
      } else {
        this.shop.region_id = this.selectedRegion;
        this.shop.country_id = this.selectedCountry;

        const shop = {
          shop: this.shop
        };

        shopService.updateShop(this.shop.id, shop)
        .then((response) => {
          this.$dispatch('success-notification', {title: 'Shop Information Updated', text: "Your shop's information have been updated successfully!"});
        })
        .catch((err) => {
          this.$dispatch('danger-notification', { title: 'Internal Error', text: 'Please communicate with our support team' });
        });
      }
    }
  }
}
