let mouse = {
    radius: Math.pow(10, 4),
    x: 0,
    y: 0
};
let particleArr = [];
let particleAtArr =[];
let particleAttributes = {
    friction: 0.95,
    ease: 0.19,
    spacing: 1,
    size: 4,
    color: "#000000"
};
function update() {
    for(let i = 0; i < particleArr.length; i++) {
        let p = particleArr[i];
        p.update();
    }

}

window.onload = function () {
    let canvasInteractive = document.getElementById('canvas-interactive');
    let canvasReference = document.getElementById('canvas-reference');
    let defaultImage = document.getElementById('cirimg');
    let contextInteractive = canvasInteractive.getContext('2d');
    let contextReference = canvasReference.getContext('2d');
    let width = canvasInteractive.width = canvasReference.width = document.body.clientWidth;
    let height = canvasInteractive.height = canvasReference.height = document.body.clientHeight;
    let rf = 0;
    let m = width / 180;
    let n = height / 87;
    let a = (width > 2000) ? 5 : (width > 1500) ? 4 :(width > 1200) ? 3 : (width>500) ? 2.5 : 2;
    let center = {
        x: width / 2,
        y: height / 2
    };
    let logoLocation = {
        x: (center.x - defaultImage.width*m/2)/m,
        y: (center.y - defaultImage.height*n/2)/n
    };
    function Particle(x, y) {
        this.x = (rf) ? x : Math.floor((Math.random() * window.innerWidth));
        this.originX = x;
        this.y = (rf) ? y: Math.floor((Math.random() * window.innerHeight));
        this.originY = y;
        this.rx = 0;
        this.ry = 0;
        this.vx = 0;
        this.vy = 0;
        this.force = 0;
        this.angle = 0;
        this.distance = 0;
    }

    Particle.prototype.update = function() {
        this.rx = mouse.x - this.x;
        this.ry = mouse.y - this.y;
        this.distance = this.rx * this.rx + this.ry * this.ry;
        this.force = -mouse.radius / this.distance - 20;
        if(this.distance < mouse.radius) {
            this.angle = Math.atan2(this.ry, this.rx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
        }
        this.x += (this.vx *= particleAttributes.friction) + (this.originX - this.x) * particleAttributes.ease;
        this.y += (this.vy *= particleAttributes.friction) + (this.originY - this.y) * particleAttributes.ease;
    };
    function clearCanvas(){
        contextInteractive.clearRect(0,0,width,height);
        contextReference.clearRect(0,0,width,height);
        particleAtArr=[];
        particleArr=[];
        mouse.x = 0;
        mouse.y = 0;
    }
    function mouseEnter(elmId) {
        clearCanvas();
        let img = document.getElementById(elmId+'img');
        logoLocation.x = (center.x - img.width*m/2)/m;
        logoLocation.y = (center.y - img.height*n/2)/n;
        document.getElementById(elmId).style.backgroundColor = "black";
        init(img);
    }
    function mouseLeave(elmId) {
        clearCanvas();
        document.getElementById(elmId).style.backgroundColor = 'rgba(0,0,0,0)';
        logoLocation.x = (center.x - defaultImage.width*m/2)/m;
        logoLocation.y = (center.y - defaultImage.height*n/2)/n;
        init(defaultImage);
    }
    function render() {
        contextInteractive.clearRect(0, 0, width, height);
        for(let i = 0; i < particleArr.length; i++) {
            let p = particleArr[i];
            contextInteractive.fillStyle = particleAtArr[i].color;//
            contextInteractive.beginPath();

            contextInteractive.arc(p.x,p.y,particleAtArr[i].size*a,0, Math.PI * 2);
            contextInteractive.lineWidth = 0;
            contextInteractive.fill();
        }


    }
    function init(image) {
        contextReference.drawImage(image,logoLocation.x, logoLocation.y);
        let pixels = contextReference.getImageData(0, 0, width, height).data;
        console.log(pixels.length)
        console.log({height, width})
        let index;
        for(let y = 0; y < height; y += particleAttributes.spacing) {
            for(let x = 0; x < width; x += particleAttributes.spacing) {
                index = (y * width + x) * 4;
                if(pixels[++index+2] > 0) {
                    let c = tinycolor('rgba('+pixels[index-1]+','+pixels[index]+','+ pixels[index+1]+','+ pixels[index+2]+')');
                    let pAtt = {
                        friction: 0.95,
                        ease: 0.19,
                        spacing: 1,
                        size: (255-c.getBrightness()+20)/255,
                        color: 'rgba('+pixels[index-1]+','+pixels[index]+','+ pixels[index+1]+','+ pixels[index+2]+')'
                    }
                    particleAtArr.push(pAtt);
                    particleArr.push(new Particle(x*m, y*n));

                }
            }
        }
        console.log(particleArr.length)

    }
    function animate() {
        update();
        render();
        requestAnimationFrame(animate);
    }


    document.getElementById("cir1").onmouseenter = function() {mouseEnter("cir1")};
    document.getElementById("cir1").onmouseleave = function() {mouseLeave("cir1")};

    document.getElementById("cir2").onmouseenter = function() {mouseEnter("cir2")};
    document.getElementById("cir2").onmouseleave = function() {mouseLeave("cir2")};

    document.getElementById("cir3").onmouseenter = function() {mouseEnter("cir3")};
    document.getElementById("cir3").onmouseleave = function() {mouseLeave("cir3")};

    document.getElementById("canvas-interactive").addEventListener("mousemove", function(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    document.getElementById("canvas-interactive").addEventListener("touchstart", function(event) {
        mouse.x = event.changedTouches[0].clientX;
        mouse.y = event.changedTouches[0].clientY;
    }, false);

    document.getElementById("canvas-interactive").addEventListener("touchmove", function(event) {
        event.preventDefault();
        mouse.x = event.targetTouches[0].clientX;
        mouse.y = event.targetTouches[0].clientY;
    }, false);

    document.getElementById("canvas-interactive").addEventListener("touchend", function(event) {
        event.preventDefault();
        mouse.x = 0;
        mouse.y = 0;
    }, false);

    window.onresize = function(){
        width = canvasInteractive.width = canvasReference.width = document.body.clientWidth;
        height = canvasInteractive.height = canvasReference.height = document.body.clientHeight;
        clearCanvas();
        m =width/180;
        n =height /87;
        center.x =width / 2;
        center.y = height / 2;
        logoLocation.x = (center.x - defaultImage.width*m/2)/m;
        logoLocation.y = (center.y - defaultImage.height*n/2)/n;
        a = (width>1000)?3:2;
        rf=1;
        init(defaultImage);
        rf=0;
    };

    init(defaultImage);
    animate();

}
