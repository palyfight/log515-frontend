import auth from '../../services/auth';
import customerService from '../../services/client';
import carService from '../../services/car'
import vehicleService from '../../services/vehicle'

export default {
  ready () {
    this.getMakers()
  },

  data () {
    return this.initiate();
  },

  methods: {
    initiate () {
      return {
        selectedMaker: '',
        selectedModel: '',
        selectedYear: '',
        selectedTrim: '',
        selectedCar: -1,
        isCarModelDisabled: true,
        isCarYearDisabled: true,
        isCarTrimDisabled: true,
        makers: [],
        models: [],
        years: [],
        trims: [],
        ownedCars: [],
        customers: [],
        customer: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          gender: '',
          preferedPayment: '',
          address: '',
          city: '',
          region: '',
          country: '',
          postalCode: ''
        }
      }
    },

    cancelCreation() {
      this.$router.go('/admin/customers');
      return;
    },

    submitCustomerStep (wizardIndex) {
      switch(wizardIndex) {
        case 0:
          this.verifyCustomerInformation();
          break;
        case 1:
          this.verifyCustomerAddress();
          break;
      }
    },

    verifyCustomerInformation () {
      $('#wizard-create-customer').wizard('next');
    },

    verifyCustomerAddress () {
      $('#wizard-create-customer').wizard('next');
    },

    createCustomer () {
      const shopId = localStorage.getItem('shop_id');
      const customer = this.$get('customer');
      const ownedCars = this.$get('ownedCars');
      const customerFullName = this.$get('customer.firstName') + " " + this.$get('customer.firstName');

      const clientPayload = {
        "client": this.$get('customer')
      }

      customerService.createCustomer(shopId, clientPayload)
      .then((response) => {
        this.$dispatch('success-notification', {title: 'Customer Created', text: `The customer, ${customerFullName}, was created successfully!`});
        this.$router.go('/admin/customer/list');
        return;
      })
      .catch((error) => {
        this.$dispatch('danger-notification', { title: 'Internal Error', text: 'Please communicate with our support team' });
        console.log(error);
      })
    },

    getMakers () {
      carService.getMakers()
      .then((response) => {
        this.$set('makers', response.data.vehicule_makes)
      })
      .catch((error) => {
        console.log(error)
      })
    },

    getModels () {
      carService.getModels(this.selectedMaker)
      .then((response) => {
        this.$set('models', response.data.vehicule_models)
        this.$set('isCarModelDisabled', false)
      })
      .catch((error) => {
        console.log(error)
      })
    },

    getYears () {
      carService.getYears(this.selectedModel)
      .then((response) => {
        this.$set('years', response.data.vehicule_model_years)
        this.$set('isCarYearDisabled', false)
      })
      .catch((error) => {
        console.log(error)
      })
    },

    getTrims () {
      carService.getTrims(this.selectedModel, this.selectedYear)
      .then((response) => {
        this.$set('trims', response.data.vehicule_model_trims)
        this.$set('isCarTrimDisabled', false)
      })
      .catch((error) => {
        console.log(error)
      })
    },

    addNewCar () {
      if (this.selectedMaker && this.selectedModel && this.selectedYear) {
        let maker = this.makers.find((maker) => {
          return maker.id === this.selectedMaker
        });

        let model = this.models.find((model) => {
          return model.id === this.selectedModel
        });

        let year = this.years.find((year) => {
          return year === this.selectedYear
        });

        let trim = this.trims.find((trim) => {
          return trim.id === this.selectedTrim
        });

        const makerName = maker.name || '';
        const modelName = model.name || '';

        let trimName = '';
        if (trim) {
          trimName = trim.name;
        }

        this.ownedCars.push({'maker': makerName, 'model': modelName, 'year': year, 'trim': trimName, 'new': true, 'empty': false});
        this.$set('selectedCar', this.ownedCars.length - 1);
      }
      else{
      }

      this.$set('selectedMaker', '');
      this.$set('selectedModel', '');
      this.$set('selectedYear', '');
      this.$set('selectedTrim', '');
      this.$set('isCarModelDisabled', true);
      this.$set('isCarYearDisabled', true);
      this.$set('isCarTrimDisabled', true);
    },

    removeCustomerCar (ownedCar) {
      this.ownedCars.$remove(ownedCar)
      this.$set('selectedCar', this.ownedCars.length - 1)
    },
  }
}
