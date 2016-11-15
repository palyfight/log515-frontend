
export default {
  ready () {
    //App.init();
    $('[data-toggle="counter"]').each(function(i, e){
      let userid = localStorage.getItem('userid');
    });
  },

  data () {
    return {
      error: '',
      displayDashboard: false
    }
  },

  methods: {
    submit () {
    },

  }
}
