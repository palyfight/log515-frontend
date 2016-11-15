import auth from '../../services/auth';
import customerService from '../../services/client';
import { ScaleLoader } from 'vue-spinner/dist/vue-spinner.min';

export default {
  ready () {
    this.getCustomers();
    this.customerTable = {};
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
        customers: [],
        customer: {
          firstname: '',
          lastname: '',
          email: '',
          company: '',
          phone: '',
          phone2: '',
        }
      }
    },

    getCustomers () {
      const shopId = localStorage.getItem('shop_id');
      customerService.getCustomers(shopId)
      .then((response) => {
        let customers = _.map(response.data, (customer) => {
          this.customers.push({
            "id": customer.id,
            "firstName": customer.firstName || "",
            "lastName": customer.lastName || "",
            "phone": customer.phone || "",
            "phone2": customer.phone2 || "",
            "email": customer.email || ""
          });
        });

        $("#data-table-command-customers").bootgrid({
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
                "commands": function(column, row) {
                  let showUrl = config.app.base_url + `/#/admin/customers/show/${row.id}`;
                  return `<a href="${showUrl}" type="button" class="btn btn-icon command-edit waves-effect waves-circle bgm-cyan m-r-5" data-row-id="${row.id}"><span class="zmdi zmdi-eye"></span></a>`;
                }
            }
        }).bootgrid("append", this.customers);
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
      });
    },
  }
}
