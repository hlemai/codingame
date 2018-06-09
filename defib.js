/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var LON = parseFloat(readline().replace(',','.'));
var LAT = parseFloat(readline().replace(',','.'));
var N = parseInt(readline());

var defiebs=new Array(N);

class Defieb {
    constructor(number,adr1,adr2,inconu,lon,lat) {
        this.number=number;
        this.adr1=adr1;
        this.adr2=adr2;
        this.lon= parseFloat(lon.replace(',','.'));
        this.lat=parseFloat(lat.replace(',','.'));
    }
    toString() {
        return this.number+"-"+this.adr1+":"+this.lon+"/"+this.lat;
    }
    calcdist(lonB,latB) {
        var x=(this.lon-lonB)*Math.cos(0,5*(this.lat+latB));
        var y=(latB-this.lat);
        this.dist= Math.sqrt(x*x+y*y)*6371;
    }
}

for (var i = 0; i < N; i++) {
    var DEFIB = readline();
    var vals=DEFIB.split(';');
    defiebs[i]=new Defieb(vals[0],vals[1],vals[2],vals[3],vals[4],vals[5]);
    defiebs[i].calcdist(LON,LAT);
    printErr(defiebs[i].toString());
}
defiebs.sort((p1,p2)=>p1.dist-p2.dist);
index=0;

print(defiebs[index].adr1);
