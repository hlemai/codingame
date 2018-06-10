# Première partie de SKYNET -> pour apprendre le scala.

Algo très simple :
Si Skynet est prêt à entrer, on coupe la branche, sinon on coupe les branches autour de l'exit pour ne pas rien faire.

```scala
    def getCandidateToRemove():(Int,Int) = {
        // je trouve skynet pret d'une exit, je le kill
        for(node <-nodes){
            if(node.isSkynet) {
                val exitList = node.linkedNodes.filter(subnode=>subnode.isExit)
                if(exitList.length>0)
                    return (node.num, exitList(0).num)
            }
        }
        //sinon je coupe le premier exit que je trouve
        for(node<-nodes){
            val exitList = node.linkedNodes.filter(subnode=>subnode.isExit)
            if(exitList.length>0)
                return (node.num, exitList(0).num)
        }
        return (0,1)
    }
```