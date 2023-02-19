$(document).ready(function() {

    function getData() {
        $.get("/latent", function(data){
            console.log(data)
        });
    }    

    grid_radius = 8 // 8 hexagons in grid radius

    function generateGridCoordinates()
    {
        center = [250, 250]
        coords = []
        hr = 15
        hd = 2*hr
        // Assume hexagon radius is 1
        // Start with middle row
        for (j=0; j<grid_radius; j++)
        {

            for (i=0; i<grid_radius-j; i++)
            {
                
                if (j%2==1)
                {
                    offset = hr
                }
                else
                {
                    offset = 0
                }
                
                x1 = center[0]+i*hd+offset
                x2 = center[0]-i*hd+offset
                y1 = center[1]+j*hd
                y2 = center[1]-j*hd

                coords.push([x1,y1])
                coords.push([x1,y2])
                coords.push([x2,y1])
                coords.push([x2,y2])
                // if (y1==center[1])
                // {
                //     coords.push([x1,y2])
                // }
                // if (x1!=center[0])
                // {
                //     coords.push([x2,y1])
                // }      
                // if (x1!=center[0] && y1!=center[1])
                // {
                //     coords.push([x2,y2])
                // }
            }
        }
        coords = [...new Set(coords)];
        return coords
    }

    hex_c = generateGridCoordinates()
    hex_active = {}

    var canvas = document.querySelector("#sky-canvas")
    var ctx = canvas.getContext("2d")
    var canvasWidth = canvas.width = 500
    var canvasHeight = canvas.height = 500

    function fillCanvas()
    {
        ctx.beginPath()
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        ctx.closePath()
    }

    function drawStar(x,y,r)
    {
        ctx.beginPath()
        ctx.fillStyle = '#fff'
        ctx.lineWidth = 2
        // ctx.strokeStyle = '#fff'
        radgrad = ctx.createRadialGradient(x, y, 0, x, y, r)
        radgrad.addColorStop(0, 'rgba(0,0,255,1)');
        radgrad.addColorStop(0.6, 'rgba(0,120,250,.9)');
        radgrad.addColorStop(1, 'rgba(255,255,255,0)');
        
        // draw shape
        ctx.fillStyle = radgrad;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        // ctx.fillRect(0,0,r,r);
        ctx.fill()
        ctx.closePath()
    }

    function drawGrid()
    {
        for (i=0; i<hex_c.length; i++)
        {
            c = hex_c[i]
            r = Math.random()*12
            drawStar(c[0],c[1],r)
        }
    }

    fillCanvas()
    drawGrid()


    function drawParticle(x,y,r)
    {
        ctx.beginPath()
        ctx.fillStyle = '#fff'
        ctx.lineWidth = 2
        ctx.strokeStyle = '#fff'
        
        // draw shape
        ctx.fillStyle = radgrad;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill()
        ctx.closePath()
    }

    drawParticles()

    // interval = window.setInterval(function(){
    //     // getData()
    //     fillCanvas()
    //     drawGrid()
    // }, 500); 

});