export default {
  ready () {
    this.$on('info-notification', (notificationPayload) => {
      this.notify(notificationPayload.text, notificationPayload.title, 'info', 'right', 'bottom');
    });

    this.$on('success-notification', (notificationPayload) => {
      this.notify(notificationPayload.text, notificationPayload.title, 'success', 'right', 'bottom');
    });

    this.$on('warning-notification', (notificationPayload) => {
      this.notify(notificationPayload.text, notificationPayload.title, 'warning', 'right', 'bottom');
    });

    this.$on('danger-notification', (notificationPayload) => {
      this.notify(notificationPayload.text, notificationPayload.title, 'danger', 'right', 'bottom');
    });

    this.$on('confirmation-notification', (notificationPayload) => {
      this.confirmationNotification(notificationPayload.title, notificationPayload.text);
    });
  },

  methods: {
    notify (message, type, color, align, from) {
      $.growl({
        message: message
      },{
        type: color,
        allow_dismiss: false,
        label: 'Cancel',
        className: 'btn-xs btn-inverse',
        placement: {
          from: from,
          align: align
        },
        delay: 3000,
        animate: {
          enter: 'animated fadeInUp',
          exit: 'animated fadeOutDown'
        },
        offset: {
          x: 30,
          y: 30
        }
    });
  },

  confirmationNotification (title, text, type) {
    swal({
        title: title,
        text: text,
        type: type || 'success',
        timer: 3000,
        showConfirmButton: false
      });
    }
  }
}
