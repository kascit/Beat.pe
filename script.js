
playing = false;
paused = true;
this.startScreen = document.getElementById('start-screen');
this.gameScreen = document.getElementById('game-screen');
this.pauseScreen = document.getElementById('pause-screen');
this.overScreen = document.getElementById('over-screen');

document.addEventListener('keydown', (e) => {        
    if (e.code === 'Space') {
        e.preventDefault();
        
        if (!startScreen.classList.contains('hidden')) {
            start();
            return;
        }
        
        if (!overScreen.classList.contains('hidden')) {
            start();
            return;
        }
        
        if (playing) {
            togglePause();
            return;
        }
    }
});

function show(screen) {
    [startScreen, gameScreen, pauseScreen, overScreen].forEach(s => 
        s.classList.add('hidden')
    );
    screen.classList.remove('hidden');
}

function start() {
        playing = true;
        paused = false;
        show(gameScreen);
}
    
function togglePause() {
    if (!playing) return;
    
    paused = !paused;
    
    if (paused) {
        show(pauseScreen);
    } else {
        show(gameScreen);
    }
}