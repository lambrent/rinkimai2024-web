$(document).ready(function () {


  // sliders
  var swiper1 = new Swiper(".js-leaders-slider", { // eslint-disable-line
    slidesPerView: "auto",
    spaceBetween: 20,
    navigation: {
      nextEl: ".js-leaders-slider-next",
      prevEl: ".js-leaders-slider-prev",
    },
    breakpoints: {
      768: {
        spaceBetween: 42
      }
    }
  });


  // tabs
  const tabs = function name(links, panels) {
    $(document).on("click", links, function (e) {
      if (!$(this).hasClass("active")) {
        $(links).removeClass("active").filter('a[href="' + this.hash + '"]').addClass("active");
        $(panels).slideUp().filter(this.hash).slideDown();
      }
      e.preventDefault();
    });
  };

  tabs(".js-tabs-links", ".js-tabs-panels");


});
