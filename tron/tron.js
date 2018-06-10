/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

function Player(x0,y0,x1,y1) {
    this.X0=x0;
    this.Y0=y0;
    this.X1=x1;
    this.Y1=y1;
}
function TronMap(){
    this.map=new Array(30);
    this.mapcopy=new Array(30);
    
    this.init=function()  {
        for(var i=0;i<30;i++)
        {
            this.map[i]=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        }
    };
    
    this.update=function(players,len){
        for(var i=0;i<len;i++)
        {
            this.map[players[i].X0][players[i].Y0]=i+1;
            this.map[players[i].X1][players[i].Y1]=i+1;
        }
    };

    this.isPermited=function (map,x,y,direction) {
        var destx=x;
        var desty=y;
        switch(direction)
        {
            case "UP" :
                desty--;
                break;
            case "DOWN":
                desty++;
                break;
            case "LEFT":
                destx--;
                break;
            case "RIGHT":
                destx++;
                break;
        }
        if(destx <0 || destx>29)
            return false;
        if(desty<0 || desty>19)
            return false;
        if(map[destx][desty]==0)
            return true;
        return false;
    };
    this.countPermited=function (map,x,y,direction) {
        
        var destx=x;
        var desty=y;
        var count=0;
        while (true) {
            switch(direction)
            {
                case "UP" :
                    desty--;
                    break;
                case "DOWN":
                    desty++;
                    break;
                case "LEFT":
                    destx--;
                    break;
                case "RIGHT":
                    destx++;
                    break;
            }
            if(destx <0 || destx>29)
                break;
            if(desty<0 || desty>19)
                break;
            if(map[destx][desty]!=0)
                break;
            count++;
        }
        return count;
    };

    this.trymultiple=function (trys,x,y,curdirection){
        // todo -> copier la map
        // remplir la map avec mes mouvements
        var mapcopy=new Array(30);
        for(var a=0;a<30;a++) {
            mapcopy[a]=new Array(20);
            for(var b=0;b<20;b++) {
                mapcopy[a][b]=this.map[a][b];
            }
        }
        
        var destx=x;
        var desty=y;
        var direction=curdirection;
        for(var i=0;i<trys;i++) {
            switch(direction)
            {
                case "UP" :
                    desty--;
                    break;
                case "DOWN":
                    desty++;
                    break;
                case "LEFT":
                    destx--;
                    break;
                case "RIGHT":
                    destx++;
                    break;
            }
            if(destx <0 || destx>29)
                return false;
            if(desty<0 || desty>19)
                return false;
            if(mapcopy[destx][desty]===0)
            {
                mapcopy[destx][desty]=1;
                direction=getNextMvt(mapcopy, destx,desty);
            }
            else
                return false;
        }
        return true;
    };

}

function printMap(tronMap){
    for(var j=0;j<20;j++)
    {
        var line='';
        for(var i=0;i<30;i++)
            line+=tronMap.map[i][j]+'-';
        printErr(line);
    }
}

function getNextMvt(map,X,Y) {
    var res="NOWAY";
    var up=tronMap.countPermited(map,X, Y, "UP");
    var down=tronMap.countPermited(map,X, Y, "DOWN");
    var left=tronMap.countPermited(map,X, Y, "LEFT");
    var right=tronMap.countPermited(map,X, Y, "RIGHT");
    if (up!=0 && up>=down)
        res = "UP";
    else if (down!=0 && down>=up)
        res = "DOWN";
    else if (left!=0 && left>=right)
        res = "LEFT";
    else if (right!=0)
        res = "RIGHT";
    return res;
}


var tronMap=new TronMap();
tronMap.init();

// game loop
while (true) {
    // To debug: printErr('Debug messages...');
    var inputs = readline().split(' ');
    var N = parseInt(inputs[0]); // total number of players (2 to 4).
    var P = parseInt(inputs[1]); // your player number (0 to 3).
    var players = new Array(N);
    for (var i = 0; i < N; i++) {
        var inputs = readline().split(' ');
        
        var X0 = parseInt(inputs[0]); // starting X coordinate of lightcycle (or -1)
        var Y0 = parseInt(inputs[1]); // starting Y coordinate of lightcycle (or -1)
        var X1 = parseInt(inputs[2]); // starting X coordinate of lightcycle (can be the same as X0 if you play before this player)
        var Y1 = parseInt(inputs[3]); // starting Y coordinate of lightcycle (can be the same as Y0 if you play before this player)
        var player= new Player(X0,Y0,X1,Y1);
        players[i]=player;
    }
    tronMap.update(players,N);
    //printMap(tronMap);
    
    // aller au plus vite vers le bord, puis encadrer
    //printErr(players[P].X1 + " " + players[P].Y1);


    //tactique : HAUT BAS GAUCHE DROITE
    var tryx=players[P].X1;
    var tryy=players[P].Y1;
    
    res=getNextMvt(tronMap.map,tryx,tryy );
    /*
    if(tronMap.trymultiple(50,tryx,tryy,res)===false) {
        printErr('*************************** ça va planter !');
        printErr('from '+res);
        if (res !="DOWN" && tronMap.isPermited(tronMap.map,tryx,tryy, "DOWN"))
            res = "DOWN";
        else if (res !="LEFT" && tronMap.isPermited(tronMap.map,tryx,tryy, "LEFT"))
            res = "LEFT";
        else if (res!="RIGT" && tronMap.isPermited(tronMap.map,tryx,tryy, "RIGHT"))
            res = "RIGHT";
        printErr('to '+res);
    }*/

    print(res); // A single line with UP, DOWN, LEFT or RIGHT
}

/*
deathcode 
    var rand=Math.round((Math.random())*4);
    printErr(rand);
    switch(rand)
    {
        case 1:res="UP";break;
        case 2:res="RIGHT";break;
        case 3:res="DOWN";break;
    }
*/