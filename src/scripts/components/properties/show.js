import Property from '../../services/property';

export default {
  ready () {
    this.property.propertyId = this.$route.params.id;
    this.getProperty();
  },

  data () {
    return {
      property: {
        description: '',
        nbapparts: '',
        phone: '',
        postalCode: '',
        propertyId: '',
        tenants: 0,
        occupied: 0,
        free: 0,
        occupants : []
      },
    }
  },

  methods: {

    getProperty () {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');

      Property.getProperty( this.property.propertyId )
      .then((response) => {
        _.map(response.data, (property) => {
          this.$set('property.description', property.description);
          this.$set('property.nbapparts', property.nbapparts);
          this.$set('property.postalCode', property.postalCode);
          this.$set('property.propertyId', property.propertyId);
          this.$set('property.address', property.address);
          this.property.occupants.push({
            username: property.username,
            doorNumber: property.doorNumber,
            phone: property.phone,
            userId: property.userId,
            role: property.role
          });
        });
        this.$set('property.tenants', this.property.occupants.length);
        this.$set('property.occupied', this.property.occupants.length);
        this.$set('property.free', (this.property.nbapparts - this.property.occupants.length));
      })
      .catch((error) => {
        this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
      })
    },

    removeOccupant (occupantId) {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');

      Property.removeOccupant( userId, occupantId )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
      })
    }
  }
}
