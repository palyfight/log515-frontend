import moment from 'moment';
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;

export default class WolverineTemplate {
  constructor (shopLogo, invoicePayload) {
    this.invoicePayload = invoicePayload;
    this.invoiceId = String(this.invoicePayload.id) || "";
    this.client = invoicePayload.client;
    this.vehicule = invoicePayload.vehicule;
    this.shop = invoicePayload.shop;
    this.shop.email = this.shop.email || "";
    this.shop.website = this.shop.website || "";

    this.invoiceDate = moment(this.invoicePayload.invoice_date).format("MMMM Do YYYY");
    this.shopLogo = shopLogo;
    this.taxes = this.shop.shop_legal.taxes;

    if (this.client.phone === "") {
      this.clientPhone = "";
    } else {
      const clientPhone = phoneUtil.parse(this.client.phone, 'CA');
      this.clientPhone = phoneUtil.format(clientPhone, PNF.NATIONAL);
    }

    const that = this;
    const regions = {
      1: {
        1: 'AB',
        2: 'BC',
        3: 'MB',
        4: 'NB',
        5: 'NL',
        6: 'NS',
        7: 'NT',
        8: 'NU',
        9: 'ON',
        10: 'PE',
        11: 'QC',
        12: 'SK',
        13: 'YT'
      }
    };

    const shopRegion = regions[this.shop.country_id][this.shop.region_id];

    this.wolverine = {
      pageSize: 'A4',
      pageMargins: [20, 280, 20, 180],
      header: function(currentPage, pageCount) {
        return {
          width: '100%',
          margin: [20, 20, 20, 0],
          columns:[
            [
              {
                width: '50%',
                image: that.shopLogo,
                fit: [100, 200],
                margin: [5-(pageCount)*5, 5, 5, 5]
              },
              {
                columns: [
                  {
                    width: '50%',
                    margin: [0, 0, 0, 0],
                    table: {
                      widths: ['50%', '50%'],
                      body: [
                        ['', ''],
                        ['', ''],
                        [{text: 'Invoice #', bold: true}, that.invoiceId],
                        [{text: 'Date', bold: true}, that.invoiceDate],
                        ['', ''],
                        ['', '']
                      ]
                    },
                    layout: {
                      hLineWidth: function(i, node) {
                        return 0;
                      },
                      vLineWidth: function(i, node) {
                        if (i === 0) {
                          return 1;
                        }

                        return 0;
                      },
                      vLineColor: function(i, node) {
                        return  '#EEEEEE';
                      },
                      hLineColor: function(i, node) {
                        return  '#EEEEEE';
                      },
                      paddingLeft: function(i) { return 20; },
                      paddingRight: function(i, node) { return 0; },
                      paddingTop: function(i, node) { return 1; },
                      paddingBottom: function(i, node) { return 1; }
                    }
                  }
                ]
              },
              {
                columns: [
                  {
                    width: '50%',
                    margin: [0, 20, 0, 0],
                    table: {
                      widths: ['100%'],
                      body: [
                        [''],
                        [''],
                        [{text: 'Recipient', bold: true}],
                        [''],
                        [that.client.firstName + " " + that.client.lastName],
                        [that.client.email],
                        [that.clientPhone],
                        [''],
                        [''],
                      ]
                    },
                    layout: {
                      hLineWidth: function(i, node) {
                        return 0;
                      },
                      vLineWidth: function(i, node) {
                        if (i === 0) {
                          return 1;
                        }

                        return 0;
                      },
                      vLineColor: function(i, node) {
                        return  '#EEEEEE';
                      },
                      hLineColor: function(i, node) {
                        return  '#EEEEEE';
                      },
                      paddingLeft: function(i) { return 20; },
                      paddingRight: function(i, node) { return 0; },
                      paddingTop: function(i, node) { return 1; },
                      paddingBottom: function(i, node) { return 1; }
                    }
                  },
                  {
                    width: '50%',
                    margin: [0, 20, 0, 0],
                    table: {
                      widths: ['100%'],
                      headerRows: 1,
                      body: [
                        [''],
                        [''],
                        [{text: 'Vehicule', bold: true, alignment: 'right'}],
                        [''],
                        [{text: that.vehicule.trimYear, alignment: 'right'}],
                        [{text: that.vehicule.makeName, alignment: 'right'}],
                        [{text: that.vehicule.modelName, alignment: 'right'}],
                        [{text: that.vehicule.trimName, alignment: 'right'}],
                        [''],
                        [''],
                      ]
                    },
                    layout: {
                      hLineWidth: function(i, node) {
                        return 0;
                      },
                      vLineWidth: function(i, node) {
                        if (i === 1) {
                          return 1;
                        }

                        return 0;
                      },
                      vLineColor: function(i, node) {
                        return  '#EEEEEE';
                      },
                      hLineColor: function(i, node) {
                        return  '#EEEEEE';
                      },
                      paddingLeft: function(i) { return 0; },
                      paddingRight: function(i, node) { return 20; },
                      paddingTop: function(i, node) { return 1; },
                      paddingBottom: function(i, node) { return 1; }
                    }
                  }
                ]
              }
            ],
            {
              width: '50%',
              margins: [0, 0, 0, 0],
              table: {
                widths: ['100%'],
                headerRows: 1,
                body: [
                  [{text: that.shop.name, bold: true, alignment: 'right'}],
                  [{text: that.shop.address1, alignment: 'right'}],
                  [{text: that.shop.city + ' ' + shopRegion + ' ' + that.shop.postal_code, alignment: 'right'}],
                  [{text: that.shop.phone, alignment: 'right'}],
                  [{text: '', alignment: 'right'}],
                  [{text: that.shop.email, alignment: 'right'}],
                  [{text: that.shop.website, alignment: 'right'}],
                ]
              },
              layout: 'noBorders'
            }
          ],
        }
      },
      footer: {
        margin: [20, 0, 20, 80],
        columns: [
          {
            width: '50%',
            table: {
              widths: ['100%'],
              body: [
                [{text: 'Disclaimer', bold: true, alignment: 'center', fillColor: '#EEEEEE'}],
                [{text: that.shop.shop_legal.disclaimer}]
              ]
            },
            layout: 'noBorders'
          },
          {
            width: '50%',
            table: {
              widths: ['100%'],
              body:[
                [{
                  table: {
                    headerRows: 1,
                    widths: ['30%', '30%' ,'*'],
                    body: [
                      ['', '', ''],
                      ['', {text: 'SubTotal', bold: true, fillColor: '#EEEEEE'}, {text: parseFloat(that.invoicePayload.subTotal, 10).toFixed(2) + '$', alignment: 'right', bold: true, fillColor: '#EEEEEE'}],
                      ['', '', ''],
                    ]
                  },
                  layout: {
                    hLineWidth: function(i, node) {
                      return 0;
                    },
                    vLineWidth: function(i, node) {
                      return ( i === 0 || i === 4 ) ? 0: 1;
                    },
                    vLineColor: function(i, node) {
                      return  'white';
                    },
                    hLineColor: function(i, node) {
                      return 'gray';
                    },
                    paddingRight: function(i, node) { return 20; }
                  }
                }],
                [{
                  table: {
                    headerRows: 1,
                    widths: ['30%', '*'],
                    body: that.getTaxes()
                  },
                  layout: 'noBorders'
                }],
                [{
                  table: {
                    headerRows: 1,
                    widths: ['30%', '30%' ,'*'],
                    body: [
                      ['', '', ''],
                      ['', {text: 'Total', bold: true, fillColor: '#EEEEEE'}, {text: parseFloat(that.invoicePayload.total, 10).toFixed(2) + '$', alignment: 'right', bold: true, fillColor: '#EEEEEE'}],
                    ]
                  },
                  layout: {
                    hLineWidth: function(i, node) {
                      return 0;
                    },
                    vLineWidth: function(i, node) {
                      return ( i === 0 || i === 4 ) ? 0: 1;
                    },
                    vLineColor: function(i, node) {
                      return  'white';
                    },
                    hLineColor: function(i, node) {
                      return 'gray';
                    },
                    paddingRight: function(i, node) { return 20; }
                  }
                }],
                [{
                  table: {
                    headerRows: 1,
                    body: [
                      ['', ''],
                      ['', ''],
                      ['', ''],
                      ['GST/HST No.', that.taxes.gst],
                      ['QST No.', that.taxes.qst]
                    ]
                  },
                  layout: 'noBorders'
                }]
              ]
            },
            layout: 'noBorders',
            columnGap: 40
          }
        ]
      },
      content: [
        {
          margin: [0, 0, 20, 0],
          table: {
            headerRows: 1,
            widths: ['20%', '40%', '20%', '20%'],
            body: that.getInvoiceLines()
          },
          layout: {
            hLineWidth: function(i, node) {
              return 0;
            },
            vLineWidth: function(i, node) {
              return ( i === 0 || i === 4 ) ? 0: 1;
            },
            vLineColor: function(i, node) {
              return  'white';
            },
            hLineColor: function(i, node) {
              return 'gray';
            }
          }

        }
      ],
      styles: {
      },
      defaultStyle: {
        fontSize: 10
      }
    };
  }

  getTemplate () {
    return this.wolverine;
  }

  setShopLogo(logo) {
    this.shopLogo = logo;
  }

  getShopLogo () {
    return this.shopLogo;
  }

  getInvoiceLines () {
    const invoiceLines = [
      [{text: 'Quantity', alignment: 'center', fillColor: '#EEEEEE'}, {text: 'Description', alignment: 'center', fillColor: '#EEEEEE'}, {text: 'Rate', alignment: 'center', fillColor: '#EEEEEE'}, {text: 'Amount', alignment: 'center', fillColor: '#EEEEEE'}],
    ];

    _.forEach(this.invoicePayload.invoice_lines, (invoiceLine) => {
      invoiceLines.push([{text: invoiceLine.quantity, alignment: 'center'}, {text: invoiceLine.description, alignment: 'left'}, {text: parseFloat(invoiceLine.rate, 10).toFixed(2) + '$', alignment: 'right'}, {text: parseFloat(invoiceLine.subTotal, 10).toFixed(2) + '$', alignment: 'right'}]);
      invoiceLines.push([{text: ' ', alignment: 'center'}, {text: ' ', alignment: 'left'}, {text: ' ', alignment: 'right'}, {text: ' ', alignment: 'right'}]);
    });

    return invoiceLines;
  }

  getTaxes () {
    const taxes = [
      ['', {text: 'Sales Tax Summary', bold: true, alignment: 'right'}],
    ];

    const taxesValues = {
      'GST': '5.0',
      'QST': '9.975'
    };

    _.forEach(this.invoicePayload.taxes, (value, key) => {
      let taxName = _.toUpper(key);
      let taxRate = String(Math.round(parseFloat(value)*100)/100);

      taxes.push([{text: taxName + '@'+ taxesValues[taxName]  +'%', bold: true}, {text: parseFloat(taxRate, 10).toFixed(2) + '$', alignment: 'right'}])
    });

    const totalTaxRate = String(Math.round(parseFloat(this.invoicePayload.totalTax)*100)/100);
    taxes.push([{text: 'Total Tax', bold: true}, {text: parseFloat(totalTaxRate, 10).toFixed(2) + '$', alignment: 'right'}]);

    return taxes;
  }
};
