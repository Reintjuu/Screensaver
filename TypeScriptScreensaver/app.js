var Background = (function () {
    function Background(imageSource) {
        this.image = new Image();
        this.image.src = imageSource;
        backgroundLoaded = true;
    }
    Background.prototype.draw = function (x, y) {
        context.save();
        context.linewidth = 1;
        context.drawImage(this.image, x, y);
        context.restore();
    };
    return Background;
})();

var Player = (function () {
    function Player(name, imageSource, initialX, initialY) {
        console.log(name + " has been created");
        this.name = name;
        this.image = new Image();
        this.image.src = imageSource;
        if (initialX >= canvas.width) {
            this.x = canvas.width - this.image.width;
        }
        if (initialY >= canvas.height) {
            this.y = canvas.height - this.image.height;
        } else {
            this.x = initialX;
            this.y = initialY;
        }

        this.vx = Math.random() * 5 + 5;
        this.vy = Math.random() * 5 + 5;

        playerLoaded = true;
    }
    Player.prototype.move = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y + this.image.height > canvas.height) {
            this.y = canvas.height - this.image.height;
            this.vy *= -1;
        } else if (this.y < 0) {
            this.vy *= -1;
        }

        if (this.x + this.image.width > canvas.width) {
            this.x = canvas.width - this.image.width;
            this.vx *= -1;
        } else if (this.x < 0) {
            this.vx *= -1;
        }
    };

    Player.prototype.draw = function () {
        context.save();
        context.linewidth = 1;
        context.drawImage(this.image, this.x, this.y);
        context.restore();
    };
    return Player;
})();

// TODO: Needs to be implemented correctly, see http://chimera.labs.oreilly.com/books/1234000001552/ch01.html#s01_9 and
// http://webaudioapi.com/samples/shared.js.
var AudioHelper = (function () {
    function AudioHelper() {
        this.contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);

        if (this.contextClass) {
            // Web Audio API is available.
            this.audioContext = new this.contextClass();
        } else {
            // Web Audio API is not available. Ask the user to use a supported browser.
        }
    }
    AudioHelper.prototype.load = function (url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function () {
            this.audioContext.decodeAudioData(request.response, function (theBuffer) {
                this.buffer = theBuffer;
            }, this.onError);
        };
        request.send();
    };

    AudioHelper.prototype.onError = function () {
        console.log("Can't load a sound.");
    };

    AudioHelper.prototype.playSound = function (buffer) {
        var source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    };
    return AudioHelper;
})();

var canvas;
var context;
var background;
var ide;
var lindy;
var hitSound;
var song;

function init() {
    console.log("Init");

    // Load HTML 5 Canvas and get 2d context
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context = canvas.getContext('2d');

    window.addEventListener('resize', resizeCanvas, false);

    // Load background image
    background = new Background('images/32-jpg.jpg');
    ide = new Player('Ide', 'images/Ide.png', 0, 0);
    lindy = new Player('Lindy', 'images/Lindy.png', canvas.width, canvas.height);

    hitSound = new Audio('sounds/sfx_hit.mp3');
    song = new Audio('sounds/nasheed.mp3');

    song.loop = true;
    song.play();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function collides(a, b) {
    if (a.x < b.x + b.image.width && a.x + a.image.width > b.x && a.y < b.y + b.image.height && a.y + a.image.height > b.y)
        return true;
}

var backgroundLoaded = false;
var playerLoaded = false;

var hit = false;

function update() {
    console.log("Update");

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (backgroundLoaded) {
        background.draw(canvas.width / 2 - background.image.width / 2, canvas.height / 2 - background.image.height / 2);
    }

    if (playerLoaded) {
        ide.draw();
        lindy.draw();

        ide.move();
        lindy.move();

        if (hit) {
            hitSound.play();
        }

        if (collides(ide, lindy)) {
            hit = true;
        } else {
            hit = false;
        }
    }
}

function run() {
    var fps = 60;
    init();
    console.log("Now Running");
    setInterval(update, 1000 / fps);
}
//# sourceMappingURL=app.js.map
