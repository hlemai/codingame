
/* Game Of Drone. Implémentation de hlemai
  - tactic V10 : vitesse si pas beaucoup de drone, effort si beaucoup
 */

class MockConsole {
  constructor() {
    if(typeof(readline) != "undefined"){
      this.readline=readline;
    }
    else {
      this.readline= function() {
        return "2 0 10 4";
      };
    }
    if(typeof(printErr) != "undefined" ) {
      this.printErr=printErr;
      this.print=print;
    }
    else {
      this.printErr=function(txt) {console.log(txt);};
      this.print=function(txt) {console.error(txt);};
    }
  }
}
cons=new MockConsole();

// Globals
var inputs = cons.readline().split(' ');
var P = parseInt(inputs[0]); // number of players in the game (2 to 4 players)
var ID = parseInt(inputs[1]); // ID of your player (0, 1, 2, or 3)
var D = parseInt(inputs[2]); // number of drones in each team (3 to 11)
var Z = parseInt(inputs[3]); // number of zones on the map (4 to 8)
var MAXDIST=9000;
var EPSILON=0.01;
var OPT_SEUILTARGET=4000; // seuil de distance pour prendre en compte un drone ennemi qui cible une zone
var OPT_CONTINUE_MOVE=true; // pour un drone, si la zone que je cible fait partie de la cible, je la garde.
var OPT_REPRIZE_ALWAYS=true;
var OPT_LOOSEFACTOR=10;
var OPT_FOCUS1RSTFACTOR=1;

var VITESSE_FOCUS_PREMIER=1;
var VITESSE_PURE=2;
var EFFORT_FACTORISE=3;
var MODE=EFFORT_FACTORISE;

/*
  selection de la tactique en fonction du nombre de D et de P et de Z !
*/

if(D+P<Z)
  MODE = VITESSE_PURE;
else if (P<=2 || D<Z) {
  OPT_LOOSEFACTOR=1;
}

//tableau des zones (type Zone)
var zones = new Array(Z);
//tableau des tableau de drone (pour chaque joueur)
var drones = new Array(P);
var ranks = new Array(P);
var tour = 0;
var maxtour=200;
var maxtourMooving=20;

/* 
  fonction math utiles pour les calcul de distance et pour vérifier l'alignement
*/
function dist(X1, Y1, X2, Y2) {
  return Math.sqrt((X1 - X2) * (X1 - X2) + (Y1 - Y2) * (Y1 - Y2));
}

function isTargeted(X1,Y1,X2,Y2,X3,Y3){
  var pente1=0.0;
  var pente2=0.0;
  var deltax1=0.0;
  var deltax2=0.0;
  var deltay1=0.0;
  var deltay2=0.0;

  if(X2 === X1) {
    if(X3 === X1 && Math.sign(Y2-Y1)=== Math.sign(Y3-Y1))
      return true;
    else 
      return false;
  }
  deltax1=X2-X1;
  deltay1=Y2-Y1;
  deltax2=X3-X1;
  deltay2=Y3-Y1;

  pente1=deltay1/deltax1;
  if(X3==X1)
    return false;
  pente2=deltay2/deltax2;

  //console.log("  pentes "+pente1+" "+pente2);
  if(Math.sign(deltax1) === Math.sign(deltax2) && Math.sign(deltay1) === Math.sign(deltay2) && Math.abs(pente2-pente1) <EPSILON)
    return true;
 return false;
}


/*
 Class Zone
 ==========
 - memorise les données de zones avec les dronesPerPlayer

 */
class Zone {
  constructor(zone,X, Y) {
    this.zone = zone;
    this.X = X;
    this.Y = Y;
    this.target = 0;
    this.actual = 0;
    this.ID = -1;
    this.droneperPlayer = new Array(P); // par joueur, chaque player à combien de drone ?
    this.attackperPlayer = new Array(P); // par joueur, combien de drones sont lancé sur la zone
    this.arrayDronePerPlayer = new Array(P);
  }
  //remise à 0 des droneperPlayer
  initPlayerDrone() {
    for (var i = 0; i < P; i++) {
        this.droneperPlayer[i] = 0;
        this.attackperPlayer[i] = 0;
        this.arrayDronePerPlayer[i]=new Array(D);
      }
  }
  //quel est le plus grand nombre de drone actuellement sur la zone (sauf moi)
  getMaxDrone() {
      var max = 0;
      for (var p = 0; p < P; p++) {
        if (p != ID)
          if (max < this.droneperPlayer[p])
            max = this.droneperPlayer[p];
      }
      return max;
  }
  //quel est le plus grand nombre de drone actuellement + attacké sur la zone (sauf moi)
  getAttackCount() {
    var max = 0;
    for (var p = 0; p < P; p++) {
      if (p != ID)
        if (max < (this.droneperPlayer[p]+this.attackperPlayer[p]))
          max = this.droneperPlayer[p]+this.attackperPlayer[p];
    }
    if(this.ID == ID)
      //c'est moi qui gagne, je m'éloigne...
      return max;
    else
      return max+1;
  }
  getMaxDist() {
    var numberOfDrone2Find=this.getAttackCount();
    numberOfDrone2Find = Math.min(numberOfDrone2Find,D);
    if(numberOfDrone2Find === 0)
        return MAXDIST;
    var ordereddrones = drones[ID].slice();
    ordereddrones.sort( (d1,d2) => d1.calcDist2Point(this.X,this.Y) - d2.calcDist2Point(this.X,this.Y));
    return ordereddrones[numberOfDrone2Find-1].calcDist2Point(this.X,this.Y);
  }

  getTotalDist() {
    var numberOfDrone2Find=this.getAttackCount();
    if(numberOfDrone2Find === 0)
        return MAXDIST*D;
    numberOfDrone2Find = Math.min(numberOfDrone2Find,D);
    var ordereddrones = drones[ID].slice();
    ordereddrones.sort( (d1,d2) => d1.calcDist2Point(this.X,this.Y) - d2.calcDist2Point(this.X,this.Y));
    var total=0;
    for (var d=0;d<numberOfDrone2Find;d++)
      total += ordereddrones[d].calcDist2Point(this.X,this.Y);

    return total;
  }
  /*
    Fonction de cout 
    ----------------
    Permet de classer les zones à atteindre par priorité
    */

  getCostFunction() {
    var factor=1;
    var loosable=false;
    if (this.getMaxDist()>this.getOpponentMaxDist()){
      loosable=true;
    }
    var playerMe=-1;
    for (var p=0 ;p<P;p++) {
      if(ranks[p].player === ID) {
        playerMe=p;
        break;
      }
    }
    if(loosable && MODE==EFFORT_FACTORISE )
      factor *= OPT_LOOSEFACTOR;

    if(playerMe>=2) {
      //je suis au mieux 3ième => aggressif
      if(this.ID != ranks[0].player)
        factor *= OPT_FOCUS1RSTFACTOR;
     } 
     /* 
     else {
     //si c'est ma zone
     if (this.ID === ID)
       factor=1;
     }
     */

     var cost=1.0;
     //vitesse pure
     switch (MODE) {
        case VITESSE_PURE:
          cost=this.getMaxDist();
          break;

        case EFFORT_FACTORISE :
          cost=factor*this.getTotalDist();
          break;
        
        case VITESSE_FOCUS_PREMIER :
          cost=factor * this.getMaxDist();
          break;
     }
     return cost;
  }

  getOpponentMaxDist() {
    var max=0;
    for (var p=0; p<P; p++) {
      if(p != ID) {
        var maxP=0;
        for(d=0;d<this.attackperPlayer[p];d++) {
          if(drones[p][d].dist2Zone > maxP )
            maxP=drones[p][d].dist2Zone;
            
        }
        //il n'envois pas assez de drone sur zone, faut pas le compter
        if(this.droneperPlayer[ID]+this.target <= this.droneperPlayer[p]+this.attackperPlayer[p]) {
          if(maxP>max)
            max=maxP;  
          }
      }
    }
    if(max===0)
      return MAXDIST;
    return max;
  }

}

/* 
  Class Drone
  ===========
  connaissance des positions et targets éventuelle de chaque drone
  */
class Drone {
  constructor(P, DX, DY) {
    this.DX = DX;
    this.DY = DY;
    this.Player = P;
    this.zone = -1;
    this.targetZone=-1;
    this.dist2Zone=MAXDIST;
    this.lastDX=-1;
    this.lastDY=-1;
  }
  isMe() {
      return this.Player == ID;
  }
  // find the zone or return -1
  findZone() {
      for (var i = 0; i < Z; i++) {
        if (dist(this.DX, this.DY, zones[i].X, zones[i].Y) <= 100) {
          this.zone = i;
          return i;
        }
      }
      this.zone=-1;
      return -1;
  }
  memLastpos() {
    this.lastDX=this.DX;
    this.lastDY=this.DY;
  }
  calcDist2Point(X,Y) {
    return dist(X,Y,this.DX,this.DY);
  }
  calcTargetZone(){
    if(this.Player==ID){
      if(this.zone === -1)
      this.targetZone=-1;
      return;
    }
      
    this.targetZone=-1;
    if(this.zone != -1) {
      return;
    }
    if(this.lastDX ===-1) {
      return;
    }
    if(this.lastDX === this.DX && this.lastDY === this.DY) {
      return;
    }
    this.dist2Zone=MAXDIST;
    for(var z=0;z<Z;z++) {
      if(isTargeted(this.lastDX,this.lastDY,this.DX,this.DY,zones[z].X,zones[z].Y))
      {
        var distZ=dist(this.DX,this.DY,zones[z].X,zones[z].Y);
        if(distZ<this.dist2Zone){
          this.targetZone=z;
          this.dist2Zone=distZ;
        }
      }
    }
  }
}
/*
  Classe Zonedist
  ===============
  Utile pour classer les zones en fonction de la distance à un drone.
  */
class Zonedist {
  constructor(zone,dist) {
    this.zone=zone;
    this.dist=dist;
  }
}
for (var i = 0; i < Z; i++) {
  var inputs = cons.readline().split(' ');

  var X = parseInt(inputs[0]);// corresponds to the position of the center of a zone. A zone is a circle with a radius of 100 units.
  var Y = parseInt(inputs[1]);
  zones[i] = new Zone(i,X, Y);
}
//liste ordonnée des zones pour les mouvements
var orderedzones =zones.slice();

function printTarget () {
  for (var i = 0; i < Z; i++) {
    var players = '-players ';
    for (var p = 0; p < P; p++) {
      players += p + ':' + zones[i].droneperPlayer[p] + ' ';
    }
    cons.printErr('Z' + i + ' - ' + zones[i].target+' max '+zones[i].getMaxDrone() +' winner '+zones[i].ID+players);
  }
}

function GetPlayersRank() {
  var scores=new Array(P);
  for(var p=0;p<P;p++) {
    scores[p]={
      "player":p,
      "score":0
    };
  }
  for(var z=0;z<Z;z++) {
    if(zones[z].ID>=0)
        scores[zones[z].ID].score++;
  }
  scores.sort( (sc1,sc2)=> sc2.score-sc1.score);
  for (p=0;p<P;p++) {
    printErr("Rank "+scores[p].player+ " zones "+ scores[p].score );
  }
  return scores;
}

/*
  fonction implémentatnt la tactique : reprioriser les zones selon la fonction de cout ci dessus
  */

function RepriorizeZone() {
  cons.printErr("======> Reprio");
  orderedzones = zones.slice();
  orderedzones.sort((z1, z2) => z1.getCostFunction() - z2.getCostFunction());

  for(var z=0;z<Z;z++) {
    printErr(" Z"+orderedzones[z].zone+" Drones :"+orderedzones[z].getAttackCount()+" Max : "+orderedzones[z].getMaxDist()+" Total : "+orderedzones[z].getTotalDist());
  }
}


var numberzone2win = Math.round(Z / 2 + 1);
var droneNum =  Math.round(D / numberzone2win);
var droneCount = 0;
cons.printErr('Zones :' + Z);
cons.printErr('Zones2win :' + numberzone2win);
cons.printErr('Drones :' + D);
cons.printErr('DronesPerZone :' + droneNum);

if(droneNum === 0)
  numberzone2win=1;

//target initiale
for (var i = 0; i < numberzone2win; i++) {
  if (droneCount<D && i!=numberzone2win-1) {
    droneCount += droneNum;
    zones[i].target = droneNum;
  } else {
    zones[i].target = Math.max(0,D - droneCount);
    break;
  }
}
for (var i = 0; i < P; i++) {
  drones[i] = new Array(D);
  for (var j = 0; j < D; j++) {
    drones[i][j] = new Drone(i, -1, -1);
  }
}

/* 
  game loop
  *************************************************************************
  */
while (true) {
  tour++;
  //lecture des zones et des drones
  for (var i = 0; i < Z; i++) {
    var TID = parseInt(cons.readline()) ;// ID of the team controlling the zone (0, 1, 2, or 3) or -1 if it is not controlled. The zones are given in the same order as in the initialization.
    zones[i].ID = TID;
    zones[i].actual = 0;
    zones[i].initPlayerDrone();
  }
  for (var i = 0; i < P; i++) {
    for (var j = 0; j < D; j++) {
      var inputs = cons.readline().split(' ');
      var DX = parseInt(inputs[0]); // The first D lines contain the coordinates of drones of a player with the ID 0, the following D lines those of the drones of player 1, and thus it continues until the last player.
      var DY = parseInt(inputs[1]);
      drones[i][j].DX = DX;
      drones[i][j].DY = DY;
      if (drones[i][j].findZone() != -1) {
        zones[drones[i][j].zone].droneperPlayer[i]++;
      }
    }
  }
  //calc targetedZone per drone & atackedperPlayer !
  for(var p=0;p<P;p++){
    for (var d=0;d<D;d++) {
      drones[p][d].calcTargetZone();
      if (drones[p][d].targetZone!= -1 && drones[p][d].dist2Zone < OPT_SEUILTARGET ) {
        zones[drones[p][d].targetZone].arrayDronePerPlayer[p][zones[drones[p][d].targetZone].attackperPlayer[p]] = drones[p][d];
        zones[drones[p][d].targetZone].attackperPlayer[p]++;        
      }
    }
  }

  if(tour <10 || tour%30==1 )
    ranks=GetPlayersRank();

  //debug
  for(var p=0;p<P;p++){
    cons.printErr("P"+p);
    for (var d=0;d<D;d++) {
      cons.printErr( "D"+d+" -> pos:"+drones[p][d].zone+" target:"+drones[p][d].targetZone+" ("+drones[p][d].dist2Zone+")");
    }
  }

  var moving=false;
  var numberOfSwitchToDo=0;
  var numberOfSwitchDone=0;

  printTarget();

  
  var winningZone = 0;
  for (var z = 0; z < Z; z++) {
    if (zones[z].ID == ID) {
      winningZone++;
    }
  }
  var droneInZone=0;
  for(var d=0;d<D;d++) {
    if(drones[ID][d].zone != -1)
      droneInZone++;
  }
  cons.printErr('WinningZone : '+winningZone+" droneinZone : "+droneInZone);
  // on est plus aggressif en allant conquérir toutes les zones où peut aller si j'ai 1 drones en place
  if ( OPT_REPRIZE_ALWAYS || droneInZone>=2 )
  {
    RepriorizeZone();
  }
  var cnt=0;
  for(var z=0;z<Z;z++){
    var newtarget = orderedzones[z].getAttackCount();
    cons.printErr("zone "+orderedzones[z].zone+" max:"+orderedzones[z].getMaxDrone()+" attack:"+orderedzones[z].getAttackCount() );
    if(cnt+newtarget>D) {
      newtarget=D-cnt;
    }
  orderedzones[z].target=newtarget;
  cnt+=newtarget;     
  cons.printErr('  ->  zone '+orderedzones[z].zone+" -> "+orderedzones[z].target);  
}

 //mémorisation des lastDX et DY afin de détecter les trajectoire des autres drones 
 for(var p=0;p<P;p++){
   for (var d=0;d<D;d++) {
     drones[p][d].memLastpos();
   }
 }
 
 //affectation des targets aux drones 
 for(var d=0;d<D;d++) {
   var affected=false;
  // suis-je en route vers une zone qui a de la dispo ?
  if(OPT_CONTINUE_MOVE) {
    if(drones[ID][d].zone==-1) {
      if(drones[ID][d].targetZone!= -1) {
        if(zones[drones[ID][d].targetZone].target>zones[drones[ID][d].targetZone].actual) {
          zones[drones[ID][d].targetZone].actual++;
          affected=true;
        }
      }
    }
  } 
  //de quelle zone ayant de la dispo suis-je le plus proche, 
  if(!affected) {
   var zonedist=new Array(Z);
   for(z=0;z<Z;z++)
   {
     zonedist[z]=new Zonedist(z,MAXDIST);
     if(zones[z].target>zones[z].actual ){
      zonedist[z].dist=dist(zones[z].X,zones[z].Y,drones[ID][d].DX,drones[ID][d].DY);   
     }
     //cons.printErr("-> D"+d+"2Z"+z+" = "+zonedist[z].dist);
   }
   zonedist.sort((z1,z2)=>z1.dist-z2.dist);
   drones[ID][d].targetZone=zonedist[0].zone;
   zones[zonedist[0].zone].actual++;
  }
   //cons.printErr("Drone "+d+" -> "+drones[ID][d].targetZone);
 }

  // positionnement sur les centres des target souhaitées...
  cons.printErr("I am : "+ID);
  for(var i=0;i<D;i++) {
    var z=drones[ID][i].targetZone;
    cons.print(zones[z].X, zones[z].Y);
  }
}


