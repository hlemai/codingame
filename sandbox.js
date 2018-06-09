var MAXDIST=9000;
var EPSILON=0.01;
var SEUILTARGET=40;

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

// test de isTargeted : 
console.log("isTargeted(100,100,200,200,400,400)");
console.log(isTargeted(100,100,200,200,400,400));

console.log("isTargeted(200,200,202,202,5000,5003)");
console.log(isTargeted(200,200,202,202,5000,5003));

console.log("isTargeted(200,200,300,300,100,100)");
console.log(isTargeted(200,200,300,300,100,100));


console.log("isTargeted(200,200,100,100,400,300)");
console.log(isTargeted(200,200,100,100,400,300));

console.log("isTargeted(200,200,100,100,400,400)");
console.log(isTargeted(200,200,100,100,400,400));