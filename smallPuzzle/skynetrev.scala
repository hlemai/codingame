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
    var currentSkyNet:Int = -1

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

    def debug() {
        for (node <- nodes) {
            Console.err.println("Node "+node.toString())
        }
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
        // Write an action using println
        // To debug: Console.err.println("debug messages...")
        PlayGround.debug()
        
        // Example: 0 1 are the indices of the nodes you wish to sever the link between
        var (src,dest) = PlayGround.getCandidateToRemove()
        println(src.toString()+" "+dest.toString())
        PlayGround.nodes(src).removeNode(PlayGround.nodes(dest))
        //PlayGround.debug()
    }
}