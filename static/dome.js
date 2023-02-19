$(document).ready(function() {

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
            }
        }
        coords = [...new Set(coords)];
        return coords
    }

    hex_c = generateGridCoordinates()

    bar_length = 1000
    CONSONANCE = 0.5
    HEX_ACTIVE = {}
    HEX_PLAY = {}
    function getData() {
        $.get("/latent", function(data){
            CONSONANCE = data.consonance
            HEX_ACTIVE = data.hex_active
        });
    }  

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

    function generatePlayTimes()
    {
        for (i=0; i<HEX_ACTIVE.length; i++)
        {
            h = HEX_ACTIVE[i]
            HEX_PLAY[h] = Math.random()*bar_length
        }
    }

    function timeToPlay(hex)
    {
        ts_now = Date.now()
        return HEX_PLAY[hex] - ts_now
    }

    function drawNodes()
    {
        for (i=0; i<HEX_ACTIVE.length; i++)
        {
            h = HEX_ACTIVE[i]
            // r = Math.random()*12
            max_r = 3
            r = 1+2/timeToPlay(h)
            drawStar(c[0],c[1],r)
        }
    }

    // Black bg
    fillCanvas()

    function drawParticle(x,y,r)
    {
        ctx.beginPath()
        ctx.fillStyle = '#fff'
        ctx.lineWidth = 2
        ctx.strokeStyle = '#fff'
        
        // draw shape
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill()
        ctx.closePath()
    }

    drawParticle(260,260,2)
    
    interval = window.setInterval(function(){
        getData()
        
        ts = Data.now()
        if (ts%bar_length == 0)
        {
            generatePlayTimes()
        }

        drawNodes()
        
        console.log(CONSONANCE)
        // fillCanvas()
        // drawGrid()
    }, 50); 

});