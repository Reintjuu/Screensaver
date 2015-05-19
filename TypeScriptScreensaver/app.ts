class Background
{
	image: any;

	draw(x: number, y: number)
	{
		context.save();
		context.linewidth = 1;
		context.drawImage(this.image, x, y);
		context.restore();
	}

	constructor(imageSource: string)
	{
		this.image = new Image();
		this.image.src = imageSource;
		backgroundLoaded = true;
	}
}

class Player
{
	name: string;
	image: any;
	x: number;
	y: number;
	vx: number;
	vy: number;

	move()
	{
		this.x += this.vx;
		this.y += this.vy;
		if (this.y + this.image.height > canvas.height) {
			this.y = canvas.height - this.image.height;
			this.vy *= -1;
		}
		else if (this.y < 0) {
			this.vy *= -1;
		}

		if (this.x + this.image.width > canvas.width) {
			this.x = canvas.width - this.image.width;
			this.vx *= -1;
		}
		else if (this.x < 0) {
			this.vx *= -1;
		}
	}

	draw()
	{
		context.save();
		context.linewidth = 1;
		context.drawImage(this.image, this.x, this.y);
		context.restore();
	}

	constructor(name: string, imageSource: string, initialX: number, initialY: number)
	{
		console.log(name + " has been created");
		this.name = name;
		this.image = new Image();
		this.image.src = imageSource;
		if (initialX >= canvas.width)
		{
			this.x = canvas.width - this.image.width;
		}
		if (initialY >= canvas.height)
		{
			this.y = canvas.height - this.image.height;
		}
		else
		{
			this.x = initialX;
			this.y = initialY;
		}

		this.vx = Math.random() * 5 + 5;
		this.vy = Math.random() * 5 + 5;

		playerLoaded = true;
	}
}

var canvas: any;
var context: any;
var background: any;
var ide: any;
var lindy: any;
var hitSound: any;
var song: any;

function init()
{
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

function resizeCanvas()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function collides(a, b)
{
	if (a.x < b.x + b.image.width &&
		a.x + a.image.width > b.x &&
		a.y < b.y + b.image.height &&
		a.y + a.image.height > b.y) return true;
}

var backgroundLoaded: boolean = false;
var playerLoaded: boolean = false;

var hit: boolean = false;

function update()
{
	console.log("Update");

	context.clearRect(0, 0, canvas.width, canvas.height);

	if (backgroundLoaded)
	{
		background.draw(canvas.width / 2 - background.image.width / 2, canvas.height / 2 - background.image.height / 2);
	}

	if (playerLoaded)
	{
		ide.draw();
		lindy.draw();
		
		ide.move();
		lindy.move();

		if (hit)
		{
			hitSound.play();
		}

		if (collides(ide, lindy))
		{
			hit = true;
		}
		else
		{
			hit = false;
		}
	}
}

function run()
{
	var fps = 60;
	init();
	console.log("Now Running");
	setInterval(update, 1000 / fps);
}