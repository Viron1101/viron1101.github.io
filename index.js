const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const scoreEL = document.querySelector("#scoreEL");
var force = false;
const maxRot = 50;
const minRot = -50;
var speed = 0;
var fallSpeed = speed;
const maxSpeed = 10;
const minSpeed = 6;
const showColliders = false;
let score = 0;
class Player{
	constructor(img,x,y,size,rot){
		this.img = img;
		this.x = x;
		this.y = y;
		this.size = size;
		this.rot = rot;
		this.maxHeight = 0;
		this.minHeight = innerHeight;
		this.gravity = 0;
		this.max_xOffset = innerWidth-(innerWidth*0.1);
		this.xOffset = 1;
		this.collX = (this.x + this.size/1.5) + this.xOffset;
		this.collY = this.y + this.size/2;
		this.collSize = this.size/3;



	}	
	draw(){
		this.img.onload = () => {
			drawImageRot(ctx, img, this.x, this.y, this.size, this.size, this.rot)
		}
	}         
	getSpeed(){
		fallSpeed = ((this.rot)/maxRot)*maxSpeed + 1;
		speed = this.xOffset/this.max_xOffset*maxSpeed;
		if(speed < minSpeed){
			speed = minSpeed;
		}
		//console.log(speed);
	}
	control_xOffset(){

		if(this.rot > 25 && this.xOffset + 5 < this.max_xOffset){
			this.xOffset+=15;
		}
		if(this.rot < -5 && this.xOffset - 5 > 0){
			this.xOffset-=10;
		}
		if(this.rot >= -5 && this.rot <= 25){
			this.xOffset+=5
		}
	}	
	drawCollider(){
		this.collX = (this.x + this.size/1.5) + this.xOffset;
		this.collY = this.y + this.size/2;
		this.collSize = this.size/3;
		if(showColliders){
			ctx.beginPath();
			ctx.arc((this.collX),this.collY,this.collSize,0,2*Math.PI);
			ctx.fill();
			ctx.stroke;
		}
	}
	update(){
		if(force && this.rot >= minRot){
			if(this.rot - 2.5 < minRot){
				this.rot = minRot;
			}else{
				this.rot = this.rot - 2.5;
			}
		}else if(this.rot <= maxRot){
			if(this.rot + 3 > maxRot){
				this.rot = maxRot
			}else{
				this.rot = this.rot + 3;
			}
		}	
		this.getSpeed();
		this.control_xOffset();
		
		if(this.y + fallSpeed > 0 && this.y + fallSpeed < innerHeight - this.size){
			this.y = this.y + fallSpeed;
		}
		drawImageRot(ctx, img, this.x + this.xOffset, this.y, this.size, this.size, this.rot)
		this.drawCollider();
		//console.log("rot:" + this.rot + " os:" + this.xOffset);
	}

	
}

class Donut{
	constructor(img,x,y,size,velocity){
		this.img = img;
		this.x = x;
		this.y = y;
		this.size = size;
		this.velocity = velocity;
		this.collX;
		this.collY;
		this.collSize;

	}
	drawCollider(){
		this.collX = (this.x + this.size/1.5);
		this.collY = this.y + this.size/2;
		this.collSize = this.size/2;
		if(showColliders){
			ctx.beginPath();
			ctx.arc((this.collX),this.collY,this.collSize,0,2*Math.PI);
			ctx.fill();
			ctx.stroke;
		}
	}
	draw(){
		this.img.onload = () => {
			drawImageRot(ctx, this.img, this.x, this.y, this.size, this.size, 0)
		}
	}
	update(){
		drawImageRot(ctx, this.img, this.x, this.y, this.size, this.size, 0)
		this.x = this.x - speed
		this.y = this.y + this.velocity.y
		this.drawCollider();
	}
	


}
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const donuts = [];

function spawnDonuts(){
	setInterval(()=>{
		const x = (Math.random() * canvas.width) + innerWidth/2;
		const y = 0;
		const size = 100;
		const vy = randomInteger(3,7);
		const velocity = {
			x:speed,
			y:vy
		}
		donuts.push(new Donut(imgDonut,x,y,size,velocity))
	},1000)
}
const drawImageRot = (ctx, img, x, y, width, height, deg) => {
  ctx.save()
  const rad = deg * Math.PI / 180;
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(rad);
  ctx.drawImage(img, width / 2 * (-1), height / 2 * (-1), width, height);
  ctx.restore();
}

document.addEventListener('keydown', logKey);
document.addEventListener('keyup', goUp);

function goUp(e){
	var key = `${e.code}`
	if(key == 'Space'){
		force = false;
	}
}

function logKey(e){    
	var key = `${e.code}`
	//console.log(key);
	if(key = 'Space'){
		force = true;
	}
}

const img = new Image();
img.src = "./PlaneyBoy.jpg";

const imgDonut = new Image();
imgDonut.src = "./donut.png"
const player = new Player(img,150,50,200,0);

player.draw();
function animate(time) {

	ctx.clearRect(0,0,canvas.width,canvas.height)
	
	player.update();


	//donut collision
	donuts.forEach((donut,index) => {
		donut.update();
		const dist = Math.hypot(donut.collX - player.collX, donut.collY - player.collY);
		if(dist - donut.collSize - player.collSize < 1){

			console.log("got a donut");
			//donut.velocity = 0;
			score += 10;
			scoreEL.innerHTML = score;
			console.log(score);
			donuts.splice(index,1)
			
		}

	});
	
	

	//console.log('ok');
  	setTimeout(function() {
    	requestAnimationFrame(animate);
  	}, 1000 / 60);
}

animate()
spawnDonuts();


