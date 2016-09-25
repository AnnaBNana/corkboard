$(document).ready(function() {
  var view = 'index';

  $( "#navbar" ).load( "/views/partials/navbar.html", function(){
    $(".button-collapse").sideNav();
    $('#index_button').on('click', function(){
      $('#body').css('opacity', 0);
      view = 'index';
      updateView();
    });
    $('#make_note_button').on('click', function(){
      $('#body').css('opacity', 0);
      view = 'make_note';
      updateView();
    });
    $('#search_button').on('click', function(){
      $('#body').css('opacity', 0);
      view = 'search';
      updateView();
    });
    $('#map_button').on('click', function(){
      $('#body').css('opacity', 0);
      view = 'map';
      updateView();

    });
    $('#about_button').on('click', function(){
      $('#body').css('opacity', 0);
      view = 'about';
      updateView();
    });
  });

updateView();

  function updateView(){
    switch (view) {
      case 'index':
        $( "#body" ).load( "/views/partials/index.html", function(){
          $(".nav-list li a").removeClass("active");
          $('nav').transit({top: '-65px'});
          $('#body').transition({opacity: 1});
          $('#scroll_down').click(function(){
            window.scrollTo(0, document.body.scrollHeight);
          });
          $('#scroll_up').click(function(){
            window.scrollTo(0, 0);
          });
          $('#body').on('click', '#make_note_button', function(){
            $('#body').css('opacity', 0);
            view = 'make_note';
            updateView();
          });
          $('#body').on('click', '#search_button', function(){
            $('#body').css('opacity', 0);
            view = 'search';
            updateView();
          });
          $('#body').on('click', '#map_button', function(){
            $('#body').css('opacity', 0);
            view = 'map';
            updateView();
          });
        });
        break;
      case 'search':
        $( "#body" ).load( "/views/partials/search.html", function(){
          $(".nav-list li a").removeClass("selected");
          $('#search_button').addClass('selected');
          $('nav').transit({top: '0px'});
          $('#body').transition({opacity: 1});
          $('#search-submit').click(function(){
            // var data = $('.search-form').serialize();
            var data = {'name': $('#search').val()};
            $.post('/find_by_name', data, function(notes){
              console.log(notes);

              for (var i in notes){
                console.log(i);

                var post = "";
                post += "<div class='col s12 m12'><div class='card horizontal'><div class='card-image'>";
                post += "<img src="+ notes[i].image +" data='image/jpeg' charset='utf-8;base64' class='small_image'>";
                post += "</div>";
                post += "<div class='card-stacked'>";
                post += "<div class='card-content'>";
                post += "<h2 class='header no-top-margin'>"+ notes[i].name +"</h2>";
                post += "<p>"+ notes[i].note +"</p>";
                post += "<p>"+ notes[i].contact +"</p>";
                post += "</div>";
                post += "<div class='card-action' id='notes_button' noteId='"+i+"'>";
                post += "<a>View My Notes</a></div></div></div></div><hr>";

                $('#post-box').append("");

              }
            });
            return false;
          });
          $('#notes_button').on('click', function(){
            $('#body').css('opacity', 0);
            view = 'view_note';
            updateView();
          });
        });
        break;
      case 'make_note':
        $( "#body" ).load( "/views/partials/make_note.html", function(){
          var lat;
          var long;
          navigator.geolocation.getCurrentPosition(function(location) {
            console.log(location.coords.latitude);
            console.log(location.coords.longitude);
            console.log(location.coords.accuracy);
            if (location.coords.latitude && location.coords.longitude){
              console.log('test');
              lat = location.coords.latitude;
              long = location.coords.longitude;
              $('#location').hide();
              $('.remove-label').hide();
            }
          });

          $(".nav-list li a").removeClass("selected");
          $('#make_note_button').addClass('selected');
          $('nav').transit({top: '0px'});
          $('#body').transition({opacity: 1});
          $('#name').click(function(){
            $('#name').attr('placeholder', 'your name or the name of the person you are looking for');
          });
          $('#age').click(function(){
            $('#age').attr('placeholder', 'your age or the age of the person you are looking for');
          });
          $('#location').click(function(){
            $('#location').attr('placeholder', 'enter your location');
          });
          $('#contact').click(function(){
            $('#contact').attr('placeholder', 'list as many means of contact as you wish');
          });
          $('#note').click(function(){
            $('#note').attr('placeholder', 'enter a message to your loved one, including further location details or additional details on how to contact you');
          });
          $('.submit-make-note').click(function(){
            if (!lat && !long){
              var data = $('form').serialize();
            } else {
              var data = $('form').serialize() + '&lat=' + lat + '&long=' + long
            }
            console.log("data object", data);
            $.ajax({
              url: '/notes/add',
              data: data,
              // contentType: false,
              type: 'POST',
              processData: false,
              dataType: 'json',
              success: function(res){
                console.log(res);
                view = 'view_note';
                updateView();
              }
            });
          });
        });
        break;
      case 'map':
        $( "#body" ).load( "/views/partials/map.html", function(){
          $(".nav-list li a").removeClass("selected");
          $('#map_button').addClass('selected');
          $('nav').transit({top: '0px'});
          $('#body').transition({opacity: 1});
          $.getScript("../js/map.js");
        });
        break;
      case 'view_note':
        $( "#body" ).load( "/views/partials/note.html");
          $.getScript("../js/map.js");
          $('#body').transition({opacity: 1});
          $('#body').on('click','#location_button', function(){
            console.log("asdf");
            if ($('#map').hasClass('clear')){
              $('#location_button').text('Show Picture');
            } else {
              $('#location_button').text('Show Location');
            }
            $('#map').toggleClass('clear', 1000, "swing");
          });
        break;
      case 'about':
        $( "#body" ).load( "/views/partials/about.html");
        $(".nav-list li a").removeClass("selected");
        $('#about_button').addClass('selected');
        break;
      default: break;
    }
  }

});
