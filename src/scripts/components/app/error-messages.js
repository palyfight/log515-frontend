export default {
  ready() {
    this.$on('error-messages', (errors) => {
      this.$set('messages', errors)
    });
  },

  data () {
    return {
      'messages': []
    }
  },

  methods: {
  }
}
