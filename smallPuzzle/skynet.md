# Première partie de SKYNET

 pour apprendre le scala

## 1ier épreuve

Algo très simple Pour la V1:
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

## 2nd niveau, plus dur

On ne peux couper que nos branches (ce que je faisais déjà). De plus on cherche à éliminer d'abord les zones liens qui connectent plus de 1 exit.

V1 : on les classe dans l'ordre de ceux qui en on le plus

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
        //sinon je fait une liste des qui pointent sur un exit
        val exitnodes=nodes.filter(nd=>nd.isExit)
        // par exit, je cherche les noeud qui sont pointé par plusieurs exits.
        var listNodeLinkedToExit=List[Node]()
        for(exit <- exitnodes){
            listNodeLinkedToExit ++=exit.linkedNodes
        }
        // dans cette liste, je cherche les numéro qui apparaissent le plus
        var groupMap=listNodeLinkedToExit.groupBy(node=>node.num)
        var sortedMap=groupMap.toSeq.sortWith(_._2.length > _._2.length)
        val srcNodenum=sortedMap(0)._1
        return (srcNodenum,nodes(srcNodenum).linkedNodes.filter(subnode=>subnode.isExit)(0).num)
    }
```

Autre technique => éliminer les liens les doubles liens plus proches de skynetnet.