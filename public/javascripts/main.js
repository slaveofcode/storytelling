var makeElFullScreen = function(selector) {
  var vpHeight = $(window).height();
  $(selector).height(vpHeight);
}

var makeWeddingBackgroundFull = function () {
  var vpHeight = $('#scene-one').height()
      vpWidth = $('#scene-one').width();

  var imgSrc = 'https://images.unsplash.com/photo-1470322450444-8ccc64987ccf?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w='+vpWidth+'&h='+vpHeight+'&fit=crop&s=0143c240e54dc4df3577a5df7fc6f9fc';
  $('#wedding-background').css({
    background: 'url('+imgSrc+') no-repeat center center fixed',
    width: vpWidth,
    height: vpHeight
  });
}

var normalizeScene = function() {
  var vpWidth = $(window).width(),
      maxWidth = 1280;
  $('#container').width(vpWidth > maxWidth ? maxWidth : vpWidth);
}

var init = function() {
  makeElFullScreen('.scene');
  makeWeddingBackgroundFull();
  normalizeScene();
}

$(document).ready(function() {
  
  init();

  var timeline = new TimelineMax();
  
  var tweenLogo = new TweenMax.to('#logo', 1.2, {
    marginTop: '10vh'
  });
  
  var tween2 = new TweenMax.to('#text-welcome', 1.2, {
    marginLeft: '20vh'
  });
  
  var tween3 = new TweenMax.to('#text-subtitle', 1.2, {
    marginRight: '10vh'
  });
  
  var tween4 = new TweenMax.to('#menu-bar', 1.2, {
    marginTop: 0
  });
  
  timeline.add(tweenLogo);
  timeline.add(tween2);
  timeline.add(tween3);
  timeline.add(tween4);
  
  var ctrl = new ScrollMagic.Controller({
    container: '#canvas'
  });
  
  var sceneOne = new ScrollMagic.Scene({
    triggerElement: '#scene-one'
  })
  .setTween(timeline);
  
  ctrl.addScene([
    sceneOne
  ]);
});