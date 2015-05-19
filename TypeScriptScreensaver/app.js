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
        this.width = this.image.width;
        this.height = this.image.height;
        if (initialX >= canvas.width) {
            this.x = canvas.width - this.width;
        }
        if (initialY >= canvas.height) {
            this.y = canvas.height - this.height;
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

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.vy *= -1;
        } else if (this.y < 0) {
            this.vy *= -1;
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
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

var canvas;
var context;
var background;
var ide;
var lindy;

function init() {
    console.log("Init");

    // Load HTML 5 Canvas and get 2d context
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Load background image
    background = new Background('images/32-jpg.jpg');
    ide = new Player('Ide', 'images/Ide.png', 0, 0);
    lindy = new Player('Lindy', 'images/Lindy.png', canvas.width, canvas.height);
}

function collides(a, b) {
    if (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y)
        return true;
}

var hit = false;

function update() {
    console.log("Update");
    if (backgroundLoaded) {
        background.draw(0, 0);
    }

    if (playerLoaded) {
        ide.draw();
        lindy.draw();
        if (!hit) {
            ide.move();
            lindy.move();
        }
    }

    if (collides(ide, lindy)) {
        hit = true;
    }
}

var backgroundLoaded = false;
var playerLoaded = false;

function run() {
    var fps = 60;
    init();
    console.log("Now Running");
    setInterval(update, 1000 / fps);
}
//# sourceMappingURL=app.js.map
