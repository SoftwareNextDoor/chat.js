var audio;

soundManager.setup({
  url: '/assets/swf/',
  onready: function () {
    audio = soundManager.createSound({
      id: 'transmision',
      url: 'http://laberintoradio.net:8000/;stream.mp3',
      autoLoad: true,
      onconnect: function () {
        console.log('WOOOTTT');
      },
      onload: function () {
        console.log(this.readyState);
      }
    });
  }
});

$(function(){

  $('.listen').toggle(function (e) {
    e.preventDefault();
    audio.play();
  }, function (e) {
    e.preventDefault();
    audio.pause();
  });

});
