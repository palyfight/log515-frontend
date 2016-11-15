$(function (){
  function liveClock () {
    var dateField = $('#timer .date');
    var timeField = $('#timer .time');
    var yearField = $('#date-widget .cwh-year');
    var dayField = $('#date-widget .cwh-day');
    dateField.text(moment().format('MMMM DD YYYY'));
    timeField.text(moment().format('LTS'));
    yearField.text(moment().format('YYYY'));
    dayField.text(moment().format('dddd, MMM D'));
    setTimeout(liveClock, 1000);
  }
  liveClock();
});
