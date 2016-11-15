$(function(){

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

  $('#initialize-search').click(function(){
    $('#chat-search').toggleClass('active').focus();
  });

  $(document).click(function(e) {
    if (($(e.target).closest("#initialize-search").attr("id") != "initialize-search") && $(e.target).closest("#chat-search").attr("id") != "chat-search") {
      $('#chat-search').removeClass('active');
    }
  });

  $(window).mouseover(function() {
    $("#chat-inbox").getNiceScroll().resize();
    $("#chat-content").getNiceScroll().resize();
  });

})
