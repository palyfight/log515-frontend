import auth from '../../services/auth';


export default {
  ready() {
    this.socket = new WebSocket(`ws://localhost:1738/chat?user=${localStorage.getItem("username")}/`);
    this.socket.onopen = function (event) { 
      console.log("Connection WebSocket Established");
    }

    this.socket.onmessage = (message) => {
        const payload = JSON.parse(message.data)
        if(payload.userlist.indexOf(localStorage.getItem("username")) != 0)
        {
          this.messages.push({ message: payload.userMessage, name: payload.userlist.replace("/",""), type: 'message received'});
        }
    }

    var contentHeight = $('#content').height();
    var chatInboxHeight = contentHeight - 178;
    var chatContentHeight = contentHeight - 178 - 200;

    var setChatHeight = function() {
      $('#chat-inbox').css('height', chatInboxHeight);
      $('#chat-content').css('height', chatContentHeight);
    };

    setChatHeight();

    $(window).resize(function() {
      contentHeight = $('#content').height();
      chatInboxHeight = contentHeight - 178;
      chatContentHeight = contentHeight - 178 - 200;
      setChatHeight();
    });

    $("#chat-inbox").niceScroll({
      cursorcolor: '#000000',
      zindex: 999999,
      bouncescroll: true,
      cursoropacitymax: 0.4,
      cursorborder: '',
      cursorborderradius: 0,
      cursorwidth: '5px'
    });

    $("#chat-content").niceScroll({
      cursorcolor: '#000000',
      zindex: 999999,
      bouncescroll: true,
      cursoropacitymax: 0.4,
      cursorborder: '',
      cursorborderradius: 0,
      cursorwidth: '5px'
    });

    $('#chat-inbox .chat-actions > span').tooltip({
      placement: 'top',
      trigger: 'hover',
      html : true,
      container: 'body'
    });

    $(window).mouseover(function() {
      $("#chat-inbox").getNiceScroll().resize();
      $("#chat-content").getNiceScroll().resize();
    });
  },
  data: function () {
       return {
         socket: '',
         message: '',
         username: localStorage.getItem("username"),
         messages: []
      }
  },
  methods: {
    sendMessage() {
        this.socket.send(this.message);
        this.messages.push({ message: this.message, name: this.username, type: 'message sent'});
        this.message = "";
    }
  } 
} 
