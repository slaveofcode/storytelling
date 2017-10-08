var S;
var makeElFullScreen = function(selector) {
  var vpHeight = $(window).height();
  $(selector).height(vpHeight);
}

var makeWeddingBackgroundFull = function () {
  var vpHeight = $('#scene-one').height()
      vpWidth = $('#scene-one').width();

  var imgSrc = 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w='+vpWidth+'&h='+vpHeight+'&fit=crop&s=4df8f538129b1a78f3c80c9834d67442';
  $('#wedding-background').css({
    background: 'url('+imgSrc+') no-repeat center center fixed',
    width: vpWidth,
    height: vpHeight
  });
}

var init = function() {
  S = skrollr.init();
  makeElFullScreen('.scene');
  makeWeddingBackgroundFull();
}

$(document).ready(function() {
  
  init();

});