import math._
import scala.util._
import scala.collection.immutable.ListMap

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

class Node(number:Int) {
    var num:Int = number
    var linkedNodes= List[Node]();
    var isExit=false
    var isSkynet=false

    def addLink(linkedNode:Node) {
        linkedNodes = linkedNodes ++ List[Node](linkedNode)
        linkedNode.linkedNodes = linkedNode.linkedNodes ++ List[Node](this)
    }

    def removeNode(node:Node) {
        linkedNodes = linkedNodes.filterNot(n => n.num==node.num)
        node.linkedNodes=node.linkedNodes.filterNot(n =>n.num==this.num)
    }

    override def toString():String = {
        var res=num.toString()
        for(node <- linkedNodes) {
            res+=" ->"+node.num.toString()
        }
        if(isExit) res += " =>exit"
        if(isSkynet) res += " =>SKY***"
        res
    }
}

object PlayGround {
    var nodes:Array[Node] = new Array(0)
    var lstReachedNode = List[Node]()
    var currentSkyNet:Int = -1

    def getCandidateToRemove():(Int,Int) = {
        
        // je trouve skynet pret d'une exit, je le kill
        for(node <-nodes.filter(_.isSkynet)){            
            val exitList = node.linkedNodes.filter(subnode=>subnode.isExit)
            if(exitList.length>0)
                return (node.num, exitList(0).num)
        }
        //sinon je fait une liste des qui pointent sur un exit
        val exitnodes=nodes.filter(nd=>nd.isExit)
        // par exit, je cherche les noeud qui sont pointé par plusieurs exits.
        var listNodeLinkedToExit=List[Node]()
        for(exit <- exitnodes){
            listNodeLinkedToExit ++=exit.linkedNodes
        }

        // dans cette liste, je cherche les numéro qui apparaissent le plus et je trie pour éliminer les plus proche de skynet
        var groupMap=listNodeLinkedToExit.groupBy(node=>node.num)
        var sorterSeq=groupMap.filter(_._2.length>1).toSeq
        if(sorterSeq.length>0)
            sorterSeq=sorterSeq.sortWith( (n1,n2)=> dist2node(n1._1,currentSkyNet)<dist2node(n2._1,currentSkyNet) )
        else
            sorterSeq=groupMap.toSeq
        for(vec <- sorterSeq ){
            Console.err.println("node "+vec._1+" distance "+dist2node(vec._1,currentSkyNet))
        }
        val srcNodenum=sorterSeq(0)._1
        return (srcNodenum,nodes(srcNodenum).linkedNodes.filter(subnode=>subnode.isExit)(0).num)
    }

    def setExit(ei:Int) {
        nodes(ei).isExit=true
    }

    def setSkyNet(sky:Int) {
        if(currentSkyNet != -1) {
            nodes(currentSkyNet).isSkynet=false
        }
        nodes(sky).isSkynet=true
        currentSkyNet=sky
    }

    def removeLink(src:Int,dest:Int) {
        nodes(src).removeNode(nodes(dest))
    }

    def debug() {
        for (node <- nodes) {
            Console.err.println("Node "+node.toString())
        }
    }

    //calcule le nombre de pas entre 2 nodes -> attention les liens sont dans les deux Nodes...
    //donc ça boucle !!
    //on ne doit pas passer par des exits.
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
}

object Player extends App {
    // n: the total number of nodes in the level, including the gateways
    // l: the number of links
    // e: the number of exit gateways
    val Array(nodeCount, l, e) = for(i <- readLine split " ") yield i.toInt

    PlayGround.nodes= new Array(nodeCount)

    for(n <- 0 until nodeCount){
        PlayGround.nodes(n)=new Node(n)
    }

    for(i <- 0 until l) {
        // n1: N1 and N2 defines a link between these nodes
        val Array(n1, n2) = for(i <- readLine split " ") yield i.toInt
        PlayGround.nodes(n1).addLink(PlayGround.nodes(n2))
    }
    for(i <- 0 until e) {
        val ei = readInt // the index of a gateway node
        PlayGround.setExit(ei)
    }

    // game loop
    while(true) {
        val si = readInt // The index of the node on which the Skynet agent is positioned this turn
        PlayGround.setSkyNet(si)
        
        //Console.err.println("DIST2NODE"+PlayGround.dist2node(si,PlayGround.nodes.filter(_.isExit)(0).num).toString())
        PlayGround.debug()        
        // Example: 0 1 are the indices of the nodes you wish to sever the link between
        var (src,dest) = PlayGround.getCandidateToRemove()
        println(src.toString()+" "+dest.toString())
        PlayGround.removeLink(src,dest)
        
    }
}