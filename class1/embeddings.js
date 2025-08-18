// open ai has text-embedding-3-small we will give it a text and it will return us its vector embeddings
import 'dotenv/config'
import {OpenAI} from "openai"

const client=new OpenAI();
console.log("API Key loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");



//this will return vector embeddings as a promise 
async function init() {
    //to create vector embeddings
    const result= await client.embeddings.create({
        //konsa model use karna hai 
        model:'text-embedding-3-small',
        //kis cheez ki vector embedding banani hai 
        input:'I Lve to visit India',
        encoding_format:"float"
    });
    console.log(result.data);
}

init();

