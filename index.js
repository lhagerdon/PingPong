class Vec {
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

class Rect {
    constructor(w, h){
        this.pos = new Vec;
        this.size = new Vec(w, h);
    }
    
    // Allows ball not to go outside of canvas before it
    // bounces back
    get left(){return this.pos.x - this.size.x / 2}
    get right(){return this.pos.x + this.size.x / 2}
    get top(){return this.pos.y - this.size.y / 2}
    get bottom(){return this.pos.y + this.size.y / 2}
}

class Ball extends Rect{
    constructor(){
        super(10, 10);
        this.vel = new Vec;
    }
}

class Player extends Rect{
    constructor(){
        super(20, 100);
        this.score = 0;
    }
}

class Pong {
    constructor(canvas){
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.ball = new Ball;

        this.players = [
            new Player,
            new Player
        ];

        this.players[0].pos.x = 40;
        this.players[1].pos.x = this._canvas.width - 40;
        this.players.forEach(player => {
            player.pos.y = this._canvas.height / 2;
        });

        let lastTime;

        // This effect ball speed on the screen
        const callBack = (ms) => {
            if(lastTime){
                this.update((ms - lastTime) / 1000);
            }
        
            lastTime = ms;
            requestAnimationFrame(callBack);
        };
        callBack();
    }

    collide(player, ball){
        if(player.left < ball.right && player.right > ball.left
            && player.top < ball.bottom &&player.bottom > ball.top){
                ball.vel.x = -ball.vel.x;
            }
    }

    draw(){
        // Canvas
        this._context.fillStyle = "black";
        this._context.fillRect(0, 0, canvas.width, canvas.height);
        
        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));
    }

    drawRect(rect){
         // Pong Ball
         this._context.fillStyle = "white";
         this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    // Rests ball to restart game
    reset(){
        
        // Centers the ball in the middle of the canvas
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;

        // Controls balls velocity
        // Right now it is static, but we change that in the start method
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }

    // Starts game
    start(){
        if(this.ball.vel.x === 0 && this.ball.vel.y === 0){
            this.ball.vel.x = 300;
            this.ball.vel.y = 300;
        }
    }

    // Movement of ball is relative to the time difference of update method
    update(dt){
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;

        // Allows ball to bounce of the edges
        if(this.ball.left < 0 || this.ball.right > this._canvas.width){ 
            const playerId = this.ball.vel.x < 0 | 0;
            this.players[playerId].score++;
            this.reset();
        }

        if(this.ball.top < 0 || this.ball.bottom > this._canvas.height){
             this.ball.vel.y = -this.ball.vel.y;
        }
        
        this.players[1].pos.y = this.ball.pos.y;

        this.players.forEach(player => this.collide(player, this.ball));

        this.draw();
    }
}

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);


canvas.addEventListener('mousemove', even => {
    pong.players[0].pos.y = event.offsetY;
});

canvas.addEventListener('click', event => {
    pong.start();
});





