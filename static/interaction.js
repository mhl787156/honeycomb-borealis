$(document).ready(function() {

    var canvas = document.querySelector("#arena")   // Get access to HTML canvas element
    var ctx = canvas.getContext("2d")
    // var canvasWidth = canvas.width = $('input[name=arena_w]').val()
    // var canvasHeight = canvas.height = $('input[name=arena_h]').val()

    const a = 2 * Math.PI / 6; // Generating Hexgrid
    const r = 40; // Size
    const canvas_center = [canvas.width/2, canvas.height/2]

    const cells = [] // Cells By XY Location


    function init() {
        drawGrid(canvas.width, canvas.height);
        console.log(cells)
    }
    init();

    function drawGrid(width, height) {
        let i = 0
        for (let y = r; y + r * Math.sin(a) < width; y += r * Math.sin(a)) {
            for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < height; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
                hex = drawHexagon(y, x);
                ctx.font = "10px Arial";
                ctx.fillText(hex["cube"].toString(), y, x);
                i += 1
            }
        }
    }

    function drawHexagon(x, y) {
        let points = []
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            let pointx = x + r * Math.sin(a * i)
            let pointy = y + r * Math.cos(a * i)
            ctx.lineTo(pointx, pointy);
            points.push([pointx, pointy])
        }
        ctx.closePath();
        ctx.stroke();

        cartesian_coord_rel_to_center = [x - canvas_center[0], y - canvas_center[1]]

        let hexagon = {
            "points": points,
            "center": [x, y],
            "cube": cartesian_to_cube(cartesian_coord_rel_to_center)
        }
        cells.push(hexagon)
        return hexagon
    }

    function cartesian_to_cube(point) {
        // Convert cartesian to axial first
        var qa = (Math.sqrt(3)/3 * point[0]  -  1./3 * point[1]) / r
        var ra = (                        2./3 * point[1]) / r
        return cube_round(axial_to_cube([qa, ra]))
    }

    function cube_round(frac){
        var q = Math.round(frac[0])
        var r = Math.round(frac[1])
        var s = Math.round(frac[2])

        var q_diff = Math.abs(q - frac[0])
        var r_diff = Math.abs(r - frac[1])
        var s_diff = Math.abs(s - frac[2])

        if (q_diff > r_diff && q_diff > s_diff) {
            q = -r-s
        } else if (r_diff > s_diff){
            r = -q-s
        } else {
            s = -q-r
        }

        return [q, r, s]
    }

    function axial_to_cube(hex){
        var q = hex[0]
        var r = hex[1]
        var s = -q-r
        return [q, r, s]
    }
})

