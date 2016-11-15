import auth from '../../services/auth';
import Calendar from '../../services/calendar';
import Client from '../../services/client';
const momentTz = require('moment-timezone');

export default {
  ready () {
    let date = new Date();
    let d = date.getDate();
    let m = date.getMonth();
    let y = date.getFullYear();
    let calendar = $('#calendar');
    let that = this;

    $("#appointment-new-user-phone").mask("(999) 999-9999? x99999");
    $("#appointment-edit-user-phone").mask("(999) 999-9999? x99999");

    //Generate the Calendar
    calendar.fullCalendar({
      header: {
        right: '',
        center: 'prev, title, next',
        left: ''
      },
      theme: true,
      selectable: true,
      selectHelper: true,
      editable: true,
      events: [],
      timeFormat: 'HH:mm',
      //On Day Select
      select: (start, end, allDay) => {
        this.openAppointmentModal(start.format('YYYY-MM-DD HH:mm'));
      },
      eventMouseover: function(calEvent, jsEvent) {
          var tooltip = '<div class="card tooltipevent">' +
                          '<div class="card-header bgm-not" style="background-color: ' + calEvent.color + '";>' +
                            '<h6>' + calEvent.title + '</h6>' +
                            '<h5>' + moment(calEvent.start).format("DD MMM YYYY HH:mm") + '</h5>' +
                          '</div>' +
                          '<div class="card-body card-padding">' +
                             calEvent.description +
                          '</div>' +
                        '</div>';
          $("body").append(tooltip);
          $(this).mouseover(function(e) {
            $(this).css('z-index', 10000);
            $('.tooltipevent').fadeIn('500');
            $('.tooltipevent').fadeTo('10', 1.9);
          }).mousemove(function(e) {
            $('.tooltipevent').css('top', e.pageY + 10);
            $('.tooltipevent').css('left', e.pageX + 20);
          });
      },
      eventMouseout: function(calEvent, jsEvent) {
        $(this).css('z-index', 8);
        $('.tooltipevent').remove();
      },
      eventClick: function(calEvent, jsEvent, view) {
        that.getEvent(calEvent.eventId);
        that.fullCalendarSelectedEventId = calEvent._id;
        that.selectedEvent = calEvent;
        that.selectedDate = moment(calEvent.start.toDate()).format('MMMM D YYYY');
        that.appointment.time = moment(calEvent.start.toDate()).format("hh:mm a");
        $('#event-edit-modal').modal('show');
      },
      viewRender: function(view, element){
        let month = moment(view.start._d).month();
        let year = moment(view.start._d).year();

        that.loadCalendar((month + 1), year);
      }
    });

    $('#event-modal, #event-edit-modal').on('hidden.bs.modal', () => {
      this.resetForm();
    });

    $('#event-modal, #event-edit-modal').on('shown.bs.modal', () => {
      $('.date-picker').val(this.appointment.date);
      $('.time-picker').val(this.appointment.time);
    });

    var actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
                      '<li class="dropdown">' +
                        '<a href="" data-toggle="dropdown"><i class="zmdi zmdi-more-vert"></i></a>' +
                        '<ul class="dropdown-menu dropdown-menu-right">' +
                          '<li class="active">' +
                              '<a data-view="month" href="">Month View</a>' +
                          '</li>' +
                          '<li>' +
                              '<a data-view="basicWeek" href="">Week View</a>' +
                          '</li>' +
                          '<li>' +
                              '<a data-view="basicDay" href="">Day View</a>' +
                          '</li>' +
                        '</ul>' +
                      '</div>' +
                    '</li>';
    calendar.find('.fc-toolbar').append(actionMenu);

    //Event Tag Selector
    $('body').on('click', '.event-tag > span', function(){
      $('.event-tag > span').removeClass('selected');
      $(this).addClass('selected');
      that.appointment.color = $(this).data('color');
    });

    //Calendar views
    $('body').on('click', '#fc-actions [data-view]', function(e){
      e.preventDefault();
      const dataView = $(this).attr('data-view');

      $('#fc-actions li').removeClass('active');
      $(this).parent().addClass('active');
      calendar.fullCalendar('changeView', dataView);
    });

    $('.time-picker').datetimepicker({
        format: 'HH:mm',
    });

    $('.date-picker').datetimepicker({
        format: 'MMMM D YYYY',
    })
    .on("dp.change", (e) => {
      this.selectedDate = e.date;
    });

    this.loadCalendar((m + 1), y);
  },

  data: function () {
      return this.initialState();
  },

  methods: {
    initialState () {
      return {
        month_appointments: [],
        calendarFormSubmitted: false,
        appointment: {
          id: '',
          client: {
            id: '',
            firstName: '',
            lastName: '',
            phone: '',
            email: ''
          },
          date: moment().toDate(),
          time: moment().format('HH:mm'),
          description: '',
          color: '#009688'
        },
        selectedDate: {},
        selectedDay: '',
        selectedMonth: '',
        selectedYear: '',
        dateSelected: false,
        selectedEvent: {},
        fullCalendarSelectedEventId: '',
        events: []
      }
    },

    resetForm () {
      this.$set('appointment.client.firstName', '');
      this.$set('appointment.client.lastName', '');
      this.$set('appointment.client.phone', '');
      this.$set('appointment.client.email', '');
      this.$set('appointment.date', moment().format());
      this.$set('appointment.time', moment(new Date()).format('HH:mm a'));
      this.$set('appointment.description', '');
      this.$set('appointment.color', '#009688');
      this.$set('calendarFormSubmitted', false);
    },

  	createAppointment () {
      this.calendarFormSubmitted = true;
      const hasErrors = this.$eventValidation.errors !== undefined;

      if (!hasErrors) {
        const shopId = localStorage.getItem('shop_id');
        const calendarService = new Calendar();
        let newEvent = new Object();
        let hours = this.appointment.time.split(':')[0];
        let minutes = (this.appointment.time.split(':')[1]).split(' ')[0];
        let meridiem = (this.appointment.time.split(':')[1]).split(' ')[1];
        let phone = this.$get('appointment.client.phone').replace(/\x$/, '');
        let customerFullName = this.appointment.client.firstName + ' ' + this.appointment.client.lastName;
        let appointmentDate = moment(this.selectedDate, "MMMM D YYYY").add(hours, 'h').add(minutes, 'm').add(meridiem,'a');
        appointmentDate = appointmentDate.toDate();
        this.dateSelected = true;

        newEvent.title = `Appointment with ${customerFullName}`;
        newEvent.start = appointmentDate;
        newEvent.allDay = false;
        newEvent.color = this.appointment.color;
        newEvent.description = `<i class="zmdi zmdi-account"></i> ${customerFullName} <br>
                                <i class="zmdi zmdi-phone"></i> ${phone} <br>
                                <i class="zmdi zmdi-email"></i> ${this.appointment.client.email}`;

        const customerPayload = {
          client: {
            firstName: this.appointment.client.firstName,
            lastName: this.appointment.client.lastName,
            phone: phone,
            email: this.appointment.client.email
          }
        }

        Client.findOrCreateUserByPhone(shopId, customerPayload)
        .then((response) => {
          const appointmentPayload = {
            title: newEvent.title,
            idClient: response.data.id,
            phone: phone,
            shopId: shopId,
            commentary: this.appointment.description,
            color: this.appointment.color,
            date_start: appointmentDate.toString()
          }

          calendarService.createAppointment(shopId, appointmentPayload)
          .then((response) => {
            newEvent.eventId = response.data[0];
            this.events.push(newEvent);
            $('#calendar').fullCalendar("removeEvents");
            $('#calendar').fullCalendar('addEventSource', this.events);
            this.$dispatch('success-notification', {title: 'Appointment Created', text: `The Appointment with ${customerFullName}, was created successfully!`});
            this.calendarFormSubmitted = false;
            $('#event-modal').modal('hide');
            this.resetForm();
          })
          .catch((error) => {
            this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
          })
        })
        .catch((error) => {
          this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
        });
      }
  	},

    openAppointmentModalWithoutDate() {
      let start = moment().format();
      this.openAppointmentModal(start);
    },

    openAppointmentModal (start) {
      let eventDate = moment(start, "YYYY-MM-DD hh:mm");
      let appointmentDateTime = new Date(eventDate.year(), eventDate.month(), eventDate.date(), eventDate.hour(), eventDate.minutes());
      this.appointment.date = moment(appointmentDateTime).format('MMM D YYYY');
      this.selectedDate = moment(appointmentDateTime).format('MMM D YYYY');
      this.appointment.time = moment(appointmentDateTime).format("hh:mm");
      $('#event-modal').modal('show');
    },

    getEvent (eventId) {
      const shopId = localStorage.getItem('shop_id');
      const calendarService = new Calendar();

      calendarService.getAppointment(shopId, eventId)
      .then((response) => {
        _.each(response.data, (event) => {
          Client.getCustomer(shopId, event.idClient)
          .then((response) => {
            this.$set('appointment.client.id', event.idClient);
            this.$set('appointment.client.firstName', response.data.firstName);
            this.$set('appointment.client.lastName', response.data.lastName);
            this.$set('appointment.client.phone', response.data.phone);
            this.$set('appointment.client.email', response.data.email);
          })
          .catch((error) => {
            this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
          });

          this.$set('appointment.id', eventId);
          this.$set('appointment.title', event.title);
          this.$set('appointment.date', moment(event.date_start).format('MMMM D YYYY'));
          this.$set('appointment.time', moment(event.date_start).format('HH:mm a'));
          this.$set('appointment.description', event.description);
          this.$set('appointment.color', event.color);
        });
      })
      .catch((error) => {
        this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
      })
    },

    loadCalendar (month, year) {
      const shopId = localStorage.getItem('shop_id');
      const calendarService = new Calendar();
      this.events = [];

      calendarService.getMonthAppointments(shopId, month, year)
      .then((response) => {

        let events = _.map(response.data, (event) => {
          let newEvent = new Object();
          let appointmentDateTime = new Date(event.date_start);

          newEvent.start = appointmentDateTime;
          newEvent.allDay = false;
          newEvent.color = event.color;
          newEvent.eventId = event.id;

          Client.getCustomer(shopId, event.idClient)
          .then((response) => {
            let id = response.data.id;
            let fullName = response.data.firstName + " " + response.data.lastName;
            let email = response.data.email;
            let phone = response.data.phone;

            newEvent.title = event.title;
            newEvent.description = `<i class="zmdi zmdi-account"></i> ${fullName} <br>
                                    <i class="zmdi zmdi-phone"></i> ${phone} <br>
                                    <i class="zmdi zmdi-email"></i> ${email}`;
            this.events.push(newEvent);

            $('#calendar').fullCalendar("removeEvents");
            $('#calendar').fullCalendar('addEventSource', this.events);
          })
          .catch((error) => {
            this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
          });
        });
      })
      .catch((error) => {
        this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
      })
    },

    editAppointment () {
      this.calendarFormSubmitted = true;
      const hasErrors = this.$eventValidation.errors !== undefined;

      if (!hasErrors) {
        const shopId = localStorage.getItem('shop_id');
        const calendarService = new Calendar();
        let newEvent = new Object();
        let hours = this.appointment.time.split(':')[0];
        let minutes = (this.appointment.time.split(':')[1]).split(' ')[0];
        let meridiem = (this.appointment.time.split(':')[1]).split(' ')[1];
        let phone = this.$get('appointment.client.phone').replace(/\x$/, '');
        let customerFullName = this.appointment.client.firstName + ' ' + this.appointment.client.lastName;

        console.log(this.selectedDate);
        let appointmentDate = moment(this.selectedDate, "MMMM D YYYY").add(hours, 'h').add(minutes, 'm').add(meridiem,'a');
        appointmentDate = appointmentDate.toDate();

        this.dateSelected = true;
        const appointmentPayload = {
          id: this.appointment.id,
          title: this.appointment.title,
          idClient: this.appointment.client.id,
          phone: phone,
          shopId: shopId,
          commentary: this.appointment.description,
          color: this.appointment.color,
          date_start: appointmentDate.toString()
        }

        calendarService.updateAppointment(shopId, appointmentPayload)
        .then((response) => {
          this.selectedEvent.title = `Appointment with ${customerFullName}`;
          this.selectedEvent.start = appointmentDate;
          this.selectedEvent.allDay = false;
          this.selectedEvent.color = this.appointment.color;
          this.selectedEvent.description = `<i class="zmdi zmdi-account"></i> ${customerFullName} <br>
                                            <i class="zmdi zmdi-phone"></i> ${phone} <br>
                                            <i class="zmdi zmdi-email"></i> ${this.appointment.client.email}`;

          $('#calendar').fullCalendar('updateEvent', this.selectedEvent);
          this.events.push(this.selectedEvent);
          $('#event-edit-modal').modal('hide');
          this.$dispatch('success-notification', {title: 'Appointment Created', text: `The Appointment with ${customerFullName}, was created successfully!`});
          this.calendarFormSubmitted = false;
          that.fullCalendarSelectedEventId = '';
          that.selectedEvent = {};
          this.resetForm();
        })
        .catch((error) => {
          this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
        })
      }
    },

    deleteAppointment () {
      const shopId = localStorage.getItem('shop_id');
      const calendarService = new Calendar();
      const appointmentPayload = {
        id: this.selectedEvent.eventId,
      }

      calendarService.deleteAppointment(shopId, appointmentPayload)
      .then((response) => {
        $('#event-edit-modal').modal('hide');
        $('#calendar').fullCalendar('removeEvents', this.fullCalendarSelectedEventId );
        this.$dispatch('success-notification', {title: 'Appointment Deleted', text: `The Appointment was deleted successfully!`});
        that.$set('fullCalendarSelectedEventId', '');
        that.$set('selectedEvent', {});
      })
      .catch((error) => {
        this.$dispatch('app-error', { title: 'Internal Error', text: 'Please communicate with our support team' });
      })
    },
  }
}
