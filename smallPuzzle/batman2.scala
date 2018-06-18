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
        this.W=w;
        this.H=h
        this.p01=new Point(0,H)
        this.p11=new Point(W,H)
        this.p10=new Point(W,0)
    }

    def dist(x1:Int,y1 :Int,x2 : Int,y2:Int) : Double = {
        Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))
    }
    def dist(p1:Point,p2:Point) : Double = {
        dist(p1.x,p1.y,p2.x,p2.y)
    }
    // suis-je dans le polygone
    def inPoly (x:Int,y:Int,pt0:Point,pt1:Point,pt2:Point,pt3:Point ) : Boolean = {
        if(x< pt0.x || x>pt3.x )
            return false
        if(y<pt1.y || y > pt1.y )
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
    // TODO debug!!!  => on dirait que ça ne marche pas
    def split( pt0:Point,pt1:Point,pt2:Point,pt3:Point,x:Int,y:Int) : (Int,Int)= {
        splitpos=new Point(x,y)
        Console.err.println("Points : "+pt0+pt1+pt2+pt3)
        var split="none"
        lastsplit match {
            case "none" =>
                if (dist(pt0,pt1)>dist(pt0,pt3))
                split="X"
            case "X" =>
                split="Y"
            case "Y" =>
                split="X"
        }
        if(split=="X") {
            //on coupe en deux dans le sens de la longueur
            lastsplit="X"
            return limit((pt3.x-x+pt0.x),y)
        } else {
            lastsplit= "Y"
            return limit(x, (pt1.y-y+pt0.y))
        }
    }
    
    def updatePolygone(x:Int,y:Int,order:String) {
        var M1 = new Point(0,0)
        var M2 = new Point(0,0)
        lastsplit match {
            case "X" => 
                M1 = new Point(p00.x+(p11.x-p00.x)/2,p00.y)
                M2 = new Point(p00.x+(p11.x-p00.x)/2,p10.y)
            case "Y" =>
                M1 = new Point(p00.x,p00.y+(p11.y-p00.y)/2)
                M2 = new Point(p11.x,p00.y+(p11.y-p00.y)/2)
        }
        if(inPoly(x,y,M1,M2,p11,p10) && order == "COLDER") {
            p00=M1
            p01=M2
        }
        else  {
            p11=M2
            p10=M1
        }
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
        Console.err.println("Turns..."+n)
        
        val (destx, desty) = PlayGround.compute(bombdir,xb,yb)

        println(destx.toString()+" "+desty.toString())
        xb=destx
        yb=desty
    }
}