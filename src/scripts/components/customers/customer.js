import auth from '../../services/auth';
import customerService from '../../services/client';
import vehicleService from '../../services/vehicle';
import moment from 'moment';

export default {
  ready () {
    this.getCustomer();
  },

  data () {
    return this.initiate();
  },

  methods: {
    initiate () {
      return {
        customer: {
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          phone: '',
          phone2: '',
          ownedCars: []
        },
        customersInvoices: []
      }
    },

    createInvoiceWithCar (vehiculeId) {
      this.$router.go({
        path: '/admin/repair-shop/create',
        query: {
          'customerId': this.customer.id,
          'vehiculeId': vehiculeId
        }
      });
    },

    updateVehicleDetails (clientId, vehicleId, index) {
      const customerInvoice = this.customersInvoices[index];
      const vehiclePayload = {
        'vehicleMileage': parseInt(customerInvoice.vehicule.vehicleMileage, 10) || 0,
        'vehicleVin': customerInvoice.vehicule.vehicleVin || "",
        'vehiclePlate': customerInvoice.vehicule.vehiclePlate || "",
        'vehicleColor': customerInvoice.vehicule.vehicleColor || ""
      };

      vehicleService.updateVehicleDetails(clientId, vehicleId, vehiclePayload)
        .then((response) => {
          this.$dispatch('success-notification', { title: 'Vehicle Details', text: `The vehicle details were updated successfully.` });
        })
        .catch((err) => {
          this.$dispatch('danger-notification', { title: 'Vehicle Details', text: `The vehicle details were updated successfully.` });
        });
    },

    getCustomer () {
      const shopId = localStorage.getItem('shop_id');
      const customerId = this.$route.params.id;

      customerService.getCustomer(shopId, customerId)
        .then((response) => {
          this.$set('customer.id', response.data.id);
          this.$set('customer.firstName', response.data.firstName);
          this.$set('customer.lastName', response.data.lastName);
          this.$set('customer.email', response.data.email);
          this.$set('customer.company', response.data.company);
          this.$set('customer.phone', response.data.phone);
          this.$set('customer.phone2', response.data.phone2);

          _.forEach(response.data.invoices, (invoice) => {
            let customerInvoiceIndex = _.findIndex(this.customersInvoices, _.matchesProperty('vehiculeId', invoice.vehicule.id));

            // If we don't find an invoice for that vehicule
            // we need to create one.
            if (customerInvoiceIndex === -1) {
              let customerInvoice = {
                vehiculeId: invoice.vehicule.id,
                vehicule: invoice.vehicule,
                invoices: [{
                  vehicleMileage: parseInt(invoice.vehicleMileage, 10) > 0 ? parseInt(invoice.vehicleMileage, 10) : '' ,
                  invoiceDate: _.isNil(invoice.invoice_date) ? "" : moment(invoice.invoice_date).format('MMMM Do YYYY'),
                  invoiceLines: invoice.invoice_lines,
                  amount: parseFloat(invoice.subTotal, 10).toFixed(2)
                }]
              };

              this.customersInvoices.push(customerInvoice);
            } else {
              let customerInvoiceDateIndex = _.findIndex(this.customersInvoices[customerInvoiceIndex].invoices, _.matchesProperty('invoiceDate', moment(invoice.invoice_date).format('MMMM Do YYYY')));

              // We also need to check that there's not an invoice for that same day.
              if (customerInvoiceDateIndex === -1) {
                this.customersInvoices[customerInvoiceIndex].invoices.push({
                  vehicleMileage: parseInt(invoice.vehicleMileage, 10) > 0 ? parseInt(invoice.vehicleMileage, 10) : '' ,
                  invoiceDate: _.isNil(invoice.invoice_date) ? "" : moment(invoice.invoice_date).format('MMMM Do YYYY'),
                  invoiceLines: invoice.invoice_lines,
                  amount: invoice.subTotal
                });
              } else {
                this.customersInvoices[customerInvoiceIndex].invoices[customerInvoiceDateIndex].invoiceLines = _.concat(this.customersInvoices[customerInvoiceIndex].invoices[customerInvoiceDateIndex].invoiceLines, invoice.invoice_lines);
                this.customersInvoices[customerInvoiceIndex].invoices[customerInvoiceDateIndex].amount = parseFloat(parseFloat(this.customersInvoices[customerInvoiceIndex].invoices[customerInvoiceDateIndex].amount, 10) + parseFloat(invoice.subTotal, 10)).toFixed(2);
              }
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  }
}
