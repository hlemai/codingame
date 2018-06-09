import Array._

object Demo {
   def main(args: Array[String]) {
    var letters=Array.ofDim[String](2,2)

    letters(0)(0)="1"
    letters(0)(1)="First"
    letters(1)(0)="2"
    letters(1)(1)="second"
      
    for(i <- 0 until 2) {
        for(j <- 0 until 2) {
            println(letters(i)(j))
        }
    }

    letters(1)(1)= "test de texte".subSequence(2,3).toString()
    println(letters(1)(1))
  
   }
}