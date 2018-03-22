//Use Strict Mode
(function($) {
  "use strict";

  var windowHeight = $(window).height(),
    commentsLoaded = false,
    commentPage = 1;

  function adjustViewport() {
    windowHeight = $(window).height();
    $(".viewport").css("min-height", windowHeight);
    return false;
  }

  function AdjustingBannerSpacing() {
    var HeaderHeight = $("#header").outerHeight();
    var BannerPadding = windowHeight - HeaderHeight;
    $(".main-carousel .slide-inner").css("padding-top", HeaderHeight);
  }

  $(".loading-wrapper")
    .css({ visibility: "visible" })
    .animate({ opacity: "1" }, 600);

  //Begin - Window Load
  $(window).on("load", function() {
    //loader and Intro Animations
    $("#page-loader")
      .delay(2000)
      .fadeOut(400, function() {
        //     var switchModal = $("#desktop-modal");
        //     if (switchModal.length > 0) {
        //       $("#desktop-modal").modal("show");
        //     }
      });

    // Calling functions here
    adjustViewport();
    AdjustingBannerSpacing();
  });

  //Runs on window Resize
  $(window).on("resize", function() {
    adjustViewport();
  });

  //Begin - Document Ready
  $(document).ready(function() {
    //WAYPOINTS
    $("#content").waypoint(
      function(direction) {
        if (direction === "down") {
          $("#masthead").addClass("header-stick");
          $("#back-to-top").removeClass("back-to-top-hide");
          $("#music-control").addClass("with-back-top");
        } else {
          $("#masthead").removeClass("header-stick");
          $("#back-to-top").addClass("back-to-top-hide");
          $("#music-control").removeClass("with-back-top");
        }
      },
      {
        offset: "-20px"
      }
    );

    //Bootstrap menu on hover
    $(".dropdown").on("mouseenter", function() {
      $(this).addClass("open");
      return false;
    });

    $(".dropdown").on("mouseleave", function() {
      $(this).removeClass("open");
      return false;
    });

    //Back to Top Btn
    $(".back-to-top").on("click", function() {
      $("html, body").animate(
        {
          scrollTop: 0
        },
        700
      );
      return false;
    });

    //Anchor Smooth Scroll
    $('a[href*="#"]:not([href="#"])').on("click", function() {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          $("html, body").animate(
            {
              scrollTop: target.offset().top
            },
            1000
          );
          return false;
        }
      }
    });

    // Mobile Menu Js
    $("#MobileMenu").on("click", function() {
      var HeaderHeight = $("#header").outerHeight();
      $(this).toggleClass("menu-clicked");
      $("#main-navigation")
        .css("top", HeaderHeight)
        .stop(0, 0)
        .slideToggle();
      $("#main-navigation a").on("click", function() {
        $("#MobileMenu")
          .stop(0, 0)
          .trigger("click");
      });
    });

    //Hero Slider
    var mainSlider = $(".main-carousel");

    // mainSlider.on("initialized.owl.carousel", function(e) {
    //   $(".slide-title").addClass("active");
    //   $(".slide-icon").addClass("active");
    //   $(".slide-text").addClass("active");
    //   $(".featured-slide .primary-btn").addClass("active");
    //   $(".main-carousel")
    //     .removeClass("owl-loading")
    //     .addClass("owl-loaded");
    // });

    mainSlider.owlCarousel({
      items: 1,
      nav: true,
      loop: false
    });

    // mainSlider.on("changed.owl.carousel", function(e) {
    //   $(".slide-title").removeClass("active");
    //   $(".slide-icon").removeClass("active");
    //   $(".slide-text").removeClass("active");
    //   $(".featured-slide .primary-btn").removeClass("active");
    //   return false;
    // });

    // mainSlider.on("translated.owl.carousel", function(e) {
    //   $(".slide-title").addClass("active");
    //   $(".slide-icon").addClass("active");
    //   $(".slide-text").addClass("active");
    //   $(".featured-slide .primary-btn").addClass("active");
    //   return false;
    // });

    //Contact Form
    //Form Validator and Ajax Sender
    $("#contactForm").validate({
      submitHandler: function(form) {
        $.ajax({
          type: "POST",
          url: "/comment",
          data: {
            name: $("#contactForm #name").val(),
            email: $("#contactForm #email").val(),
            message: $("#contactForm #message").val()
          },
          dataType: "json",
          success: function(data) {
            if (data.response == "success") {
              $("#contactWait").hide();
              $("#contactSuccess")
                .fadeIn(300)
                .addClass("modal-show");
              //$("#contactError").addClass("hidden");
              $(
                "#contactForm #name, #contactForm #email, #contactForm #message"
              )
                .val("")
                .blur();
            } else {
              $("#contactWait").hide();
              $("#contactError")
                .fadeIn(300)
                .addClass("modal-show");
              // $("#contactSuccess").addClass("hidden");
            }
          },
          beforeSend: function() {
            $("#contactWait").fadeIn(200);
          }
        });
      }
    });

    //Modal for Contact Form
    var modalWrap = $(".modal-wrap");
    modalWrap.on("click", function() {
      modalWrap.fadeOut(300);
    });

    //Modal for Forms
    function hideModal() {
      modalWrap.fadeOut(300);
      return false;
    }

    modalWrap.on("click", function() {
      hideModal();
    });

    modalWrap.on("click", function() {
      hideModal();
    });

    var sound = new Howl({
      src: ["sound/river.mp3", "sound/river.webm"],
      autoplay: true,
      loop: true,
      volume: 0.6
    });

    $("#music-control").on("click", function() {
      if ($(this).hasClass("unplayed")) {
        sound.play();
        $(this).removeClass("unplayed");
        $(this).addClass("played");
      } else {
        sound.pause();
        $(this).removeClass("played");
        $(this).addClass("unplayed");
      }
    });
    //End - Document Ready
  });

  $(window).on("scroll", function() {
    if (
      $(window).scrollTop() + $(window).height() > $(document).height() - 100 &&
      !commentsLoaded
    ) {
      commentsLoaded = true;
      $.ajax({
        type: "GET",
        url: "/comment_list?page=" + commentPage,
        dataType: "json",
        success: function(data) {
          if (data.success) {
            if (data.data.length > 0) {
              $("#rsvp-list").removeClass("hidden");
              $.each(data.data, function(i, r) {
                var template = $("#rsvp-template")
                  .clone()
                  .html();
                var obj = $(template);
                obj.find(".c-username").text(r.name);
                obj.find(".c-date").text(r.created_at);
                obj.find(".media-comment").html(r.words);
                obj.find("img.media-object").attr("src", r.image);
                $(".tab-content").append(obj.html());
              });
              $("#rsvp-list").removeClass("hidden");
              commentsLoaded = false;
              commentPage++;
            }
          }
        }
      });
    }
  });

  //End - Use Strict mode
})(jQuery);
