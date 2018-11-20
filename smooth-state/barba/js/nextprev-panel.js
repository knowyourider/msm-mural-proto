document.addEventListener("DOMContentLoaded", function() {

  // try adding swipe script here

  // $(function() {      
  //   //Enable swiping...
  //   $("#swipable").swipe( {
  //     //Generic swipe handler for all directions
  //     swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
  //       console.log("Ya'll swiped " + direction );
  //       // $(this).text("You swiped " + direction );
  //       $(".next").text("You swiped " + direction );
  //       $(".next a").trigger("click");
  //     },
  //     //Default is 75px, set to 0 for demo so any distance triggers swipe
  //      threshold:40
  //   });
  // });



  // $("#swipable").swipe( {
  //   //Generic swipe handler for all directions
  //   swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
  //     console.log("Ya'll swiped " + direction );
  //     // $(this).text("You swiped " + direction );
  //     $(".next").text("You swiped " + direction );
  //     $(".next a").trigger("click");
  //   },
  //   //Default is 75px, set to 0 for demo so any distance triggers swipe
  //    threshold:40
  // });

  // $(document).on("swipe", "#swipable", function(event){
  //   swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
  //     console.log("Ya'll swiped " + direction );
  //     // $(this).text("You swiped " + direction );
  //     $(".next").text("You swiped " + direction );
  //     $(".next a").trigger("click");
  //   },
  //   //Default is 75px, set to 0 for demo so any distance triggers swipe
  //    threshold:40

  // });




  // per demo nextprev demo 
  var lastElementClicked;
  var PrevLink = document.querySelector('.prev');
  var NextLink = document.querySelector('.next');

  Barba.Pjax.init();
  Barba.Prefetch.init();

  Barba.Dispatcher.on('linkClicked', function(el) {
    lastElementClicked = el;
  });

  var MovePage = Barba.BaseTransition.extend({
    start: function() {
      this.originalThumb = lastElementClicked;

      Promise
        .all([this.newContainerLoading, this.scrollTop()])
        .then(this.movePages.bind(this));
    },

    scrollTop: function() {
      var deferred = Barba.Utils.deferred();
      var obj = { y: window.pageYOffset };

      TweenLite.to(obj, 0.4, {
        y: 0,
        onUpdate: function() {
          if (obj.y === 0) {
            deferred.resolve();
          }

          window.scroll(0, obj.y);
        },
        onComplete: function() {
          deferred.resolve();
        }
      });

      return deferred.promise;
    },

    movePages: function() {
      var _this = this;
      var goingForward = true;
      this.updateLinks();

      if (this.getNewPageFile() === this.oldContainer.dataset.prev) {
        goingForward = false;
      }

      TweenLite.set(this.newContainer, {
        visibility: 'visible',
        xPercent: goingForward ? 100 : -100,
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0
      });

      TweenLite.to(this.oldContainer, 0.6, { xPercent: goingForward ? -100 : 100 });
      TweenLite.to(this.newContainer, 0.6, { xPercent: 0, onComplete: function() {
        TweenLite.set(_this.newContainer, { clearProps: 'all' });
        _this.done();
      }});
    },

    // Add conditions for no next or prev - DB 11/2018
    updateLinks: function() {
      // if (newContainer.dataset.prev != null) {
        PrevLink.href = this.newContainer.dataset.prev;
      // }
      // if (newContainer.dataset.next != null) {
        NextLink.href = this.newContainer.dataset.next;  
      // }
    },

    getNewPageFile: function() {
      return Barba.HistoryManager.currentStatus().url.split('/').pop();
    }
  });

  Barba.Pjax.getTransition = function() {


    // // re-add swipe function
    //  //Enable swiping...
    // $("#swipable").swipe( {
    //   //Generic swipe handler for all directions
    //   swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
    //     console.log("Ya'll swiped " + direction );
    //     // $(this).text("You swiped " + direction );
    //     $(".next").text("You swiped " + direction );
    //     $(".next a").trigger("click");
    //   },
    //   //Default is 75px, set to 0 for demo so any distance triggers swipe
    //    threshold:40
    // });




    return MovePage;
  };
});
