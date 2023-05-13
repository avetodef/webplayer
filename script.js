const musicContainer = document.getElementById('music-container'),
 playBtn = document.getElementById('play'),
 prevBtn = document.getElementById('prev'),
 nextBtn = document.getElementById('next'),
 audio = document.querySelector('audio'),
 progress = document.getElementById('progress'),
 progressContainer = document.getElementById('progress-container'),
 songName = document.getElementById('song-name'),
 songSinger = document.getElementById("song-singer"),
 cover = document.getElementById('cover'),
 currTime = document.querySelector('#currTime'),
 durTime = document.querySelector('#durTime'),
 pauseImg = document.querySelector('img[name="pause-img"]');

const singers = ['Jungle ', 'IOWA ', 'Avicii ', 'ABBA ']
const songs = ['Time', '140', 'The Nights', 'Gimme! Gimme! Gimme! (A Man After Midnight)'];

let songIndex = 0;

loadSong(singers[songIndex], songs[songIndex]);
draw();

function draw() {
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var barWidth = (canvas.width / bufferLength) * 2.5;
    var barHeight;
    var x = 0;
    for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        ctx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)';
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
    }
}

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

//bebra i love you

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var audioCtx = new AudioContext();
console.log(audioCtx)

var source = audioCtx.createMediaElementSource(audio);
var analyser = audioCtx.createAnalyser();
source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

function loadSong(singer, song) {
    songName.innerText = song ;
    songSinger.innerText = singer;
    name = singer + song;
    audio.src = `music/${name}.mp3`;
    cover.src = `covers/${name}.jfif`;
}

function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    audio.play();
    pauseImg.src = "icons/pause.png";
}

function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    audio.pause();
    pauseImg.src = "icons/play.png";
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(singers[songIndex], songs[songIndex]);
    playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(singers[songIndex], songs[songIndex]);
    playSong();
}

function updateProgress(e) {
    const { duration, currentTime } = e;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function getDurAndCurTime (e) {
    const {duration,currentTime} = e;
    var sec;
    var sec_d;

    let min = (currentTime==null)? 0:
        Math.floor(currentTime/60);
    min = min <10 ? '0'+min:min;

    function get_sec (x) {
        if(Math.floor(x) >= 60){
            for (var i = 1; i<=60; i++){
                if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
                    sec = Math.floor(x) - (60*i);
                    sec = sec <10 ? '0'+sec:sec;
                }
            }
        }else{
            sec = Math.floor(x);
            sec = sec <10 ? '0'+sec:sec;
        }
    }
    get_sec (currentTime,sec);
    currTime.innerHTML = min +':'+ sec;
    let min_duration = (isNaN(duration) === true)? '0':
        Math.floor(duration/60);
    min_duration = min_duration <10 ? '0'+min_duration:min_duration;

    function get_sec_duration (x) {
        if(Math.floor(x) >= 60){
            for (var i = 1; i<=60; i++){
                if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
                    sec_d = Math.floor(x) - (60*i);
                    sec_d = sec_d <10 ? '0'+sec_d:sec_d;
                }
            }
        }else{
            sec_d = (isNaN(duration) === true)? '0':
                Math.floor(x);
            sec_d = sec_d <10 ? '0'+sec_d:sec_d;
        }
    }
    get_sec_duration (duration);
    durTime.innerHTML = min_duration +':'+ sec_d;
}
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');

    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});


prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong);
audio.addEventListener('timeupdate',getDurAndCurTime);