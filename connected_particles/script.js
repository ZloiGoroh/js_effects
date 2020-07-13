(() =>{
    var canvas = document.createElement('canvas');      //making canvas element
    ctx = canvas.getContext('2d');                      //getting access to draw on canvas
    w = canvas.width = innerWidth;                      //setting width and height of canvas
    h = canvas.height = innerHeight;                    
    particles = [];                                     //array of particles
    properties = {                                      //configurating data
        bgColor : 'rgba(17, 17, 19, 1)',                //background color of the canvas
        particleRadius : 3,                             //radius of particles
        particleCount : 100,                            //amount of particles
        particlMaxVelocity : 0.5,                       //velocity of particles
        lineLength : 150,                               //maximum length of line, that connects particles
        particleLife : 6                                //maximum lifetime of particles
    };

    document.querySelector('body').appendChild(canvas); //creating canvas

    window.onresize = function(){                       //changing width and height after resizing of the screen
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight; 
    };

    class Particle{
        constructor(){
            this.x = Math.random()*w;                   //current position of the particles
            this.y = Math.random()*h;
            this.velocityX = Math.random()*(properties.particlMaxVelocity*2) - properties.particlMaxVelocity;   //counting velocity of the particle
            this.velocityY = Math.random()*(properties.particlMaxVelocity*2) - properties.particlMaxVelocity;
            this.maxLife = Math.random() * properties.particleLife * 60;                                        //maximum lifetime (constant)
            this.life = this.maxLife;                                                                           //remaining time to reincarnate
        }

        position(){                     //changing position according to current position and velocity
            this.x + this.velocityX > w && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0 ? this.velocityX *= -1 : this.velocityX; //prevents particle from
            this.y + this.velocityY > h && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0 ? this.velocityY *= -1 : this.velocityY; //coming out of the screen
            this.x += this.velocityX;   //vertical move
            this.y += this.velocityY;   //horizontal move
        }

        reDraw(){                       //redrawing particle on new position
            ctx.beginPath();
            ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = `rgba(255, 40, 40, ${-4 * this.life*(this.life - this.maxLife)/Math.pow(this.maxLife, 2)})`;    //special formula to light up and down the particle
            ctx.fill();
        }

        recalculateLife(){              //recalculate remaining life time
            if (this.life < 1){         //if the particle is "dead" it will make a new one
                this.x = Math.random()*w;
                this.y = Math.random()*h;
                this.velocityX = Math.random() * (properties.particlMaxVelocity * 2) - properties.particlMaxVelocity;
                this.velocityY = Math.random() * (properties.particlMaxVelocity * 2) - properties.particlMaxVelocity;
                this.maxLife = Math.random() * properties.particleLife * 60;
                this.life = this.maxLife;
            }
            this.life--;                //reduce life on each frame
        }
    }

    const redrawParticles = function(){
        for (let i in particles){
            particles[i].recalculateLife();
            particles[i].position();
            particles[i].reDraw();
        }
    };


    const redrawBackground = function(){
        ctx.fillStyle = properties.bgColor;
        ctx.fillRect(0, 0, w, h);
    };

    const drawLines = function(){
        var x1, y1, x2, y2, length, opacity;
        for (let i in particles){
            for (let j in particles){
                x1 = particles[i].x;        //coordinates of the first particle
                y1 = particles[i].y;        
                x2 = particles[j].x;        //coordinates of the second particle
                y2 = particles[j].y;
                length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));    //distance between them
                if (length < properties.lineLength){
                    opacity = 1 - length / properties.lineLength;       //making opacity of the line according to length
                    ctx.lineWidth = '0.5';
                    ctx.strokeStyle = `rgba(255, 40, 40, ${opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }
    };

    const loop = function(){            //loop function that redraws the canvas
        redrawBackground();
        redrawParticles();
        drawLines();
        requestAnimationFrame(loop);
    };

    const init = function(){
        for (let i = 0; i < properties.particleCount; ++i){     //makes an array of particles
            particles.push(new Particle()); 
        }
        loop();
    };

    init();

})();