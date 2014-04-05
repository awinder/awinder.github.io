//= require jquery.min
//= require bootstrap.min.js
//= require prism
$(document).on('ready', function() {
  $('.navbar-toggle').on('click', function() {
    var icon = $('.navbar-toggle i');
    if (icon.hasClass('fa-chevron-down')) {
      icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
    } else {
      icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
    }
  });
});
