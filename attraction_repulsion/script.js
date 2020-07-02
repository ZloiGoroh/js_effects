(() => {
        //config data, that can be easily changed to get different effect
    const config = {
        dotMinRad: 6,                           //minimum dot radius
        dotMaxRad: 20,                          //maximum dot radius
        massFactor : 0.002,                     //density of dots (bigger this variable, havier the dot, slower it is)
        defColor : `rgba(250, 10, 30, 0.9)`,    //color of dots
        smooth : 0.8,                           //fluent of dots (the smaller it is, the faster dots will lose speed)
        sphereRad : 500,                        //range around mouse where all dots would try to fit
        bigDotRad : 35,                         //Size of the mouse dot
        mouseSize : 120                         //distance that all dots would try to keep around the mouse
    };
    const TWO_PI= 2 * Math.PI;
    const canvas = document.querySelector(`canvas`);    //getting access to canvas on the page
    const ctx = canvas.getContext(`2d`);                
    var w, h, mouse, dots;              //initializing variables (w, h - width and height of the screen
                                        //mouse - object, that contains information abou mouse, dots - array of dots)


    class Dot {                         //class of dots
        constructor(r){
            this.pos = {                //dot position
                x: mouse.x,
                y: mouse.y
            };
            this.vel = {                //dot speed
                x : 0,
                y : 0
            };
            this.rad = r || random(config.dotMinRad, config.dotMaxRad);     //dot size (generates randomly in min/max range)
            this.mass = this.rad * config.massFactor;
            this.color = config.defColor;
        }

        draw(x, y){         //drawing a circle
            this.pos.x = x || this.vel.x + this.pos.x;      //if method gets arguments, it will set a circle on that position
            this.pos.y = y || this.vel.y + this.pos.y;      //otherwise it will count it's movement according to ravity
            createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);       //filling a circle
            createCircle(this.pos.x, this.pos.y, this.rad, false, config.defColor); //making a ring around the circle
        }
    }

    function init(){
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        mouse = {
            x: w / 2,
            y: h / 2,
            down: false 
        };
        dots = [];
        dots.push(new Dot(config.bigDotRad));   //creating first dot (which would be instead of the mouse)
    }


    function updateDots(){
        for (let i = 1; i < dots.length; i++) {
            let acc = {
                x : 0,
                y : 0
            };
            for (let j = 0; j < dots.length; j++){
                if (i == j) continue;
                let [a, b] = [dots[i], dots[j]];
                let delta = {
                    x: b.pos.x - a.pos.x,
                    y: b.pos.y - a.pos.y
                };
                let dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
                let force =(dist - config.sphereRad) / dist * b.mass;

                if (j == 0){
                    let alpha = config.mouseSize / dist;
                    a.color = `rgba(250, 10, 30, ${alpha})`;
                    if (dist < config.mouseSize){
                        force = (dist - config.mouseSize) * b.mass;
                    } else {
                        force = a.mass;
                    }
                }
                acc.x += delta.x * force;
                acc.y += delta.y * force;
            }   
            dots[i].vel.x = acc.x * dots[i].mass + dots[i].vel.x * config.smooth;
            dots[i].vel.y = acc.y * dots[i].mass + dots[i].vel.y * config.smooth;
        }
        dots.map(e => e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw());
    }

    function createCircle(x, y, rad, fill, color){
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, TWO_PI);
        ctx.closePath();
        if (fill){
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }

    function random(min, max){
        return Math.random() * (max - min) + min;
    }

    function loop(){
        ctx.clearRect(0, 0, w, h);
        if (mouse.down){
            dots.push(new Dot());
        }
        updateDots();
        

        window.requestAnimationFrame(loop);
    }

    function setPos({layerX, layerY}){
        [mouse.x, mouse.y] = [layerX, layerY];
    }

    function isDown() {
        mouse.down = !mouse.down;
        console.log(mouse.down);
    }
        

    canvas.addEventListener(`mousemove`, setPos);
    window.addEventListener(`mousedown`, isDown);
    window.addEventListener(`mouseup`, isDown);

    init();
    loop();
})();