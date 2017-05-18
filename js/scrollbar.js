(function ($, window) {
  var $style = $('<style type="text/css" id="scrollbarStyle"></style>')
  var cssStr = '.scroll-bar{position:absolute;width:14px;margin:auto;top:0;right:0;bottom:0;background-color:rgba(200,200,200,.1);*background-color:#fff;opacity:0;transition:all 0.5s}.scroll-bar:hover{opacity:1}.scroll-slider{position:absolute;width:6px;background-color:rgba(0,0,0,0.3);-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;left:50%;margin-left:-3px;z-index:1}'
  $style.text(cssStr)
  $('head>link,head>style,head>*:last').before($style)
  $.fn.scrollbar = function (opt) {
    var options = $.extend(true, {
      skin: "",
      scrollbar: null,
      slider: null,
    }, opt);
    return this.each(function () {
      var $this = $(this);
      var $scrollContent = $this.children();
      var $scroll_bar = null;
      var $slider = null;
      var initX = 0,
        initY = 0,
        initTop = 0,
        initHeight = $scrollContent.innerHeight();

      if ($this.css("position") === "static") {
        $this.css("position", "relative");
      }
      createScrollElement();
      $this.on("mouseover mouseleave mousewheel scrollResize", createScrollElement);
      $this.on("mousedown", ".scroll-slider", function (e) {
        var $this = $(this);
        initX = e.pageX;
        initY = e.pageY;
        initTop = $slider.position("top").top || 0;
        $(window.document).on("mousemove", moveEvent);
        $(window.document).on("mouseup", function () {
          $(window.document).off("mousemove", moveEvent);
          initTop = $slider.position("top").top || 0;
        });
      });
      $this.on("mousewheel DOMMouseScroll", moveEvent);
      $this.on("scrollResize", function () {
        var $scrollContent = $this.children().not($scroll_bar);
        if ($this.height() < $scrollContent.innerHeight()) {
          $scrollContent.css("margin-top", "");
          if ($this.height() < $scrollContent.innerHeight()) {
            $scroll_bar.show();
          } else {
            $scroll_bar.hide();
          }
        } else {
          $scroll_bar.hide();
        }
        $slider.css({
          "height": getHeight()
        })
      })

      function createScrollElement() {
        $scroll_bar = $this.find(".scroll-bar");
        $slider = $this.find(".scroll-slider");
        if ($scroll_bar.length && $slider.length) {
          return
        }
        if (_isElement(options.scrollbar)) {
          $scroll_bar = $(options.scrollbar).addClass("scroll-bar").addClass(options.skin);
        }
        if (_isElement(options.slider)) {
          $slider = $(options.slider).addClass("scroll-slider");
        }
        if ($scroll_bar.length === 0) {
          $scroll_bar = $("<div class='scroll-bar'>").addClass(options.skin).appendTo($this);
          $this.append($scroll_bar);
        }
        if ($slider.length === 0) {
          $slider = $("<div class='scroll-slider'>").appendTo($this);
          $scroll_bar.append($slider);
        }
        $slider.css({
          "height": getHeight()
        })
      }

      function moveEvent(ev) {
        var $scrollContent = $this.children().not($scroll_bar);
        var scrollTop = 0;
        $slider.css({
          "height": getHeight()
        })
        if (ev.type === "mousemove") {
          scrollTop = initTop + (ev.pageY - initY);
        } else if (ev.originalEvent.deltaY) {
          scrollTop = initTop + (ev.originalEvent.deltaY / 10);
          initTop = scrollTop;
        } else {
          scrollTop = initTop + (ev.originalEvent.detail * 3.33);
          initTop = scrollTop;
        }
        ev.preventDefault();
        var h = $scroll_bar.innerHeight() - $slider.innerHeight();
        if (scrollTop < 0) {
          initTop = scrollTop = 0;
        } else if (scrollTop > h) {
          initTop = scrollTop = h;

        }
        var y = scrollTop / h * ($scrollContent.innerHeight() - $this.height());
        $scrollContent.css({
          "margin-top": -y
        });
        $slider.css({
          top: scrollTop
        });
      }

      function getHeight() {
        return $this.height() / $this.children().not($scroll_bar).innerHeight() * $scroll_bar.innerHeight();
      }
      
      function _isElement(el) {
        return el instanceof jQuery || (typeof HTMLElement === 'object' && el instanceof HTMLElement) || (typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string')
      }
    })
  }
})(jQuery, window);