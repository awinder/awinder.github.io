$(document).ready(function() {
  var footer = function() { if (($('.row-fluid.mainbody').height()) < $(window).height()) { $('.row-fluid.mainbody').css('height', $(window).height() - $('.row.header').height() - $('footer').height() - 30);}};
  //$(window).on('resize', footer);
  //footer();
});