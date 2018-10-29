$(document).ready(function(){

  // ------- SLIM POPS ------

  // -- .pop_item --
  // enable click event on menu items and text links

  $(".pop_item").click(function(event){ // .mobile
  // $(".pop_item").on("click touchstart", function(event){

    console.log(" -- got to pop item: ");
    
    // console.log("--- got to pop_item");
    event.preventDefault();
    // get href
    // use closest -- target may be image in dig deeper gallery
    var chosen_href = $(event.target).closest('a').attr('href');
    console.log(" -- slim chosen_href: " + chosen_href);

    // the following from Impressions for variable slim pop sizes
    // var href_split = chosen_href.split('/');    
    // // href_split[2] = person, evidence, fastfact, special
    // var slimpopSizeClass = href_split[2];
    // console.log(" -- slim class size: " + slimpopSizeClass);
    // console.log(" -- href_split length: " + href_split.length);
    // slimPop(ajaxHref, slimpopSizeClass);  

    slimPop(chosen_href, "learn-more");

  });

  // "document on" sytntax required since this markup may appear on
  // links loaded by ajax. (at least map dig deeper)
  // $(document).on("click", ".pop_item", function(event){

  // -- .swap_pop --
  // enable click event on slim that's already up
  // "document on" sytntax required since this the markup was loaded by ajax.
  $(document).on("click", ".swap_pop", function(event){
    event.preventDefault();
    // get href
    var chosen_href = $(event.target).attr('href');
    console.log('swap chosen_href: ' + chosen_href);
    // var href_split = chosen_href.split('/');    
    // var slimpopSizeClass = href_split[2];
    // BTW supporting/base_detail_full also has slimpop-wrapper
    var contentDiv = $('#slimpop-container');
    // resize contentDiv
    // contentDiv.removeClass().addClass("slimpop-basic").addClass(href_split[2]); 
    // call ajax for the slim pop. 
    getURL(chosen_href, contentDiv);
  });

}); // end doc ready

/* 
*  used by popBox() and..
*/
function slimPop(theURL, sizeClass) { 
  // append divs if not present
  if (!$('#slimpop-overlay').length > 0) { // overlay html doesn't exist
    //create HTML markup for lightbox window
    var slimpopOverlay = 
    '<div id="slimpop-overlay" class="hidden"></div>' +
    '<div id="slimpop-container" class="hidden"></div>';
    //insert lightbox HTML into page
    $('body').append(slimpopOverlay);
    // assign close click to overlay
    $('#slimpop-overlay').click(function(event){
      hideBox();    
    });
  } else { // clear the container -- otherwise previous content flashes by
    $('#slimpop-overlay').html = " ";
  }
  // unhide overlay
  $('#slimpop-overlay').removeClass().addClass('unhidden');
  // assign contentDiv for further use
  var contentDiv = $('#slimpop-container');
  // contentDiv will be unhidden by specific classes 
  contentDiv.removeClass().addClass("slimpop-basic"); 
  //contentDiv.removeClass().addClass("slimpop-basic").addClass(sizeClass); 
  // call Ajax
  getURL(theURL, contentDiv);
}

/* simple hide called by Close link in box, and by hideOverlay, below.
*/
function hideBox() {
  // test for existence of audioPlayer element 
  if ($('audio')) {
    $('audio').trigger("pause");
  }
  if ($('video')) {
    $('video').trigger("pause");
  }
  var contentDiv = $('#slimpop-container');
  // empty content div so it won't briefly show old content on new pop
  contentDiv.html = " ";  
  // hide box.. 
  contentDiv.removeClass().addClass('hidden');
  // ..and darkening overlay
  $('#slimpop-overlay').removeClass().addClass('hidden');

}

// ----------- AJAX ----------

// jQuery Ajax
function getURL(theURL, contentDiv) {
  //contentDiv.load(theURL);
  // using .get instead of .load so that I can catch errors, especially 404
  // requestData,?
  $.get(theURL, function(data) {  
    contentDiv.html(data);
    // console.log("--- attr name: " + contentDiv.attr('id'));
    // make sure we're scrolled to the top
    // in the case of full screen (mobile) the scroll has to operate on 
    // the whole windo
    if (contentDiv.attr('id') == 'fullpop_content_wrapper') {
      $(window).scrollTop( 0 );
    } else {
      contentDiv.animate({ scrollTop: 0 }, 0);    
    }
    // following callback wasn't needed since we're operating on the window.
    // contentDiv.html(data).promise().done(function(){
    //   // console.log(" -- success for html")
    //   // scrollTop works on window, not div
    //   $(window).scrollTop( 0 );
    // });
  }).fail(function(jqXHR) {
    contentDiv.html('<div id="slimpop-wrapper">' + '<p>SlimPop error: ' + 
      jqXHR.status + '</p></div>')
    .append(jqXHR.responseText);
  });
}
