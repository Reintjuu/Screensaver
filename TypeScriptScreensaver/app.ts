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
	width: number;
	height: number;
	vx: number;
	vy: number;

	move()
	{
		this.x += this.vx;
		this.y += this.vy;

		if (this.y + this.height > canvas.height) {
			this.y = canvas.height - this.height;
			this.vy *= -1;
		}
		else if (this.y < 0) {
			this.vy *= -1;
		}
		if (this.x + this.width > canvas.width) {
			this.x = canvas.width - this.width;
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
		this.width = this.image.width;
		this.height = this.image.height;
		if (initialX >= canvas.width)
		{
			this.x = canvas.width - this.width;
		}
		if (initialY >= canvas.height)
		{
			this.y = canvas.height - this.height;
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

function init()
{
	console.log("Init");
	// Load HTML 5 Canvas and get 2d context
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

	// Load background image
	background = new Background('images/32-jpg.jpg');
	ide = new Player('Ide', 'images/Ide.png', 0, 0);
	lindy = new Player('Lindy', 'images/Lindy.png', canvas.width, canvas.height); 

}

function collides(a, b)
{
	if (a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y) return true;
}

var hit: boolean = false;

function update()
{
	console.log("Update");
	if (backgroundLoaded)
	{
		background.draw(0, 0);
	}

	if (playerLoaded)
	{
		ide.draw();
		lindy.draw();
		if (!hit)
		{
			ide.move();
			lindy.move();
		}
	}

	if(collides(ide, lindy))
	{
		hit = true;
	}

}

var backgroundLoaded: boolean = false;
var playerLoaded: boolean = false;

function run()
{
	var fps = 60;
	init();
	console.log("Now Running");
	setInterval(update, 1000 / fps);
}