var S, Backsound, debug = true;
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
  displayScrollTop();
}

var displayScrollTop = function() {
  if($('.debug-scroll-top').length == 0) {
    $('body').append('<div class="debug-scroll-top"></div>');
  }

  $('.debug-scroll-top')
    .css({
      position: 'fixed',
      right: 0,
      top: 0,
      background: 'rgba(0,0,0,.5)',
      color: '#ffffff',
      width: 50,
      height: 50,
      textAlign: 'center',
      padding: 20,
      boxSizing: 'border-box'
    })
    .html('<span class="number">'+$(document).scrollTop()+'</span>');
}

var scrolling = function(element, duration) {
  $.scrollTo(element, duration);
}

var makeLeaflots = function(container) {
  var leafSizes = ['medium', 'small'];
  var leafTypes = ['yellow', 'orange', 'red-tail','yellow-tail'];
  for (var i=-10; i<= 40; i++) {
    var size = leafSizes[Math.floor(Math.random()*leafSizes.length)];
    var type = leafTypes[Math.floor(Math.random()*leafTypes.length)];
    var rotation = (Math.floor(Math.random() * 36) + 1) * 10;
    container.append('<div class="sharp-leaf '+ size +' '+ type +' rotate-'+rotation+'" style="top: -90px; left: '+((i * 30) + 10)+'px;"></div>')
  }
}

$(document).ready(function() {
  
  init();

  var sound = new Howl({
    src: ['sound/birdy.webm', 'sound/birdy.mp3'],
    autoplay: false,
    loop: false,
    volume: 1,
  });

  $(document).on('scroll', function() {
    if (!Backsound) {
      sound.play();
      Backsound = sound;
    }

    displayScrollTop();
  })

  $('.top-boundaries').width($(document).outerWidth());

  makeLeaflots($('#scene-two .top-boundaries'));
  
});