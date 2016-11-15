export default {
  ready () {
  },

  data () {
    return {
      property: {
        address: '',
        postalCode: '',
        nbAppartments: '',
        description: ''
      },
    }
  },

  methods: {
    addProperty () {
      var property = {
        address: this.property.address,
        postalCode: this.property.postalCode,
        nbAppartments: this.property.nbAppartments,
        description: this.property.description
      }
      console.log(property);
    }
  }
}
