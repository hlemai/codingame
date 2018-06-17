# Première partie de SKYNET

 pour apprendre le scala

## 1iere épreuve

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

Autre technique => éliminer les liens les doubles liens plus proches de skynetnet. Les deux dernier cas de test ne passent pas... 

```scala

        // dans cette liste, je cherche les numéro qui apparaissent le plus et je trie pour éliminer les plus proche de skynet
        var groupMap=listNodeLinkedToExit.groupBy(node=>node.num)
        var sorterSeq=groupMap.filter(_._2.length>1).toSeq
        if(sorterSeq.length>0)
            sorterSeq=sorterSeq.sortWith( (n1,n2)=> dist2node(n1._1,currentSkyNet)<dist2node(n2._1,currentSkyNet) )
        else
            sorterSeq=groupMap.toSeq;
        val srcNodenum=sorterSeq(0)._1
        return (srcNodenum,nodes(srcNodenum).linkedNodes.filter(subnode=>subnode.isExit)(0).num)
    }

```

Par contre le calcul de la distance ne doit pas prendre en compte les cas où je n'ai pas les choix.

```scala
    def dist2node(src:Int,dest:Int):Int = {
        lstReachedNode=List(nodes(src))
        return dist2nodeImp(src,dest)
    }
    def dist2nodeImp(src:Int,dest:Int):Int = {
        if(nodes(src).linkedNodes.filter(subnode=>subnode.num==dest).length>0) {
            return 1;
        }
        else {
            for(node <- nodes(src).linkedNodes if !node.isExit ) {
                if(!(lstReachedNode contains node)){
                    lstReachedNode ::= node;
                    if(node.linkedNodes.filter(_.isExit).length == 0)
                        return 1+dist2nodeImp(node.num,dest)
                    else
                        return dist2nodeImp(node.num,dest)
                }
            }
        }
        return 0
    }
```