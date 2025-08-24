// open ai has text-embedding-3-small we will give it a text and it will return us its vector embeddings

  //yeh waali line env files ko read karke load krr degi 
import 'dotenv/config'

import {OpenAI} from "openai"

// we can also pass our api key here as a string but since i have given the variable in env i dont need to do that 
/*
const client=new OpenAI({
    apiKey:''
});
*/

const client=new OpenAI();
console.log("API Key loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");



//this will return vector embeddings as a promise 
async function init() {

    //embeddings create karni hai 
    //to create vector embeddings
    const result= await client.embeddings.create({
        //konsa model use karna hai 
        model:'text-embedding-3-small',
        //kis cheez ki embedding banani hai 
        //kis cheez ki vector embedding banani hai 
        input:'I Love to visit India',
        encoding_format:"float"
    });
    console.log(result.data);
}

init();

// we will get the vector embeddings , yeh point hoga graph ka jaha isse pace karna