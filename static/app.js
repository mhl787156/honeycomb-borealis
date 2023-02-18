$(document).ready(function() {

    
    function drawAxes() {
         // Add axis labels to arena
        yaxis = $('#yaxis')
        xaxis = $('#xaxis')
        cpos = $('#arena').offset()
        yaxis.offset({'left': cpos.left-yaxis.width(), 'top': cpos.top-5})
        xaxis.offset({'left': cpos.left-5, 'top': cpos.top+504})

        var ycanv = document.querySelector("#yaxis")
        var yctx = ycanv.getContext("2d")
        yh = ycanv.height = 513
        yw = ycanv.width = 100
        t0 = yw-10
        t1 = yw
        text_pos = t0-30
        ticks = [6,106,206,306,406,508]
        text = [500,400,300,200,100]
        $.each(ticks, function( index, tick ){
            yctx.beginPath()
            yctx.lineWidth = 2
            yctx.strokeStyle = '#2b2b2b'
            yctx.moveTo(t0, tick)
            yctx.lineTo(t1,tick)
            yctx.stroke()
            if (index < 5) {
                yctx.font = "14px Helvetica bold";
                yctx.fillStyle = '#2b2b2b';
                yctx.fillText(text[index], text_pos, tick+5);
            }
            yctx.closePath()
        })
        yctx.fillText(0, text_pos+15, 512);

        var xcanv = document.querySelector("#xaxis")
        var xctx = xcanv.getContext("2d")
        xh = xcanv.height = 100
        xw = xcanv.width = 520
        t0 = 0
        t1 = 10
        text_pos = t0+26
        ticks = [6,106,206,306,406,508]
        text = [0,100,200,300,400,500]
        $.each(ticks, function( index, tick ){
            xctx.beginPath()
            xctx.lineWidth = 2
            xctx.strokeStyle = '#2b2b2b'
            xctx.moveTo(tick, t0)
            xctx.lineTo(tick, t1)
            xctx.stroke()
            if (index > 0) {
                xctx.font = "14px Helvetica bold";
                xctx.fillStyle = '#2b2b2b';
                xctx.fillText(text[index], tick-14, text_pos);
            }
            xctx.closePath()
        })    
        xctx.fillText(0, 2, text_pos);
    }

    // Main canvas drawing

    var canvas = document.querySelector("#arena")   // Get access to HTML canvas element
    var ctx = canvas.getContext("2d")
    var canvasWidth = canvas.width = $('input[name=arena_w]').val()
    var canvasHeight = canvas.height = $('input[name=arena_h]').val()

    drawAxes()
})

