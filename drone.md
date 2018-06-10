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
  * tactic V1 : win 50% en répartition équitable
  * tactic V2 : V1+switch en fin de partie -> on cherche une autre alternatives
  * tactic V3 :
  * prendre des position avec au mini 2 drones sur la majorité
  * tactic v4 : Gagner la ligue Argent
    essayer d'avoir 50% des zones +1
    à chaque tour, si je suis en positions sur des drones regarder si je gagne et si je suis seul
    si je ne gagne pas, aller à un endroit ou je peux gagner.
    si je gagne et que je suis seul aussi.
    si je suis loin de mon obj, je fait un
    supermove -> je vais là où il y en a le moins avec un de plus pour gagner
* League or
  * tactic V5 : position 387->212/567. Prendre en compte la distance avec chaque zone.
    faire un super move si je suis inférieur à l'objectif
    on attend toujours que tous les drones ont atteint leur dest pour bouger
  * tactic V6 : 212 -> 263... Faire des supermove régulier
    Plutôt que d'aller vers les zones où il y a actuellement des drones,
    prendre en compte les mouvements en cours pour aller avec un +1 sur la zone concernée pour devance.
  * tactic V6 : 263 -> 330...  
    -> on ne change pas l'ordre des target à chaque fois. On ne le fait que si le nombre de drone sur zone est inférieur à D/2
    on ne calcule pas les drones qui pointent sur les zones... ça ne marche pas, à débugger !
    avec prise en compte des targets ? ->320
    correction de bugs sur les target -> 425 !!!
    on  change l'ordre des target preque à chaque fois. Dès que j'ai un drone sur ZONE..
    ->  place 291
    on évite de faire des aller retours. si le drone cible une zone à atteindre on le laisse y aller
    -> place 402 !!!
  * tactic V7 :
    on cible les zones qui demande le moins d'effort pour être gagnée.
    -> 297 avec le total effort !!!, 266 pour nbAttack x effort total
    -> parfois on est aborbé par une zone => on évite la zone ou il y a trop de drones...
    Actuellement, le totaldist est pas mal -> **188**
    => dans le nbtattack, si je gagne, ne pas envoyer +1 ? => **172** => mieux !!
    tester le "total x nbattack" => **236**
    => **165**
  * tactic V8
    prise en compte du temps (distance) que je vais mettre pour gagner vs temps que les autres mettent
    en prennant en compte celui qui ne gagne pas
    voir si on prend en compte ceux qui target la zone ou simplement les plus proches...
    ceux qui target => je n'utilisait pas la bonne fonction de "cout" -> distance
    Moins bien qu'en direct, faudra analyser quand il fait mieux et quand il fait moins bien
    9/06
    => factor 2 **232** .
    => factor 5 : **189**
    => avec 1 : **254** aie
    => faut-il défavoriser les zones que je gagne ?
  * tactic V9 : (bien pour les match à 1)
    repartir de la V7,
    si je perd  attaquer uniquement les drones gagné par le gagnant
    si je gagne, laisser comme ça ...
    => loosefactor à 2 => **236**
    => loosefactor à 1 => **190**
    => loosefactor à 5 => **308**
    ça marche pas mieux
    Combinaison des 2 : si je perd beacoup, je vise le précédent, sinon, je ne joue que sur le facteur de loose/perte et je protège mes zones.
  * tactic V10 : on sélectionne la vitesse ou l'effort en fonction du nombre de drone vs nombre de zones.
    Si 2 joueurs, on se mets en "pure" -> les facteurs à 1
    Visiblement le classement est pas top (c'est le nombre de zone à un instant t, trop agressif)
    on le smooth en le calculant tous les 30 drones et que si je suis 3 ou 4 ième
    => F10 -> **206**
    => F1 -> **240**
    changement de paramètres si peu de drones, vitesse, sinon optim
    => F10 -> **209**
    => F5 -> **203**
    => F1 -> **260???**

## Autres idées & Todos

idée ?
Si plus de 2 joueurs, Si pas premier au bout de    x tour, cibler les zones du premier !

Quelle fonction de "cout" pour gagner une zone ?
> prendre en compte les distances des attaquants pour bouger ou pas.

Peut-être pendre en compte le nombre de zone gagnante avant de re-bouger.

Les drones qu'on ne sais pas positionner, les mettre au barycentre des zones

## Analyse

### Analyses TODO

* Comportement à 2 joueurs
* Cas nb drone < nb zones
  Dans ce cas, la tactique ne devrait pas cibler les autres joueurs mais les zones
  -> tester la vitesse F1:436 F5:436 F10:248 (F10:2ieme:184)

### analyse matchs perdus (2 sur 3, dernier sur 3, 3ou 4 sur 4)

Nombre  | Place   | Zones   | Drones
--------|---------|---------|-------
4       | 3       | 8       | 8
3       | 3       | 6       | 5
4       | 3       | 8       | 7
3       | 3       | 6       | 5
3       | 3       | 6       | 9
4       | 4       | 8       | 5
4       | 4       | 8       | 3
4       | 3       | 8       | 7
3       | 1       | 6       | 9
3       | 1       | 6       | 11
4       | 1       | 8       | 9

### analyse cas particuliers

avec 3 autres:

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

Tactique V9 : Autre Cas particulier pour tester le loose factor avec 4 gus

  série 1 : 8 zones & 11 drones
    Facteur appliqué sur le fait d'attaquer le n-1
      factor 1 : 378 303 457 **406**
      factor 2 : 377 441 391 **331**
      factor 5 : 417 371 398 **354**
    Facteur appliqué sur la proba de gagner
      factor 3 : 362 368 425 **389**
      factor 10 : 353 378 378 **435**
      factor 5 : 344 355 455 **390**
      factor 5, sans défavoriser mes zones : 343 381 434 **404**
      factor 5, sans défavoriser mes zones, et sans rien faire si je gagne : 231 436 444 **384**
    Facteur appliqué en combinaison
      factor 5 : 378 383 375 **408**
      factor 2 : 399 386 401 **358** !! dernier
      factor 3 : 335 456 382 **371** ! avant dernier
      factor 10 : 371 366 385 **422**
 série 2 : 8 zones 7 drones
    Facteur appliqué en combinaison
      factor 1 : 369 406 422 **465**
      factor 10 : 550 383 328 **323**
      factor 3 : 430 368 313 **453**
      factor 5 : 635 240 344 **345**
  série 3 : 8 zones 7 drones
    Facteur appliqué en combinaison
      factor 1 : 759 100 373 **307** ! avant dernier
      factor 3 : 833 122 374 **214** ! avant dernier
      factor 5 : 821 79 353 **290** ! avant dernier
      factor 5, on cible le premier: 438 337 442 **322** !!  dernier
      factor 10, on cible le premier: 444 279 359 **457**
  série 4 : 8 zones 3 drones
      factor 10, on cible le premier: 467 298 503 **228** !!! dernier
      factor 1 : 465 286 394 **353** : avant dernier
      factor 5 : 473 392 448 **180**
      introduction des modes :
  série 5 : 8 zones 3 drones
      VITESSE_PURE (F1)
        449 277 337 **436**
      VITESSE_FOCUS_PREMIER :
        F5 : 400 337 511 245
        F10: 440 204 662 187
        F2: 449 277 337 **436**
  série 6 : 7 zones 3 drones
      VITESSE_PURE (F1)
        449 277 337 **436**
      VITESSE_FOCUS_PREMIER :
        F10 : 349 283 383 **328** ! avant dernier
