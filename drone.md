# Drones -> Codingame GameOfDrone

Implémentation de game of Drone pour codingame. Code Javascript successif

## Résultats 

résulats détaillé issu de la Tactic V7

Basé sur la vitesse (maxdist) : **261**

Basée sur l'effort total : **197**

Basé sur l'effort total x nbr de drones à mettre pour gagner (moins de risques car moins de drones) : **236**

Effort total et on s'autorise à quiter les zones qu'on gagne (max et pas max+1 sur les zones que je gagne).

## Description des tactiques

* League argent
 - tactic V1 : win 50% en répartition équitable
 - tactic V2 : V1+switch en fin de partie -> on cherche une autre alternatives
 - tactic V3 :
 - prendre des position avec au mini 2 drones sur la majorité
 - tactic v4 : Gagner la ligue Argent
    essayer d'avoir 50% des zones +1
    à chaque tour, si je suis en positions sur des drones regarder si je gagne et si je suis seul
    si je ne gagne pas, aller à un endroit ou je peux gagner.
    si je gagne et que je suis seul aussi.
    si je suis loin de mon obj, je fait un 
    supermove -> je vais là où il y en a le moins avec un de plus pour gagner
* League or
 - tactic V5 : position 387->212/567. Prendre en compte la distance avec chaque zone. 
    faire un super move si je suis inférieur à l'objectif 
    on attend toujours que tous les drones ont atteint leur dest pour bouger
 - tactic V6 : 212 -> 263... Faire des supermove régulier
    Plutôt que d'aller vers les zones où il y a actuellement des drones, 
    prendre en compte les mouvements en cours pour aller avec un +1 sur la zone concernée pour devance.
 - tactic V6 : 263 -> 330...  
    -> on ne change pas l'ordre des target à chaque fois. On ne le fait que si le nombre de drone sur zone est inférieur à D/2
    on ne calcule pas les drones qui pointent sur les zones... ça ne marche pas, à débugger !
    avec prise en compte des targets ? ->320
    correction de bugs sur les target -> 425 !!!
    on  change l'ordre des target preque à chaque fois. Dès que j'ai un drone sur ZONE.. 
    ->  place 291
    on évite de faire des aller retours. si le drone cible une zone à atteindre on le laisse y aller
    -> place 402 !!!
 - tactic V7 : 
    on cible les zones qui demande le moins d'effort pour être gagnée.
    -> 297 avec le total effort !!!, 266 pour nbAttack x effort total
    -> parfois on est aborbé par une zone => on évite la zone ou il y a trop de drones...
    Actuellement, le totaldist est pas mal -> **188**
    => dans le nbtattack, si je gagne, ne pas envoyer +1 ? => **172** => mieux !!
    tester le "total x nbattack" => **236**   
    => **165**
 - tactic V8
    prise en compte du temps (distance) que je vais mettre pour gagner vs temps que les autres mettent
    en prennant en compte celui qui ne gagne pas
    voir si on prend en compte ceux qui target la zone ou simplement les plus proches...
    ceux qui target => je n'utilisait pas la bonne fonction de "cout" -> distance 
    Moins bien qu'en direct, faudra analyser quand il fait mieux et quand il fait moins bien
    9/06
    => factor 2 **232** .
    => factor 5 : **189** 
    => avec 1 : **231** aie
    => avec 10
- tactic V9 : (bien pour les match à 1)
    repartir de la V7, 
    si je perd  attaquer uniquement les drones gagné par le gagnant
    si je gagne, laisser comme ça ...

## Autres idées & Todos

idée ? 
- Si plus de 2 joueurs, Si pas premier au bout de    x tour, cibler les zones du premier !

quelle fonction de "cout" pour gagner une zone ?
- prendre en compte les distances des attaquants pour bouger ou pas.

Peut-être pendre en compte le nombre de zone gagnante avant de re-bouger.

Les drones qu'on ne sais pas positionner, les mettre au barycentre des zones

### Analyse

Analyses TODO :
 - Comportement à 2 joueurs. 
 - Cas nb drone < nb zones.

Cas particulier avec 3 autres:

    8 zones 5 drones
    Attack count : 497 268 500 **226**
    Total : 521 269 441 **259**
    Totaldistxattack 404 274 508 **304**
    Maxdits 253 410 520 **317**

    5 zones 11 drones
    Attack count 140 223 345 **238**
    Total 175 129 317 **327**
    Totaldistxattack 178 106 317 **347**
    Maxdits 242 165 194 **319**

    3 zones 8 drones
    Total 194 174 0 **191**
    Totaldistxattack 194 174 0 **191**
    Max 182 176 18 **193**

Cas particulier avec 2 opposants : 

    6 drones, 7 zones
    TotalDist  323 **422** 399
    Totaldistxattack 181 **349** 514 
    max : 341 **311** 414


