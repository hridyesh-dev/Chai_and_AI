
import { GoogleGenAI, Type } from '@google/genai';
import readlineSync from "readline-sync"
import 'dotenv/config'
// Configure the client
const ai = new GoogleGenAI({});

//created tools for the server 
//crypto currency tool : currency data fetch karege 
async function cryptoCurrency({coin}) {
    //coin ko fetch karne ke liye call karo 
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`);
    const data = await response.json();
    console.log(data);
    return data;
}

// weather tool
//city lega aur weather ka data dega 
async function weatherInformation({city}) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=590c498a569c4497b34194643251912&q=${city}&aqi=no`);
    const data = await response.json();
    console.log(data);
    return data;
}

/*
    abb tools bana diye ab llm ko bhejna hai ki 
    question bhejne hai and tool ki info jo , 
    function bheja hai voh karta kya hai kitne 
    argumnets leta hai and return kaisa karega we 
    cant just send codes cuz there will be 1000s of functions 
    llm will tell us the most suitable code to run 
*/

//crypto function ki info do in form of an object
/*
    cryptoCurrency({
        coin:"bitcoin",
    })
*/

//defining tool

const cryptoInfo = {
    name:"cryptoCurrency",
    description:"We can give you the current price or other information of any cryptocurrency like bitcoin , dogecoin etc. ",
    //uss function ke kya parameters honge 
    parameters:{
        type:Type.OBJECT,
        properties:{
            coin:{
                type:Type.STRING,
                description:"It will be the name of the crypto currency like bitcoin etherium etc"
            },
            //kon kon se required hai saari info bhejni hai 
            required:['coin']
            //key value pair mai de dega 
        }
    }
}

const weatherInfo = {
    name: "weatherInformation",
    description: "You can get the current weather information of any city like london, goa etc",
    //uss function ke kya parameters honge , parameter object type ka honge
    parameters:{
        type:Type.OBJECT,
        properties:{
            city:{
                type:Type.STRING,
                description:"Name of the city for which I have to fetch weather information like london, goa etc"
            }
        },
        //yeh parameter dena hi dena hai 
        required:['city']//city waali property toh chahiye hii chahiye 
    }
}

const tools = [{
    functionDeclarations:[cryptoInfo,weatherInfo]
}];

const toolFunctions = {
    //agar yeh key aaye toh yeh function ko call krr do sotred in key value pairs
    "cryptoCurrency": cryptoCurrency,
    "weatherInformation":weatherInformation
}

const History=[]

async function runAgent() {
    
    while(true){
        const result= await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:History,
            config:{tools}
        });

        //jab bhi aap llm se baat karo ge send it ques+tools 
        //How would i know that im getting result about which function to call : will give response in form of an array
        // result.function calls ke array return karta hai agar tools hai then do function calls,
        // agar kuch nahi hai then final response : text waala answer 
        //or it is the final answer
        if(result.functionCalls && result.functionCalls.length>0){
            const functionCall = result.functionCalls[0];
            const {name,args} = functionCall; 
            /*
                if(name=="cryptoCurrency"){
                    const response=await cryptoCurrency(args)
                }else if(name=="weatherInformation"){
                    const response=await weatherInformation(args)
                }
            */

            const response = toolFunctions[name](args)

            //function response part hai kya : jo mujhe response mila tha 
            const functionResponsePart = {
                name: functionCall.name,
                response: {
                    result: response,
                },
            };

            //response aa gaya then i have to give information back to model 
            //history ka kaam hai user model ki chat ko save kao in the form of array 
            History.push({
                //jo maine model ko sawal bheja 
                role: "model",
                //model ne bola hai ki function call karna hai 
                parts: [{functionCall: functionCall}],
            });

            History.push({
                //jo mujhe response mila 
                role:'user',
                // jo function call ka response aaya hai 
                parts:[{functionResponse: functionResponsePart}]
            })

        }else{
            History.push({
                role:'model',
                parts:[{text:result.text}]
            });
            console.log(result.text);
            break;
        }
    }
}



while(true){
    const question = readlineSync.question('Ask me anything: ');
    if(question=='exit'){
        break;
    }
    // hostory mai question push krr do 
    History.push({
        role:'user',
        parts:[{text:question}]
    });
    await runAgent();
}
