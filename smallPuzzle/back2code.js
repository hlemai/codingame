/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var stepIni=4;
var stepInc=1;
var changerythme=3;
var lines=[20];

function count(s1, letter) {
    return ( s1.match( RegExp(letter,'g') ) || [] ).length;
}

function calcHorz(x,y,x2) {
    printErr('calcHorz '+x+','+y+','+x2);
    if (x<x2) {
        if(x2>31) {
            x2=31;
        }
        str=lines[y].substr(x,x2-x);
    }
    else {
        if(x2<0) {
            x2=0;
        }
        str=lines[y].substr(x2,x-x2);
    }
    printErr(str);
    
    if(x==x2)
        return 0;
    return count(str,'\\.');

}

function calcVert(x,y,y2) {
    printErr('calcVert '+x+','+y+','+y2);
    var str='';
    var i=0;
    if (y<y2) {
        if(y2>19) {
            y2=19;
        }
        for(i=y;i<=y2;i++)
            str += lines[i][x];
    }
    else {
        if(y2<0) {
            y2=0;
        }
        for(i=y2;i<=y;i++)
            str += lines[i][x];
    }
    if(y==y2)
        return 0;
    printErr(str);
    return count(str,'\\.');
}

var opponentCount = parseInt(readline()); // Opponent count

var level=0;
var step=stepIni;
var sensx=-1;
var sensy=1;

var destx= -1;
var desty= -1;
var xOrig= -1;
var yOrig= -1;
var changed=0;


// game loop
while (true) {
    var gameRound = parseInt(readline());
    var inputs = readline().split(' ');
    var x = parseInt(inputs[0]); // Your x position
    var y = parseInt(inputs[1]); // Your y position
    var free=[0,0,0,0];

    var backInTimeLeft = parseInt(inputs[2]); // Remaining back in time
    
    for (var i = 0; i < opponentCount; i++) {
        var inputs = readline().split(' ');
        var opponentX = parseInt(inputs[0]); // X position of the opponent
        var opponentY = parseInt(inputs[1]); // Y position of the opponent
        var opponentBackInTimeLeft = parseInt(inputs[2]); // Remaining back in time of the opponent
    }
    
    for (var i = 0; i < 20; i++) {
        var line = readline(); // One line of the map ('.' = free, '0' = you, otherwise the id of the opponent)
        lines[i]=line;
        if(i<10)
        {
            free[0] += count(line.substr(0,16),'\\.');
            free[1] += count(line.substr(16,16),'\\.');
        }
        else 
        {
            free[2] += count(line.substr(0,16),'\\.');
            free[3] += count(line.substr(16,16),'\\.');
        }
    }
    
    printErr('free : '+free[0]+','+free[1]+','+free[2]+','+free[3]);
    
    var str='';
    
    if(xOrig===-1)
    {
        xOrig=x;
        yOrig=y;
    }
    if(destx < 0)
    {
        destx= x-step;
        desty= y-step;
        
        if(destx<0)
            destx = x+step;
        if(desty<0)
            desty = y+step;
        str='init';
    }

    if(x===destx && y===desty)
    {
    
        if( level===0 )
        {
            level = 1;
            destx = xOrig;
            desty = yOrig;
            str = 'backToOrigin';
        }
        else if( level===1 )
        {
            level = 0;
            step=step+stepInc;
            
            //calculer le sens par rapport aux plus de places libre dans les carré autour
            if(calcHorz(x,y,x+step*sensx) < calcHorz(x,y,x-step*sensx)) {
                sensx =-1*sensx; 
            }
            
            if(calcVert(x,y,y+step*sensy)<calcVert(x,y,y-step*sensy)) {
                sensy = -1*sensy;
            }
            
            destx = x+step*sensx;
            desty = y+step*sensy;
            
            
            if(destx < 0)
                destx = x-step*sensx;
            if(desty < 0)
                desty = y-step*sensy;

                if(destx < 0)
                    destx = 0;
                if(desty < 0)
                    desty = 0;
                if(destx > 34)
                    destx = 34;
                if(desty > 19)
                    desty = 19;
                    
            printErr ('Try dest to ' + destx + ',' + desty + ' sens : '+sensx + ',' + sensy);
            while( lines[desty][destx]!='.' && desty>0 && desty < 19)
            {
                desty += -sensy;
            }
            
            str =' sens:' + sensx + ',' + sensy + '*' + step;
            
            // faut-il changer ?
            changed++;
            if( (changed%changerythme)===0)
            {
                str='movez ';
                if( (free[0]+free[1]) > (free[2]+free[3]) )
                {
                    yOrig=5;
                    str+='T ';
                    if(free[0]>free[1])
                        xOrig=8;
                    else
                        xOrig=24;
                }
                else 
                {
                    yOrig = 15;
                    str = 'B';
                    if(free[2]>free[3])
                        xOrig=8;
                    else
                        xOrig=24;
                        
                    str+=free[2]+','+free[3];
                }

                
                step=stepIni;
                printErr("try with "+xOrig+','+yOrig );
                var tryx1=xOrig;
                // si le point est occupé, on décale
                while(lines[yOrig][tryx1]!='.'&& tryx1>0 && tryx1<32)
                {
                    tryx1 += sensx;
                }
                var tryx2=xOrig;
                while(lines[yOrig][tryx2]!='.'&& tryx2>0 && tryx2<32)
                {
                    tryx2 -= sensx;
                }
                if(tryx2*sensx>tryx1*sensx)
                    xOrig=tryx1;
                else
                    xOrig=tryx2;
                    
                
                if(destx < 0 || destx > 31)
                {
                    destx = 16;
                    step++;
                }
                if(desty < 0 || desty > 19)
                {
                    destY = 3;
                    step++;
                }
            }

        }
    }

    if(destx<0)
        destx=0;
    if(desty<0)
        desty=0;
    if(destx>34)
        destx=34;
    if(desty>19)
        desty=19;
    print(destx + ' '+ desty+ ' -> '+str);
    // action: "x y" to move or "BACK rounds" to go back in time
   // print('17 10');
}