/* Wavestreaming.com - https://github.com/Wavestreaming/jquery-shoutcast - MIT licensed */
!function(a){"use strict";function b(a){this._attr={},this.playedInterval=a.playedInterval||a.interval||3e4,this.statsInterval=a.statsInterval||a.interval||5e3,this.host=a.host,this.port=parseInt(a.port,10)||8e3,this.stream=parseInt(a.stream,10)||1,this.stats_path=a.stats_path||"stats",this.played_path=a.played_path||"played",this._statsinterval=null,this._playedinterval=null,this._stats=a.stats||function(){},this._played=a.played||function(){}}b.prototype.get=function(a,b){return a?"undefined"!=typeof this._attr[a.toLowerCase()]?this._attr[a.toLowerCase()]:b:this._attr},b.prototype.stats=function(b){var c,d=this,e="https://"+this.host+":"+this.port+"/"+this.stats_path+"?sid="+this.stream+"&json=1";return b=b||function(){},c=a.ajax({url:e,dataType:"jsonp",timeout:"2000"}),c.done(function(a){return"object"!=typeof a||"undefined"==typeof a.streamstatus?void(d._status=0):(d._status=1===a.streamstatus?2:1,d._attr=a,d._attr.status=d.getStatusAsText(),b.call(d,d._attr),void d._stats(d._attr))}),c.fail(function(){d._status=0,d._attr.status=d.getStatusAsText(),b.call(d,d._attr),d._stats(d._attr)}),this},b.prototype.played=function(b){var c=this,d="https://"+this.host+":"+this.port+"/"+this.played_path+"?sid="+this.stream+"&type=json";return a.ajax({url:d,dataType:"jsonp",timeout:2e3,success:function(a){a instanceof Array&&(b&&b.call(c,a),c._played(a))}}),this},b.prototype.startStats=function(){return this.stopStats(),this.stats(),this._statsinterval=setInterval(a.proxy(this.stats,this),this.statsInterval),this},b.prototype.stopStats=function(){return this._statsinterval&&clearInterval(this._statsinterval),this},b.prototype.startPlayed=function(){return this.stopPlayed(),this.played(),this._playedinterval=setInterval(a.proxy(this.played,this),this.playedInterval),this},b.prototype.stopPlayed=function(){return this._playedinterval&&clearInterval(this._playedinterval),this},b.prototype.getStatus=function(){return this._status},b.prototype.getStatusAsText=function(){return["Offline","Awaiting Connection","On Air"][this._status]},b.prototype.onAir=function(){return 2===this._status},a.SHOUTcast=function(a){return new b(a)}}(window.jQuery);

var host  	      = 'rockfm.rockfm.com.tr',
    port	        = '9450',
    yenileme	    = 1000,
    radyo_url	    = `https://${ host }:${ port }/;stream.mp3`,
    logo          = 'https://www.rockfm.com.tr/images/rockfm_logo_siyah-bg.png',
    spotify_token = '';

$(".liste").click(function(){
  $("#gecmis").slideToggle();
});

var player = new MediaElementPlayer('audio');
interval = setInterval(function(){
  $.SHOUTcast({
    host      : host,
    port      : port,
    interval  : 5000
  }).stats(function(){
    if(this.onAir()){
      $("#player, #gecmis").removeClass("offline").addClass("online");
      radyoismi		= this.get("servertitle");
      calansarki	= this.get("songtitle");
      $("#mesaj marquee").text('Şu anda bu yayını ' + this.get('currentlisteners') + ' kişi dinliyor!');
      $("#icerik p").html();
      if(radyoismi.length >= 50){
        radyoismi = radyoismi.substr(0,50);
      }
      if(calansarki.length >= 50){
        calansarki = calansarki.substr(0,50);
      }
      $(".radyo strong").text(radyoismi);
      $(".sarki span").text(calansarki);
      $.ajax({
        dataType  : 'json',
        url       : `https://api.spotify.com/v1/search?q=${ calansarki }&type=track`,
        headers   : {   
          'Authorization:' : `Bearer ${ spotify_token }`
        },
        success   : function(response){
          console.log(response)
          $("#icerik").css('background-image', 'url(' + response.tracks.items[0].album.images[0].url + ')');
          $("#kapak img").attr('src', response.tracks.items[0].album.images[2].url);
        }
      });

    }else{
      // Yayın kapalı
      $("#player, #gecmis").removeClass("online").addClass("offline");
      $(".radyo strong").text("Rock FM");
      $(".sarki span").text("Yayın şu anda kapalı.");
      $("#kapak img").attr("src", logo);
    }
  }).played(function(tracks){
    $("#gecmis").html("");
    $.each(tracks, function(k,track){
      $("#gecmis").append('<li><i class="fa fa-music"></i> ' + track.title + '</li>');
    });
  });
}, 1000);

$("#kontrol").click(function(){
  icon = $(this).find("i");
  if(icon.attr('class') == 'fa fa-play'){
    player.play();
    icon.attr('class', 'glyphicon glyphicon-pause');
  }else{
    player.pause();
    icon.attr('class', 'fa fa-play');
  }
});

$(".yenile").click(function(){
  player.setSrc(radyo_url);
});

$(".sessiz").click(function(){
  icon = $(this).find('i');
  if(icon.attr('class') == 'fa fa-volume-up'){
    icon.attr('class', 'fa fa-volume-off');
    player.setMuted(true);
  }else{
    icon.attr('class', 'fa fa-volume-up');
    player.setMuted(false);
  }
});

$('[data-toggle=tooltip]').tooltip();
