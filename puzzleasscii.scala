import math._
import scala.util._

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
object Solution extends App {
    val LENDICT=27;
    val text="ABCDEFGHIJKLMNOPQRSTUVWXYZ?"
    val l = readInt
    val h = readInt
    val t = readLine
    var letters=Array.ofDim[String](LENDICT,h)
    
    Console.err.println("param : "+l+" "+h+":"+t)
    
    for(i <- 0 until h) {
        val row = readLine
        //Console.err.println(row)
        for(j<- 0 until LENDICT) {
            letters(j)(i) = row.subSequence(j*l,(j+1)*l).toString()
            
        }
    }
    
    for (i <-0 until h) {
        var line="";
        t.foreach( le => {
            //Console.err.println(le)
            var index=text.toString().lastIndexOf(le.toUpper)
            Console.err.println(index)

            if(index != (-1))
                line +=letters(index)(i)
            else
                line +=letters(LENDICT-1)(i)
        })
        println(line)
    }
    
    // Write an action using println
    // To debug: Console.err.println("Debug messages...")
}