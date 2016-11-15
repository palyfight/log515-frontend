import authService from '../../services/auth';
import carService from '../../services/car';
import clientService from '../../services/client';
import invoiceService from '../../services/invoice';
import quoteService from '../../services/quote';
import vehicleService from '../../services/vehicle';
import printService from '../../services/print';
import moment from 'moment';

export default {
  ready () {
    this.getMakers();
    this.invoiceId = this.$route.params.id;
    this.getInvoice();
    this.shop = {
      taxes: {"qst": 0.09975, "gst": 0.05}
    };

    $("body .car-select-options").on("change", (e) => {
        const el = $(e.target);
        this.activateCarDefinitions(el);
    });

    $(".select2").select2({
      width: '100%'
    });

    $('.date-picker').datetimepicker({
      format: 'YYYY-MM-DD',
      defaultDate: this.invoice.invoice_date,
      maxDate: new Date(),
      minDate: new Date(2000, 1, 1)
    });
  },

  data () {
    return {
      secondPhoneActivate: false,
      hasPhone2: false,
      invoiceSubmitted: false,
      invoiceComplete: false,
      selectedMaker: '',
      selectedModel: '',
      selectedYear: '',
      selectedTrim: '',
      selectedCar: -1,
      isCarModelDisabled: true,
      isCarYearDisabled: true,
      isCarTrimDisabled: true,
      client: {
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        phone2: '',
      },
      search: '',
      makers: [],
      models: [],
      years: [],
      trims: [],
      ownedCars: [],
      vehicle: {
        mileage: '',
        vin: '',
        plate: '',
        color: ''
      },
      defaultInvoiceLineHasErrors: false,
      defaultInvoiceLine: {
        description: '',
        quantity: 1,
        rate: 1,
      },
      invoice: {
        vehicule_id: 0,
        invoice_lines: [
        ],
        total: 0.00,
        subTotal: 0.00,
        taxes: {},
        totalTax: 0.00,
        paymentNote: '',
        paymentDetails: '',
        invoice_date: ''
      }
    }
  },

  computed: {
    clientFullName: function() {
      return this.client.firstName + " " + this.client.lastName;
    },

    hasSearch: function() {
      return false;
    }
  },

  methods: {
    cancelInvoice() {
      this.$router.go('/admin/repair-shop/invoices');
      return;
    },

    getOwnedCars (selectedVehiculeId) {
      const shopId = localStorage.getItem('shop_id');
      const clientId = this.$get('client.id');

      clientService.getClientVehicules(clientId)
      .then((response) => {
        for(let i = 0; i < response.data.length; i++) {
          let clientVehicule = response.data[i];
          this.ownedCars.push({
            'id': clientVehicule.id,
            'maker': clientVehicule.makeName,
            'model': clientVehicule.modelName,
            'trim': clientVehicule.trimName,
            'year': clientVehicule.trimYear,
            'empty': this.isCustomerVehiculeEmpty(clientVehicule),
            'vehicleMileage': clientVehicule.vehicleMileage,
            'vehicleVin':  clientVehicule.vehicleVin,
            'vehiclePlate': clientVehicule.vehiclePlate,
            'vehicleColor': clientVehicule.vehicleColor
          });

        }

        let selectedCarIndex = -1;
        for(let i = 0; i < this.$get('ownedCars').length; i++) {
          if(this.ownedCars[i].id == selectedVehiculeId) {
            selectedCarIndex = i;
            break;
          }
        }

        this.setSelectedCar(selectedCarIndex);
      })
      .catch((error) => {
        this.$dispatch('danger-notification', { title: 'Internal Error', text: 'Could not fetch the customer\'s vehicules. Please communicate with our support team' });
      });
    },

    getInvoice (invoiceId) {
      const shopId = localStorage.getItem('shop_id');
      invoiceService.getInvoice(shopId, this.invoiceId)
      .then((response) => {
        this.$set('client', response.data.client);
        this.$set('client.id', response.data.client.id);
        this.invoice.id = this.invoiceId;
        this.invoice.invoice_date = moment(response.data.invoice_date).format("YYYY-MM-DD");
        this.invoice.invoice_lines = response.data.invoice_lines;
        this.getOwnedCars(response.data.vehicule.id);

        if (!_.isUndefined(response.data.client.phone2) && !_.isEmpty(response.data.client.phone2)) {
          this.hasPhone2 = true;
          this.displayPhone2();
        }

        this.$nextTick(() => {
          $("#new-customer-phone").mask("(999) 999-9999? x99999");
          $("#new-customer-second-phone").mask("(999) 999-9999? x99999");
        });
      })
      .catch((error) => {
        console.log(error);
      })
    },

    isCustomerVehiculeEmpty (clientVehicule) {
      return clientVehicule.makeName === '' && clientVehicule.modelName === '' &&
        clientVehicule.trimName === '';
    },

    addNewCar () {
      if (this.selectedMaker && this.selectedModel && this.selectedYear) {
        let maker = this.makers.find((maker) => {
          return maker.id === this.selectedMaker;
        });

        let model = this.models.find((model) => {
          return model.id === this.selectedModel;
        });

        let year = this.years.find((year) => {
          return year === this.selectedYear;
        });

        let trim = this.trims.find((trim) => {
          return trim.id === this.selectedTrim;
        });

        const makerName = maker.name || '';
        const modelName = model.name || '';

        let trimName = '';
        if (trim) {
          trimName = trim.name;
        }

        this.ownedCars.push({
          'maker': makerName,
          'model': modelName,
          'year': year,
          'trim': trimName,
          'new': true,
          'empty': false,
          'vehicleMileage': 0,
          'vehicleVin': '',
          'vehiclePlate': '',
          'vehicleColor': ''
        });

        this.setSelectedCar(this.ownedCars.length - 1);
        this.$set('selectedMaker', '');
        this.$set('selectedModel', '');
        this.$set('selectedYear', '');
        this.$set('selectedTrim', '');
        this.$set('isCarModelDisabled', true);
        this.$set('isCarYearDisabled', true);
        this.$set('isCarTrimDisabled', true);

        $('body .car-select-options').each(function() {
          $( this ).select2("val", "");
        });
      }
      else{
        //Message error
      }
    },

    removeCustomerCar (ownedCar) {
      this.ownedCars.$remove(ownedCar)
      this.setSelectedCar(this.ownedCars.length - 1);
    },

    getMakers () {
      carService.getMakers()
      .then((response) => {
        this.$set('makers', response.data);
      })
      .catch((error) => {
        console.log(error);
      })
    },

    getModels () {
      carService.getModels(this.selectedMaker)
      .then((response) => {
        this.$set('models', response.data);
        this.$set('isCarModelDisabled', false);
      })
      .catch((error) => {
        console.log(error);
      })
    },

    getYears () {
      carService.getYears(this.selectedModel)
      .then((response) => {
        const years = _.map(response.data, (el) => {
          return el.year;
        });

        this.$set('years', years);
        this.$set('isCarYearDisabled', false);
      })
      .catch((error) => {
        console.log(error);
      })
    },

    getTrims () {
      carService.getTrims(this.selectedModel, this.selectedYear)
      .then((response) => {
        this.$set('trims', response.data);
        this.$set('isCarTrimDisabled', false);
      })
      .catch((error) => {
        console.log(error);
      })
    },

    setSelectedCar (selectedIndex) {
      const selectedVehicle = this.ownedCars[selectedIndex];
      this.$set('vehicle.mileage', selectedVehicle.vehicleMileage);
      this.$set('vehicle.vin', selectedVehicle.vehicleVin);
      this.$set('vehicle.plate', selectedVehicle.vehiclePlate);
      this.$set('vehicle.color', selectedVehicle.vehicleColor);
      this.$set('selectedCar', selectedIndex);
    },


    submitInvoice () {
      this.invoiceSubmitted = true;
      const hasErrors = this.$repairInvoiceValidation.errors !== undefined || this.invoice.invoice_lines.length === 0;

      if (!hasErrors) {
        if(this.selectedCar < 0){
          // This is for garages with not a lot info on the customer's vehicules
          this.ownedCars.push({'maker': '', 'model': '', 'year': '', 'trim': '', 'new': true, 'empty': true});
          this.selectedCar = this.ownedCars.length - 1;
        }
        this.updateInvoice();
      }
      else{
        if( this.invoice.invoice_lines.length === 0 && this.$repairInvoiceValidation.errors === undefined){
          this.defaultInvoiceLineHasErrors = true;
        }
        else{
          $( "body" ).scrollTop( 0 );
        }
      }
    },

    //////////////////////////// TODO: Refactor, Need to be changed /////////////////////////
    updateInvoice () {
      const shopId = localStorage.getItem('shop_id');
      this.invoiceCalculator();

      /* 
        Since there's an issue with the phone mask library. 
        If a user adds an extension and removes it the library keeps the 'x'.
        We don't need that extra 'x' so we use regex to check if there's actually and extension. 
        That field only supports digits.
      */
      if(!_.isNull(this.client.phone)){
        this.client.phone = _.trim(this.$get('client.phone')).replace(/\x+$/, '');
      }

      if(!_.isNull(this.client.phone2)){
        this.client.phone2 = _.trim(this.$get('client.phone2')).replace(/\x+$/, '');
      }

      const clientPayload = this.$get('client');
      const ownedCar = this.ownedCars[this.selectedCar];
      const clientVehiculePayload = {
        id: ownedCar['id'],
        makeName: ownedCar['maker'],
        modelName: ownedCar['model'],
        trimName: ownedCar['trim'],
        trimYear: ownedCar['year'],
        vehicleMileage: this.vehicle['mileage'],
        vehicleVin: this.vehicle['vin'],
        vehiclePlate: this.vehicle['plate'],
        vehicleColor: this.vehicle['color']
      }

      let clientInvoicePayload = this.$get('invoice');
      clientInvoicePayload.vehicule_id = clientVehiculePayload.id;
      clientInvoicePayload.invoice_date = moment(clientInvoicePayload.invoice_date, "YYYY-MM-DDTHH:mm:ZZ");

      const invoicePayload = {
        "client": clientPayload,
        "vehicule": clientVehiculePayload,
        "invoice": clientInvoicePayload
      }

      invoiceService.updateInvoice(shopId, this.invoiceId, invoicePayload)
      .then((response) => {
        this.invoiceComplete = true;
        this.invoiceSubmitted = false;
        this.$dispatch('confirmation-notification', { title: 'Invoice Created', text: `The invoice for ${this.clientFullName} was created successfully, you can now print it` });
        router.go('/admin/repair-shop/invoices/' + this.invoiceId + '/finalize');
        return;
      })
      .catch((err) => {
        this.$dispatch('danger-notification', { title: 'Internal Error', text: 'Please communicate with our support team' });
      });
    },

    updateInvoiceSimple () {
      const shopId = localStorage.getItem('shop_id');
      this.invoiceCalculator();

      /* 
        Since there's an issue with the phone mask library. 
        If a user adds an extension and removes it the library keeps the 'x'.
        We don't need that extra 'x' so we use regex to check if there's actually and extension. 
        That field only supports digits.
      */
      if(!_.isNull(this.client.phone)){
        this.client.phone = this.$get('client.phone').replace(/\x$/, '');
      }

      if(!_.isNull(this.client.phone2)){
        this.client.phone2 = this.$get('client.phone2').replace(/\x$/, '');
      }

      const clientPayload = this.$get('client');
      const ownedCar = this.ownedCars[this.selectedCar];
      const clientVehiculePayload = {
        id: ownedCar['id'],
        makeName: ownedCar['maker'],
        modelName: ownedCar['model'],
        trimName: ownedCar['trim'],
        trimYear: ownedCar['year'],
        vehicleMileage: this.vehicle['mileage'],
        vehicleVin: this.vehicle['vin'],
        vehiclePlate: this.vehicle['plate'],
        vehicleColor: this.vehicle['color']
      };

      let clientInvoicePayload = this.$get('invoice');
      clientInvoicePayload.vehicule_id = clientVehiculePayload.id;
      clientInvoicePayload.invoice_date = moment(clientInvoicePayload.invoice_date, "YYYY-MM-DDTHH:mm:ZZ");

      const invoicePayload = {
        "client": clientPayload,
        "vehicule": clientVehiculePayload,
        "invoice": clientInvoicePayload
      };

      invoiceService.updateInvoice(shopId, this.invoiceId, invoicePayload)
      .then((response) => {
        this.invoice.invoice_lines = response.data.invoice_lines;
      })
      .catch((error) => {
        this.$dispatch('danger-notification', { title: 'Internal Error', text: 'Please communicate with our support team' });
        console.log(error);
      });
    },

    //////////////////////////// End TODO: Refactor, Need to be changed /////////////////////////

    addNewInvoiceLine () {
      const hasErrors = (this.defaultInvoiceLine.description == "" ||
                         this.defaultInvoiceLine.quatity <= 0 ||
                         _.isNumber(parseFloat(this.defaultInvoiceLine.rate, 10)) === false
                        );

      if (!hasErrors) {
        this.defaultInvoiceLineHasErrors = false;
        let invoiceLineTaxes = {};
        let invoiceTaxes = {};
        let invoiceTaxesTotal = 0.00;
        let subTotal = (this.defaultInvoiceLine.quantity * this.defaultInvoiceLine.rate);

        for (rate in this.shop.taxes) {
          invoiceLineTaxes[rate] = subTotal * this.shop.taxes[rate];
          invoiceTaxesTotal += invoiceLineTaxes[rate];

          if (invoiceTaxes[rate]) {
            invoiceTaxes[rate] += invoiceLineTaxes[rate];
          } else {
            invoiceTaxes[rate] = invoiceLineTaxes[rate];
          }
        }

        let invoiceLines = {
          'description': this.defaultInvoiceLine.description,
          'quantity': this.defaultInvoiceLine.quantity,
          'rate': this.defaultInvoiceLine.rate,
          'subTotal': subTotal,
          'taxes': invoiceLineTaxes,
          'totalTax': invoiceTaxesTotal
        };

        this.invoice.invoice_lines.push(invoiceLines);
        this.$set('defaultInvoiceLine.description', '');
        this.$set('defaultInvoiceLine.quantity', '1');
        this.$set('defaultInvoiceLine.rate', 1);
      }
      else{
        this.defaultInvoiceLineHasErrors = true;
      }
    },

    invoiceCalculator () {
      let invoiceSubTotal = 0;
      let invoiceTaxes = {};
      let invoiceTaxesTotal = 0;
      const invoiceLines = this.$get('invoice.invoice_lines');

      // O(n*m)
      for (let i = 0; i < invoiceLines.length; i++) {
        let invoiceLineTaxes = {};
        let subTotal = (invoiceLines[i].quantity * invoiceLines[i].rate);

        for (let rate in this.shop.taxes) {
          invoiceLineTaxes[rate] = subTotal * this.shop.taxes[rate];
          invoiceTaxesTotal += invoiceLineTaxes[rate];

          if (invoiceTaxes[rate]) {
            invoiceTaxes[rate] += invoiceLineTaxes[rate];
          } else {
            invoiceTaxes[rate] = invoiceLineTaxes[rate];
          }
        }

        invoiceSubTotal += subTotal;
      }

      this.$set('invoice.subTotal', invoiceSubTotal);
      this.$set('invoice.taxes', invoiceTaxes);
      this.$set('invoice.totalTax', invoiceTaxesTotal);
      this.$set('invoice.total', (invoiceSubTotal + invoiceTaxesTotal));
    },

    removeInvoiceLine (invoiceLine) {
      if(_.isUndefined(invoiceLine.id) || _.isUndefined(invoiceLine.invoice_id)){
        this.invoice.invoice_lines.$remove(invoiceLine);
      } else {
        const shopId = localStorage.getItem('shop_id');
        invoiceService.deleteInvoiceLine(shopId, invoiceLine.invoice_id, invoiceLine.id)
        .then((response) => {
          this.invoice.invoice_lines.$remove(invoiceLine);
          this.invoiceCalculator();
          // this.updateInvoiceSimple();
          this.$dispatch('delete-successful', {title: 'Invoice Line Deleted', text: `The invoice line was deleted successfully!`});
        })
        .catch((error) => {
          console.log(error);
        });
      }
    },

    activateCarDefinitions (selectedCarOption) {
      const selectIndex = $(selectedCarOption).data('index');
      const selectedCarOptionIndex = $(selectedCarOption).val();
      switch(selectIndex) {
        case 1 :  this.selectedMaker = parseInt(selectedCarOptionIndex, 10);
                  this.getModels();
          break;
        case 2 :  this.selectedModel = parseInt(selectedCarOptionIndex, 10);
                  this.getYears();
          break;
        case 3 :  this.selectedYear = selectedCarOptionIndex;
                  this.getTrims();
          break;
        case 4 :  this.selectedTrim = parseInt(selectedCarOptionIndex, 10);
          break;
      }
    },

    displayPhone2 () {
      $('body .add-second-phone-btn').tooltip('destroy');
      this.secondPhoneActivate = true;
      this.$nextTick(() => {
        $('body .remove-second-phone-btn').tooltip();
        $('body .remove-second-phone-btn').addClass('active');
        $('body .add-second-phone-btn').removeClass('active');
      });
    },

    removePhone2 () {
      $('body .remove-second-phone-btn').tooltip('destroy');
      this.secondPhoneActivate = false;
      this.$nextTick(() => {
        $('body .add-second-phone-btn').tooltip();
        $('body .remove-second-phone-btn').addClass('active');
        $('body .add-second-phone-btn').removeClass('active');
      });

      if (this.hasPhone) {
        this.removeCustomerSecondPhone();
      }
    },

    removeCustomerSecondPhone () {
      const shopId = localStorage.getItem('shop_id');
      const clientId = this.$get('client.id');
      const clientPayload = {
        id: clientId,
        phone2: ''
      }

      clientService.updateClient(shopId, clientId, {"client": clientPayload})
      .then((response) => {
        this.client.phone2 = '';
        this.hasPhone2 = false;
        this.$dispatch('delete-successful', {title: 'Second phone number Deleted', text: `The second phone number was deleted successfully!`});
      })
      .catch((error) => {
        this.$dispatch('danger-notification', { title: 'Internal Error', text: 'Please communicate with our support team' });
        console.log(error);
      });
    }
  }
}

