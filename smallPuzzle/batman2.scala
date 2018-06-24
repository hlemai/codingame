import math._
import scala.util._

object PlayGround {
    var count=0;
    var distMin = 0.0;
    var distMax= 200.0;
    var W=0
    var H=0

    // rectangle actuel
    var p00=new Point(0,0)
    var p01=new Point(1,0)
    var p11=new Point(1,1)
    var p10=new Point(0,1)
    var lastsplit="none"
    var splitpos=new Point(0,0)

    def init(n:Int,w:Int,h:Int,dm:Double) = {
        this.distMax=dm
        this.W=w
        this.H=h
        this.p01=new Point(0,H-1)
        this.p11=new Point(W-1,H-1)
        this.p10=new Point(W-1,0)
    }

    def dist(x1:Int,y1 :Int,x2 : Int,y2:Int) : Double = {
        Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))
    }
    def dist(p1:Point,p2:Point) : Double = {
        dist(p1.x,p1.y,p2.x,p2.y)
    }
    // suis-je dans le rectangle 
    def inPoly (x:Int,y:Int,pt00:Point,pt01:Point,pt11:Point,pt10:Point ) : Boolean = {
        Console.err.println("  "+x+","+y+"in poly ?"+pt00,pt01,pt11,pt10)
        if(x<= pt00.x || x>pt10.x )
            return false
        if(y<= pt00.y || y >= pt01.y )
            return false
        return true
    }
    // ne pas sortir de chiffre horszone !
    def limit(x:Int,y:Int) : (Int,Int) = {
        return ( 
            x match {
                case x if x < 0 => 0
                case x if x >= W => W-1
                case _ => x
            },
            y match {
                case v if v < 0 => 0
                case v if v  >= H => H-1
                case _ => y  
            }
        )
    }
    // on propose le prochain mouvement en splitant le polygonne carré actuel en deux, dans le sens des X ou des Y
    def split( pt00:Point,pt01:Point,pt11:Point,pt10:Point,x:Int,y:Int) : (Int,Int)= {
        splitpos=new Point(x,y)
        Console.err.println("Points : "+pt00+pt01+pt11+pt10)
        var split="none"
        lastsplit match {
            case "none" =>
                if (dist(pt00,pt10)>dist(pt00,pt01))
                    split="X"
                else 
                    split="Y"
            case "X" =>
                split="Y"
            case "Y" =>
                split="X"
        }
        Console.err.println(" split -> "+split)
        var (destx,desty)=(0,0)
        if(split=="X") {
            //on coupe en deux dans le sens de la longueur
            lastsplit="X"
            val (ret1,ret2) =limit((pt10.x-x+pt00.x),y)
            destx=ret1
            desty=ret2
        } else {
            lastsplit= "Y"
            val (ret1,ret2) = limit(x, (pt01.y-y+pt00.y))
            destx=ret1
            desty=ret2
        }
        if( (destx,desty)==(x,y) ) {
            // c'est quoi ce bins... Mon symétrique est égal à moi même ? => BUG
            destx=pt00.x+(pt10.x-pt00.x)/4
            desty=pt00.y+(pt01.y-pt00.y)/4
        }

        return (destx,desty)
    }
    // récupère les points M1 et M2 interceptant le polygonne et la médiatrice
    def getInterMediatrice(x:Int,y:Int) : (Point,Point)= {
        if(splitpos.y == y) {
            val xmed=splitpos.x+(x-splitpos.x)/2
            return (new Point(xmed,p00.y),new Point(xmed,p01.y))
        } else if(splitpos.x == x) {
            val ymed=splitpos.y+(y-splitpos.y)/2
            return (new Point(p00.x,ymed),new Point(p10.x,ymed))
        }
        else {
            // TODO c'est pas bon, mais ça ne doit pas arriver
            val xmed=splitpos.x+(x-splitpos.x)/2
            val ymed=splitpos.y+(y-splitpos.y)/2
            return (new Point(p00.x,ymed),new Point(xmed,p10.x))
        }
    } 
    // mise à jour des polygone via l'intersection avec la médiatrice
    // BUGS
    def updatePolygone(x:Int,y:Int,order:String) { 
        val (m1, m2) = getInterMediatrice(x,y) // todo et je pourrais peut-être en déduire les 2 nouveaux polygones potentiel ?
        Console.err.println(" m1,m2 : "+m1+","+m2)
        var (a1,b1,c1,d1)= (p00,m1,m2,p10)
        var (a2,b2,c2,d2) = (m1,p01,p11,m2)
        if(m1.x != p00.x) {
            a1=p00;b1=p01;c1=m2;d1=m1
            a2=m1;b2=m2;c2=p11;d2=p10 
        }
        
        if( inPoly (x,y,a1,b1,c1,d1) && order=="WARMER" ) {
            p00=a1
            p10=b1
            p11=c1
            p10=d1
        } else {
            p00=a2
            p10=b2
            p11=c2
            p10=d2
        }
        if(order== "SAME" ) {
            // le polygone est egal à M1, M2, mais dans quelle ordre ?
            if( dist(m1,p00)<dist(m2,p00) ){
                p00=m1
                p10=m2
                p11=m1
                p01=m2
            } else {
                p00=m2
                p10=m1
                p11=m2
                p01=m1
            }
        }
        Console.err.println("-> newPoly : "+p00+p01+p11+p10)
    }

    
    

    def compute( order:String,x:Int,y:Int) : (Int,Int) = {
        order match {
            case "UNKNOWN" =>
                splitpos=new Point(x,y)
                return split(p00,p01,p11,p10,x,y)
            case "WARMER" =>
                updatePolygone(x,y,order)
                return split(p00,p01,p11,p10,x,y)
            case "COLDER" =>
                updatePolygone(x,y,order)
                return split(p00,p01,p11,p10,x,y)
            case "SAME" =>
            // todo
            return split(p00,p01,p11,p10,x,y)
        }
    }
}

class Point(ptx:Int,pty:Int) {
    var x=ptx
    var y=pty
    override def toString() : String = {
        "("+x+","+y+")"
    }
}


object Player extends App {
    // w: width of the building.
    // h: height of the building.
    val Array(w, h) = for(i <- readLine split " ") yield i.toInt
    val n = readInt // maximum number of turns before game over.
    val Array(x0, y0) = for(i <- readLine split " ") yield i.toInt

    var (xb,yb) = (x0,y0)

    var counter=0;
    PlayGround.init(n,w,h,w*h)


    // game loop
    while(true) {
        val bombdir = readLine // the direction of the bombs from batman's current location (U, UR, R, DR, D, DL, L or UL)
        
        // Write an action using println
        Console.err.println("Turn..."+n)
        
        val (destx, desty) = PlayGround.compute(bombdir,xb,yb)

        println(destx.toString()+" "+desty.toString())
        xb=destx
        yb=desty
    }
}