import authService from '../../services/auth';
import quoteService from '../../services/quote';
import invoiceService from '../../services/invoice';
import printService from '../../services/print';
import moment from 'moment';
import { ScaleLoader } from 'vue-spinner/dist/vue-spinner.min';

export default {
  ready () {
    this.getInvoices();
    this.invoiceTable = {};

    this.shop = {
      taxes: {"qst": 0.09975, "gst": 0.05}
    };

    this.$on('delete-invoice-row', (row) => {
      this.$set('selectedInvoiceRow', _.head(row));
      this.$set('selectedInvoiceIndex', row.index());
    });

    this.invoice = this;
    $('#invoice-preview-modal').on('shown.bs.modal', () => {
      const invoiceId = $('#invoice-preview-modal').data('invoice-id');
      this.$set('selectedInvoiceId', invoiceId);
      this.getInvoicePreview();
    });

    $('#delete-invoice-modal').on('shown.bs.modal', () => {
      const invoiceId = $('#delete-invoice-modal').data('invoice-id');
      this.$set('selectedInvoiceId', invoiceId);
    });

    $('#invoice-preview-modal, #delete-invoice-modal').on('hidden.bs.modal', () => {
      this.initiate();
    });
  },

  components: {
    ScaleLoader
  },

  data () {
    return this.initiate();
  },

  methods: {
    initiate () {
      return {
        loadingColor: "#4e91ff",
        loading: true,
        invoice: {},
        invoices: [],
        selectedInvoiceId: 0,
        selectedInvoiceIndex: 1,
        selectedInvoiceRow: {},
        invoicePayload: {},
        clientFullName: "",
        client: {
          email: "",
          phone: ""
        },
        vehicule: {
          maker: "",
          model: "",
          trim: "",
          year: "",
          empty: true
        },
        invoice: {
          invoice_lines: [],
          total: 0.00,
          subTotal: 0.00,
          taxes: {},
          totalTax: 0.00,
        }
      }
    },

    getInvoices () {
      let that = this;
      const shopId = localStorage.getItem('shop_id');
      invoiceService.getInvoices(shopId)
      .then((response) => {
        let invoices = _.map(response.data, (invoice) => {
          let invoiceDate = '';

          if (invoice.invoice_date) {
            invoiceDate = moment(invoice.invoice_date).format("MMMM Do YYYY");
          }

          let clientFullName = invoice.client.firstName + " " + invoice.client.lastName;
          let clientVehicule = this.getInvoiceVehicule(invoice.vehicule);

          this.invoices.push({
            "id": invoice.id,
            "invoiceDate": moment(invoice.invoice_date).format("YYYY-MM-DD") || "",
            "fullName": clientFullName || "",
            "phone": invoice.client.phone || "",
            "email": invoice.client.email || "",
            "vehicule": clientVehicule || "",
            "subTotal": invoice.subTotal || "", 
          });
        });

        var grid = $("#data-table-command-invoices").bootgrid({
            caseSensitive: false,
            rowCount: [10, 25, 100],
            css: {
                icon: 'zmdi icon',
                iconColumns: 'zmdi-view-module',
                iconDown: 'zmdi-sort-amount-desc',
                iconRefresh: 'zmdi-refresh',
                iconUp: 'zmdi-sort-amount-asc'
            },
            formatters: {
                "commands": function(column, row)
                {
                  let editUrl = config.app.base_url + `/#/admin/repair-shop/invoices/${row.id}`;
                  return `<button type="button" class="btn btn-icon command-edit waves-effect waves-circle show-invoice-preview m-r-5" data-toggle="modal"  data-placement="top" title="Preview" data-target="#invoice-preview-modal" data-invoice-id="${row.id}" data-edit-link="${editUrl}"><span class="zmdi zmdi-eye"></span></button>
                          <a type="button" class="btn btn-icon command-edit waves-effect waves-circle m-r-5" href="${editUrl}" data-placement="top" title="Edit"><span class="zmdi zmdi-edit"></span></a>
                          <button data-invoice-id="${row.id}" data-row-id="${row.id}" class="btn btn-icon command-delete waves-effect waves-circle bgm-red delete-invoice m-r-5" data-placement="top" title="Delete"><span class="zmdi zmdi-delete"></span></button>`;
                }
            }
        }).bootgrid("append", this.invoices).bootgrid().on("loaded.rs.jquery.bootgrid", function (e)
        {
          $("#btn-invoice-edit").on('click', function(){
            $('#invoice-preview-modal').modal('hide');
          });

          $('.show-invoice-preview').on('click', function() {
            const invoiceId = $(this).data('invoice-id');
            const invoiceEditLink = $(this).data('edit-link');
            $('#invoice-preview-modal').data('invoice-id', invoiceId);
            $('#invoice-preview-modal .btn-invoice-edit').attr("href", invoiceEditLink);
            $('#invoice-preview-modal').modal('show');
          });
        });

        $("#data-table-command-invoices").on("loaded.rs.jquery.bootgrid", function()
        {
            grid.find(".command-delete").on("click", function(e)
            {
              let commandDelete = this;
              swal({
              title: "Are you sure?",
              text: "You will not be able to recover this invoice!",   
              type: "warning",   
              showCancelButton: true,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "Yes, delete it!",   
              cancelButtonText: "No, cancel!",   
              closeOnConfirm: true,   
              closeOnCancel: true 
              }, function(isConfirm){   
                  if (isConfirm) {  
                    const shopId = localStorage.getItem('shop_id');
                    let invoiceRow = $(commandDelete).data("row-id");
                    invoiceService.deleteInvoice(shopId, invoiceRow)
                    .then((response) => {
                      var rows = Array();
                      rows[0] = invoiceRow;
                      $("#data-table-command-invoices").bootgrid('remove', rows);
                      swal("Deleted!", "The invoice was successfuly removed.", "success"); 
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                  } 
              });
            });
        });
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
      });
    },

    printInvoice () {
      let invoicePayload = this.$get('invoice');
      this.$dispatch('info-notification', {title: 'Printing...', text: `You will shortly be able to print ${this.clientFullName}'s invoice.`});
      printService.printInvoice(invoicePayload);
    },

    getInvoicePreview () {
      const shopId = localStorage.getItem('shop_id');
      invoiceService.getInvoice(shopId, this.selectedInvoiceId)
      .then((response) => {
        this.$set('invoice', response.data);
        this.$set('client', response.data.client);
        this.$set('client.id', response.data.client.id);
        this.$set('clientFullName', response.data.client.firstName + " " + response.data.client.lastName);
        this.invoice.id = this.selectedInvoiceId;
        this.invoice.invoiceDate = moment(response.data.invoice_date).format("YYYY-MM-DD");
        this.invoice.invoice_lines = response.data.invoice_lines;

        const clientVehicule = response.data.vehicule;
        this.$set('vehicule.maker', clientVehicule.makeName);
        this.$set('vehicule.model', clientVehicule.modelName);
        this.$set('vehicule.trim', clientVehicule.trimName);
        this.$set('vehicule.year', clientVehicule.trimYear);
        this.$set('vehicule.empty', this.isCustomerVehiculeEmpty(clientVehicule));
        this.invoiceCalculator ();
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
      for (i = 0; i < invoiceLines.length; i++) {
        let invoiceLineTaxes = {};
        let subTotal = (invoiceLines[i].quantity * invoiceLines[i].rate);

        for (rate in this.shop.taxes) {
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

    isCustomerVehiculeEmpty (clientVehicule) {
      return clientVehicule.makeName === '' && clientVehicule.modelName === '' &&
        clientVehicule.trimName === '';
    },

    getInvoiceVehicule (invoiceVehicule) {
      if (invoiceVehicule.trimYear !== '' && invoiceVehicule.makeName !== '' &&
          invoiceVehicule.modelName !== '')  {
        return invoiceVehicule.trimYear + " " + invoiceVehicule.makeName + " " +
        invoiceVehicule.modelName + "<br>" + invoiceVehicule.trimName;
      }
      else {
        return "No Vehicle Information Provided";
      }
    },
  }
}
