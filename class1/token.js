//JS TIK TOKEN WAS A LIBRARY BY OPEN-AI WHICH HELPED US TO ENCODE AND DECODE INPUT
import { Tiktoken } from "js-tiktoken/lite";
//yeh hamara model hai 
import o200k_base from "js-tiktoken/ranks/o200k_base";

//encoder : we made a tokeniser for this model 
const enc=new Tiktoken(o200k_base);

//user input 
const userQuery='Hey there,I am Hridyesh Sharma';
const tokens=enc.encode(userQuery);
console.log({tokens});

const input_token=[25216, 1354, 75570 , 939,  487, 66452, 6763,   71, 99835 ]
const decoded=enc.decode(input_token);
console.log("decoded string is :",decoded);


/*

//    GPT KA HYPOTHETICAL CODE : 

    function predictNextToken(Tokens){
        //some magic code 
        return 6584
    }
    while(true){
        const nextToken=predictNextToken(tokens)
        if(tokens==="END") break;
        else{
            tokens.push(nextToken)
        }
    }

*/


