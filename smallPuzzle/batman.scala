import math._
import scala.util._

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
object Player extends App {
    // w: width of the building.
    // h: height of the building.
    val Array(w, h) = for(i <- readLine split " ") yield i.toInt
    val n = readInt // maximum number of turns before game over.
    val Array(x0, y0) = for(i <- readLine split " ") yield i.toInt

    var (xb,yb) = (x0,y0)
    var (xs,ys,xe,ye) =(0,0,w,h)
    var lastmove=""

    def computeNext(bombdir:String) : (Int,Int) = {
        var (restx, resty)=(x0,y0)
        
        bombdir match {
            case s if s.startsWith("D") =>
                ys =yb+1
                resty=yb+(ye-yb)/2
                if(resty==yb) resty += 1
            case s if s.startsWith("U") =>
                ye = yb-1
                resty=yb-(yb-ys)/2
                if(resty==yb) resty -=1
            case _ => resty=yb;
        }
        bombdir match {
            case s if s.endsWith("R") =>
                xs =xb +1
                restx=xb+(xe-xb)/2
                if(restx==xb) restx +=1
            case s if s.endsWith("L") =>
                xe=xb-1
                restx=xb-(xb-xs)/2
                if(restx==xb) restx -=1
            case _ => restx=xb;
        }

        (restx,resty)
    }

    // game loop
    while(true) {
        val bombdir = readLine // the direction of the bombs from batman's current location (U, UR, R, DR, D, DL, L or UL)
        
        // Write an action using println
        Console.err.println("Turns..."+n)
        
        val (destx,desty)=computeNext(bombdir)
        Console.err.println("rect "+xs+","+ys+"|"+xe+","+ye)
        // the location of the next window Batman should jump to.
        println(destx.toString()+" "+desty.toString())
        xb=destx
        yb=desty
        lastmove=bombdir        
    }
}