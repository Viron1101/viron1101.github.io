const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
var force = false;
const maxRot = 50;
const minRot = -50;
var speed = 0;
var fallSpeed = speed;
const maxSpeed = 7;

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
		this.max_xOffset = innerWidth/1.5;
		this.xOffset = 1;
	}	
	draw(){
		img.onload = () => {
			drawImageRot(ctx, img, this.x, this.y, this.size, this.size, this.rot)
		}
	}
	getSpeed(){
		fallSpeed = ((this.rot)/maxRot)*maxSpeed + 1
	}
	control_xOffset(){

		if(this.rot > 25 && this.xOffset + 5 < this.max_xOffset){
			this.xOffset+=5;
		}
		if(this.rot < -5 && this.xOffset - 5 > 0){
			this.xOffset-=5;
		}
		if(this.rot >= -5 && this.rot <= 25){
			this.xOffset+=2.5
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
		console.log("rot:" + this.rot + " os:" + this.xOffset);
	}

	
}

class cloud{
	
	
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
	console.log(key);
	if(key = 'Space'){
		force = true;
	}
}

const img = new Image();
img.src = "./PlaneyBoy.jpg";

const player = new Player(img,150,50,200,0);
player.draw();
function animate(time) {
	ctx.clearRect(0,0,canvas.width,canvas.height)


	player.update();
	//console.log('ok');
  	setTimeout(function() {
    	requestAnimationFrame(animate);
  	}, 1000 / 60);
}

animate()



