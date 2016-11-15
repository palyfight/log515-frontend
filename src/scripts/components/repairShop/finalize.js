import authService from '../../services/auth';
import invoiceService from '../../services/invoice';
import printService from '../../services/print';
import moment from 'moment';

export default {
  ready () {
    this.invoiceId = this.$route.params.id;
    this.getInvoice();
    this.shop = {
      taxes: {"qst": 0.09975, "gst": 0.05}
    };
  },

  data () {
    return {
      client: {
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        phone2: '',
      },
      invoicePayload: {},
      vehicule: {},
      invoice: {
        id: 0,
        vehicule_id: 0,
        invoice_lines: [],
        total: 0.00,
        subTotal: 0.00,
        taxes: {},
        totalTax: 0.00,
        paymentNote: '',
        paymentDetails: '',
        invoiceDate: ''
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
    getInvoice (invoiceId) {
      const shopId = localStorage.getItem('shop_id');
      invoiceService.getInvoice(shopId, this.invoiceId)
      .then((response) => {
        this.$set('invoice', response.data);
        this.$set('vehicule', response.data.vehicule);
        this.$set('client', response.data.client);
        this.$set('client.id', response.data.client.id);
        this.invoice.id = this.invoiceId;
        this.invoice.invoiceDate = moment(response.data.invoice_date).format("DD-MM-YYYY");
        this.invoice.invoice_lines = response.data.invoice_lines;
        this.invoiceCalculator();
      })
      .catch((error) => {
        console.log(error);
      })
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

    printInvoice () {
      let invoicePayload = this.$get('invoice');
      this.$dispatch('info-notification', {title: 'Printing...', text: `You will shortly be able to print ${this.clientFullName}'s invoice.`});
      printService.printInvoice(invoicePayload);
    }
  }
}

