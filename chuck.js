function print(mess) {
    console.info(mess);
}
function printErr(mess) {
    console.debug(mess);
}

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

//var MESSAGE = readline();
var MESSAGE="%";
var binaryMESS="";



for(var i=0; i<MESSAGE.length ; i++) {
    var bits =(MESSAGE[i].charCodeAt(0).toString(2));
    bits= "0000000".slice(0,7-bits.length)+bits;
    binaryMESS+=bits;
}
printErr(binaryMESS);

var sequence=new Array(100);
var currentValue='';
var currentIndex=-1;
for (var i=0; i < binaryMESS.length ; i++) {
    if(binaryMESS[i] != currentValue) {
        currentIndex++;
        sequence[currentIndex]='';
    }
    currentValue=binaryMESS[i];
    sequence[currentIndex]+=currentValue;
}
var result='';
for (var i=0; i <= currentIndex; i++) {
    printErr(sequence[i]);
    if( sequence[i].startsWith('0' )){
        result+="00 ";
    }
    else  {
        result +="0 ";
    }
    for(j=0;j<sequence[i].length;j++)
        result+="0";
    if(i != currentIndex)
        result += " ";   
}

print(result);
