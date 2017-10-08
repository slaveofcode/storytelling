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

// var sceneOne = function() {
//   var timeline = new TimelineMax();
  
//   var tweenLogo = new TweenMax.to('#logo', 1.2, {
//     marginTop: '10vh'
//   });
  
//   var tween2 = new TweenMax.to('#text-welcome', 1.2, {
//     marginLeft: '20vh'
//   });
  
//   var tween3 = new TweenMax.to('#text-subtitle', 1.2, {
//     marginRight: '10vh'
//   });
  
//   var tween4 = new TweenMax.to('#menu-bar', 1.2, {
//     marginTop: 0
//   });
  
//   timeline.add(tweenLogo);
//   timeline.add(tween2);
//   timeline.add(tween3);
//   timeline.add(tween4);

//   var sceneOne = new ScrollMagic.Scene({
//     triggerElement: '#scene-one'
//   })
//   .setTween(timeline);

//   return sceneOne;
// }

$(document).ready(function() {
  
  init();

//   var ctrl = new ScrollMagic.Controller({
//     container: '#canvas'
//   });
  
//   ctrl.addScene([
//     sceneOne()
//   ]);
});