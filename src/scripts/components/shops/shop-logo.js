import shopService from '../../services/shop';

export default {
  ready () {
    this.getShopLogo();
  },

  data () {
    return {
      image: '',
      help: ''
    }
  },

  methods: {
    getShopLogo () {
      const shopId = localStorage.getItem('shop_id');
      shopService.getShopLogo(shopId)
      .then((response) => {
        this.image = response.data.image;
      })
      .catch((err) => {
        if (err.status >= 500) {
          this.$dispatch('danger-notification', { title: 'Internal Error', text: 'Could not fetch your logo. Please communicate with our support team' });
          console.log(err);
        }
      });
    },

    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      if ((files[0].size/1024) > 2 * 1024) {
        this.help = "The logo is too big, max file size is 2MB.";
        return;
      }
      this.createImage(files[0]);
    },

    createImage(file) {
      const image = new Image();
      const reader = new FileReader();
      const self = this;

      reader.onload = (e) => {
        self.image = e.target.result;

        const logoPayload = {
          "shop_meta": {
            "image": e.target.result
          }
        };

        const shopId = localStorage.getItem('shop_id');

        shopService.changeShopLogo(shopId, logoPayload)
        .then((response) => {
          this.$dispatch('success-notification', {title: 'Logo updated', text: 'Your logo was updated successfully!'});
        })
        .catch((err) => {
          this.$dispatch('danger-notification', { title: 'Internal Error', text: 'Please communicate with our support team' });
        });
      };

      reader.readAsDataURL(file);
    },

    removeImage (e) {
      this.image = '';
    }
  }
}
