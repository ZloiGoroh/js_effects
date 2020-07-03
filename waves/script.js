(() => {

    const config = {            //configurating constants
        spaceDiametr : 32,      //space between centers of dots
        dotDiameter : 14,       //diameter of dots
        waveLength : 100,       //length of one wave
        velocity : 0.02,        //speed of the wave
        direction : 1,          //direction and multiplier of the wave (-1 to invert wave)
        displacement : 7        //X shift of dots               
    };

    const canvas = document.createElement('canvas');    //creating canvas
    document.querySelector('body').append(canvas); 
    const ctx = canvas.getContext('2d');                //getting access to draw on canvas
    let w = canvas.width = innerWidth;                  //setting width and height of canvas and writting it into variables
    let h = canvas.height = innerHeight;
    let dotsList = [];                                  //array of dots

    canvas.style.background = 'rgb(17, 17, 23)';        //color of the page

    window.onresize = function() {                      //if user change the screen size, this function will recount main variables
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        init();
    };

    class Dot {
        constructor(x, y){
            this.x = x;                                 //coordinates of the circle
            this.y = y;
            this.radius = config.dotDiameter / 2;       //radius of the circle
            this.scale = this.getDistance() / config.waveLength;  //stage of the vave  
        }

        update(){                                       //updating stage of the wave and redrawing it
            this.resize();
            this.draw();
        }

        resize(){
            this.scale -= config.velocity * config.direction;     //changing dot's stage according to the speed of the wave
        }

        getDistance(){                                  //distance between center of the screen and the circle
            let dx = w / 2 - this.x;
            let dy = h / 2 - this.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        draw(){
            let s = ( 1 - Math.abs(Math.sin(this.scale)));      //stage of the dot's wave (from 0 to 1)
            let o = (1 - s) * 255;                              //changing color according to its's stage
            let r = this.radius * s;                            //changing radius according to dots stage (in wave)
            ctx.beginPath();                                    //start to draw circle
            ctx.arc(this.x, this.y, r, 0, 2 * Math.PI, false);  //drawing a circle
            ctx.closePath();                                    //finish drawing
            ctx.fillStyle = `rgba(255, ${o}, ${o}, ${s})`;      //filling a circle
            ctx.fill();
        }
    }  
 
    const init = function(){
        dotsList = [];                                          //empty array of dots for resizing
        var dotsCountX = w / config.spaceDiametr | 0;           //Math.floor(w/config.spaceDiametr)
        var dotsCountY = h / config.spaceDiametr | 0;           //number of dots, that can be placed in a row (for dotsCountX) or column (for dotsCountY)
        var startX = (config.spaceDiametr + w - dotsCountX * config.spaceDiametr) / 2;  //searching for the center of the screen
        var startY = (config.spaceDiametr + h - dotsCountY * config.spaceDiametr) / 2;
        let displacement = config.displacement / 4 * config.displacement;               //editing displacement

        for (let j = 0; j < dotsCountY; j++){                   //creating array of dots and placing them on the whole page
            displacement = - displacement;
            let y = j * config.spaceDiametr + startY;
            for (let i = 0; i < dotsCountX; i++){
                let x = i * config.spaceDiametr + startX + displacement;
                dotsList.push(new Dot(x,y));
            }
        }
    };

    const loop = function(){                                    //recursive function to animate picture
        ctx.clearRect(0, 0, w, h);                              //clearing page so dots wouldn't be drawn on ach other
        for (let a in dotsList){
            dotsList[a].update();
        }
        requestAnimationFrame(loop);
    };

    init();
    loop();

})();