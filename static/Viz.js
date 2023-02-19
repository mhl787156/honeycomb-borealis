
Active_points_X = 100
Active_points_Y = 100

Active_points_strength =[]

Particles_X = []
Particles_Y = []

r = Math.random()*2

function create_Particles(Active_points_X,Active_points_Y)
{
    for (i=0; i<20; i++)
   {
    Particles_X[i]=math.floor(math.random*(Active_points_X+50))+(Active_points_X-50)
    Particles_Y[i]=math.floor(math.random*(Active_points_Y+50))+(Active_points_Y-50)
   }
}


function draw_Particles()
{
    for (i=0; i<20; i++)
    {
        drawStar(Particles_X[i],Particles_Y[i],r)
    } 
}

function disperse_Particles()
{
        Vel = Math.random()*2 
     for (i=0; i<20; i++)
       {
         Particles_X[i] = Particles_X[i] + Vel
         Particles_Y[i] = Particles_Y[i] + Vel
         drawStar(Particles_X[i],Particles_Y[i],r)
       } 
    
}

function distroy_Particles()
{
    for (i=0; i<20; i++)
    {
        Particles_X[i] = -1000;
        Particles_Y[i] = -1000;
        drawStar(Particles_X[i],Particles_Y[i],r)
    }
}

interval = window.setInterval(function(){
    // getData()
    fillCanvas()
    disperse_Particles()
}, 500);







