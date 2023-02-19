$(document).ready(function() {

    var synth_playing = false
    const synth = new Tone.PolySynth({
        onsilence: () => synth_playing=false
      }).toDestination()

    grid_radius = 8 // 8 hexagons in grid radius

    //attach a click listener to a play button
    document.querySelector('button')?.addEventListener('click', async () => {
        await Tone.start()
        console.log('audio is ready')
    })

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
    HEX_ACTIVE = ['H(-2, -4, 6)', 'H(-2, -2, 6)']
    HEX_PLAY = {}
    HEX_TO_NODE = {}
    HEX_TO_NOTE = {}
    function getData() {
        $.get("/latent", function(data_){
            // CONSONANCE = data.consonance
            // HEX_ACTIVE = data.hex_active
            data = JSON.parse(data_)
            console.log("DATA", data)
            for (i=0; i<data.length; i++)
            {
                console.log(data[i][0])
                HEX_ACTIVE.push(String(data[i][0]["coord"]))
                HEX_TO_NOTE[String(data[i][0]["coord"])] = data[i][0]["note"]
            }
            // console.log(HEX_TO_NOTE)
            // ha = data.hex_active.coord
            // HEX_ACTIVE = Object.keys(ha)
        });
    }  

    function playNote(notes) {
        if(notes && !synth_playing){
            console.log("Notes", notes)
            var more_notes = []
            notes.forEach(element => {
                more_notes.push(element + "5")
            });
            console.log("Playing note " + more_notes)
            const current_time = Tone.now()
            synth.triggerAttackRelease(more_notes, "8n", current_time)
            synth_playing=true
        } else {
            // console.log("Note undefined")
        }
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

    function drawNodes(nodes)
    {   
        var notes_to_play = []
        for (i=0; i<HEX_ACTIVE.length; i++)
        {
            hex = HEX_ACTIVE[i]
            h = nodes[hex]
            r = Math.random()*12
            // r = 1+2/timeToPlay(h)
            drawStar(h[0],h[1],r)
            // console.log("PLAYING NOTE", hex, 
            to_play_n = HEX_TO_NOTE[hex]
            if (! (to_play_n in notes_to_play)) {
                notes_to_play.push(to_play_n)
            }
        }
        playNote(notes_to_play)
    }

    function checkNodes()
    {
        for (i=0; i<HEX_ACTIVE.length; i++)
        {
            h = HEX_ACTIVE[i]
            if (!(h in HEX_TO_NODE))
            {
                hex_c_idx = parseInt(Math.random()*hex_c.length)
                HEX_TO_NODE[h] = hex_c[hex_c_idx]
            }
        }

        for (i=0; i<HEX_TO_NODE.length; i++)
        {
            h = HEX_TO_NODE[i]
            if (!(h in HEX_ACTIVE))
            {
                delete HEX_TO_NODE[h]
            }
        }
    }

    // Black bg
    fillCanvas()

    // function drawParticle(x,y,r)
    // {
    //     ctx.beginPath()
    //     ctx.fillStyle = '#fff'
    //     ctx.lineWidth = 2
    //     ctx.strokeStyle = '#fff'
        
    //     // draw shape
    //     ctx.arc(x, y, r, 0, 2 * Math.PI);
    //     ctx.fill()
    //     ctx.closePath()
    // }


    // drawParticle(260,260,2)
    interval = window.setInterval(function(){
        getData()
        ts = Date.now()

        if (ts%bar_length == 0)
        {
            generatePlayTimes()
        }

        checkNodes()
        drawNodes(HEX_TO_NODE)
    }, 500); 

});