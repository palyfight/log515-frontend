import shopService from '../../services/shop';

export default {
  ready () {
    this.getShopLegal();
  },

  props: ['shop', 'legal'],

  data () {
    return {
      shopLegalSubmitted: false,
    }
  },

  methods: {
    getShopLegal () {
      const shopId = localStorage.getItem('shop_id');

      shopService.getShopLegal(shopId)
      .then((response) => {
        this.$set('legal.incorporation', response.data.incorporation_number);
        this.$set('legal.disclaimer', response.data.disclaimer);

        // super bad
        this.$set('legal.gst', response.data.taxes.gst);
        this.$set('legal.qst', response.data.taxes.qst);
      })
      .catch((err) => {
        if (err.status >= 500) {
          this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
        }
      });
    },

    updateShopLegal () {
      this.shopLegalSubmitted = true;
      if (this.$shopLegalValidation.errors && this.$shopLegalValidation.errors.length > 0) {
        let errors = _.map(this.$shopLegalValidation.errors, (error) => {
          return error.message;
        });

        this.$broadcast('error-messages', errors);
      } else {
        const shopId = localStorage.getItem('shop_id');

        const shopLegal = {
          "shop_legal": {
            "incorporation_number": this.legal.incorporation,
            "taxes": {gst: this.legal.gst, qst: this.legal.qst},
            "disclaimer": this.legal.disclaimer
          }
        };

        shopService.updateShopLegal(shopId, shopLegal)
        .then((response) => {
          this.$dispatch('success-notification', {title: 'Shop Legal Updated', text: "Your shop's legal information have been updated successfully!"});
        })
        .catch((err) => {
          this.$dispatch('danger-notification', { title: 'Internal Error', text: 'Please communicate with our support team' });
        });
      }
    }
  }
}
