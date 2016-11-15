import shop from '../../services/shop'
import geo from '../../services/geo'
import auth from '../../services/auth'

export default {
  ready () {
    this.getCountries();

    $("#shop-phone").mask("(999) 999-9999? x99999");
  },

  data () {
    return {
      newShopSubmitted: false,
      countries: '',
      selectedCountry: '',
      regions: '',
      selectedRegion: '',
      page_title: 'New Shop',
      shop: {
        name: '',
        address1: '',
        postal_code: '',
        country: '',
        city: '',
        region: ''
      }
    }
  },

  methods: {
    create () {
      this.newShopSubmitted = true;
      var data = {
        shop: {
          name: this.shop.name,
          address1: this.shop.address1,
          city: this.shop.city,
          postal_code: this.shop.postal_code,
          country_id: this.selectedCountry,
          region_id: this.selectedRegion
        }
      }

      const hasErrors = this.$newRepairShopValidation.errors && this.$newRepairShopValidation.errors.length > 0;
      if (!hasErrors) {
        shop.createShop(data)
        .then((response) => {
          localStorage.setItem('shop_id', response.data.id);
          localStorage.setItem('has_shops', true);
          router.go('/admin/shops/settings');
        })
        .catch((err) => {
          console.log(err);
        });
      }
    },

    getCountries () {
      geo.getCountries()
      .then((response) => {
        this.$set('countries', response.data)
        this.$set('selectedCountry', '1')
        this.getRegions()
      })
      .catch((error) => {
        console.log(error)
      })
    },

    getRegions () {
      geo.getRegions(this.$get('selectedCountry'))
      .then((response) => {
        const regions = response.data;
        this.$set('regions', regions)
        this.$set('selectedRegion', regions[0].id)
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }
}
