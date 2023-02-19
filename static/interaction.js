$(document).ready(function() {

    var canvas = document.querySelector("#arena")   // Get access to HTML canvas element
    var canvasWidth = canvas.width = 1400
    var canvasHeight = canvas.height = 650
    var ctx = canvas.getContext("2d")

    const a = 2 * Math.PI / 6; // Generating Hexgrid
    const r = 50; // Size
    const canvas_center = [canvas.width/2, canvas.height/2]

    const cells = [] // List of hex cells with "point", "center" and "cube"
    const cells_lookup = {}

    var users = []
    var user = null
    var initialised = false
    var grabbed_backend_data = false

    var clicked_fillstyle = "green"
    var active_fillstyle = "yellow"

    // State Boolean Checks
    var show_grid_annotations = false

    // REGISTER BUTTONS
    $( "#add" ).click(function() {
        console.log("Add Button Clicked")
        $.get("new_participant", function(data, status){
            // alert("Data: " + ?data + "\nStatus: " + status);
            console.log(data)
            user = data

            $("#user_status").text("User now " + user)
        });
    });

    $( "#remove" ).click(function() {
        console.log("Remove Button Clicked")
        $.post("participants/"+user['uuid'], {"function": "DELETE"}, function(data, status){
            // alert("Data: " + ?data + "\nStatus: " + status);
            console.log(data)
            user=null
            $("#user_status").text("")
        });
    });

    $("#show_grid_annotations").click(function() {
        show_grid_annotations = !show_grid_annotations
    })

    // Select Cell on click
    canvas.addEventListener('mousedown', function(e) {
        cursor_pos = getCursorPosition(canvas, e)
        x = cursor_pos[0] - canvas_center[0] - r/1.4
        y = cursor_pos[1] - canvas_center[1] - r/1.9
        clicked_cell = select_cell_at_location([x, y])
        clicked_cell["clicked"] = true
        setTimeout(function(){clicked_cell["clicked"] = false}, 250)
    })

    function select_cell_at_location(pos) {
        cell_coord = cartesian_to_cube(pos)
        clicked_cell_idx = cells_lookup[hash_cube_coord(cell_coord)]
        clicked_cell = cells[clicked_cell_idx]
        return clicked_cell
    }

    //////////////////////////////////
    //////////////////// MAIN FUNCTIONS
    //////////////////////////////////
    function init() {
        generateGrid(canvas.width, canvas.height);
        apply_backend_grid()
        console.log(cells)
        initialised = true
    }
    init()

    var loopcount = 0
    interval = window.setInterval(loop, 250)
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        

        if(loopcount % 10 == 0){update_state()}

        // Disable all active cells
        cells.forEach(function(item){item["active"]=false})

        // Parse user and activate its cells
        var user_locs = []
        users.forEach(function(subuser) {
            cube = subuser["cell"]["coord"]
            user_cell = cells[cells_lookup[hash_cube_coord(cube)]]
            user_cell["active"] = true
            user_locs.push(user_cell["center"])
            
        })

        drawCells();
        if(show_grid_annotations){annotateGrid()}

        user_locs.forEach(function(loc){draw_user_stick_figure(loc)})

        loopcount = loopcount + 1
    }

    // BACKEND COMMUNICATION FUNCIONALITY
    function update_state() {
        $.get("state", function(data_, status){
            // alert("Data: " + ?data + "\nStatus: " + status);
            data = JSON.parse(data_)
            console.log(data)
            users = data["users"]
        });
    }

    function apply_backend_grid() {
        $.get("grid", function(data_, status){
            data = JSON.parse(data_)
            // console.log(data)

            cells.forEach(function(item) {
                let ic = item["cube"]
                for (var i = 0; i < data["grid"].length; i++) {
                    cubes = data["grid"][i]["coord"]
                    if (cubes[0] == ic[0] && cubes[1] == ic[1] && cubes[2] == ic[2]) {
                        item["note"] = data["grid"][i]["note"]
                        break
                    }
                }
            })

            grabbed_backend_data = true
        });
    }  
    // GRID DRAWING FUNCTIONS

    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        return [x, y]
    }
    

    function annotateGrid() {
        ctx.strokeStyle = "black"
        ctx.fillStyle = "black"
        cells.forEach(function(item){
            var position = item["center"]
            if ("note" in item) {
                ctx.font = "20px Arial";
                ctx.fillText(item["note"].toString(), position[0]-8, position[1]);
            }
            ctx.font = "10px Arial";
            ctx.fillText(item["cube"].toString(), position[0]-15, position[1]+20);
        }) 
    }

    function generateGrid(width, height) {
        for (let y = r; y + r * Math.sin(a) < width; y += r * Math.sin(a)) {
            for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < height; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
                // drawHexagon(y, x);
                xa = y
                ya = x
                cartesian_coord_rel_to_center = [xa - canvas_center[0], ya - canvas_center[1]]
                cube_coord = cartesian_to_cube(cartesian_coord_rel_to_center)

                let hexagon = {
                    "center": [xa, ya],
                    "cube": cube_coord
                }
                cells.push(hexagon)
                let index = cells.length-1
                cells_lookup[hash_cube_coord(cube_coord)] = index
            }
        }
    }

    function drawCells() {
        cells.forEach(drawCell);
    }

    function drawCell(cell) {
        x = cell['center'][0]
        y = cell['center'][1]

        ctx.strokeStyle = "black"
        let points = []
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            let pointx = x + r * Math.sin(a * i)
            let pointy = y + r * Math.cos(a * i)
            ctx.lineTo(pointx, pointy);
            points.push([pointx, pointy])
        }
        ctx.closePath();

        if (cell["clicked"]) { 
            ctx.fillStyle = clicked_fillstyle
            ctx.fill()
        } else if (cell["active"]){
            ctx.fillStyle = active_fillstyle
            ctx.fill()
        } else {
            ctx.stroke()
        }
    }

    function hash_cube_coord(coord){
        return coord[0]+"_" + coord[1] + "_" + coord[2]
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

    function draw_user_stick_figure(cell_center) {
        x = cell_center[0]
        y = cell_center[1]

        xb = x
        yb = y+10

        ya = yb-20

        ctx.beginPath();
        ctx.fillStyle = "#0000ff"; // #ffe4c4
        ctx.arc(xb, ya-8, 8, 0, Math.PI * 2, true); // draw circle for head
        // (x,y) center, radius, start angle, end angle, anticlockwise
        ctx.fill();

        // arms
        ctx.beginPath();
        ctx.strokeStyle = "pink"; 
        ctx.moveTo(xb, ya);
        ctx.lineTo(xb-10, yb+5);
        ctx.moveTo(xb, ya);
        ctx.lineTo(xb+10, yb+5);
        ctx.stroke();

        // body
        ctx.beginPath();
        ctx.moveTo(xb, ya);
        ctx.lineTo(xb, yb);
        ctx.strokeStyle = "navy";
        ctx.stroke();

        // legs
        ctx.beginPath();
        ctx.strokeStyle = "brown";
        ctx.moveTo(xb, yb);
        ctx.lineTo(xb-10, yb+20);
        ctx.moveTo(xb, yb);
        ctx.lineTo(xb+10, yb+20);
        ctx.stroke();
    }
})

