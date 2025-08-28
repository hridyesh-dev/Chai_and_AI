import 'dotenv/config'
//open ai ki class ko import kara
import {OpenAI} from 'openai'
//OpenAI_API_key load ho jaaye gi 
/*
    const client= new OpenAI({});
*/

const client= new OpenAI({
    //gemini api key here
    apiKey:'',
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function main() {
    /*
        client bhaiya maine apke saakth completions banani 
        hai i want to chat with you

        JO API calls idhar krr rahe hai these are stateless , yeh kuch yaad nahi rakhta 
        yeh gajni  hai 
    
        AGAR TUM MUJH SE BAAT KRR RAHE HO AND YOU NEED TO SAVE CONTEXT MUJHE SAARE MESSAGES DOBARA BHEJO
    */ 
   //client bhiaya mujhe apke saath completions bana ni hai i want to chat with you 
    const response = await client.chat.completions.create({
        model:'gemini-2.0-flash',
        /*
            These messages are stateless, yeh kuch yaad nahi rakhta , yeh gajni hai 
            messages:[
                {"role":"user","content":"Hey,How are you ?"}
            ]
        */
       //these api calls are called zero shot
        messages:[
            // this is my system prmpt which will restrict my chat to a particular stuff 
            {role:"system",content:`this is my system prompt
            ok, you are a poet and you only write poems , you cant do other stuff`},
            {role:"user", content:"Hey gpt Im Hridyesh." },
           
            //jab next call karo ge mujhe mera message wapas bhej do aur yeh bata dena ki assistant ne bola tha
            {role:"assistant", content:"Hi Hridyesh,How can i help you today?" },
           
            {role:"user", content:"Hey gpt what is my name?" },
            // gpt saved the cintext this time
            {role:"assistant", content:"your name is Hridyesh , How can i help you further"},
            // follow up question bhej do
            {role:"user", content:"Hey gpt write a poem on me?"},
            {role:"user", content:"tell me a joke."},
            {role:"user", content:"write me a point on india"}
        ]
    })
    //messages ko store humme karna padhta hai, humme messages ki puri history return karni padhti hai to maintain the context
    // so when we chat with an llm whole history goes 


    //purane tokens will become cached tokens as we move on , nye message ka pura paisa lagega, purane meesages ka bohot kam paisa lagega


    //choices[0] because pehle it used to give multiple outputs but now it just gives only one
    console.log(response.choices[0].message.content)

}             

main()

/*
    vaise sab companies ka apna standard hota hia to interact with llm
    but google and everyone has openAI compatibility because of which we can 
    talk to their llms in ChatML Format 

    in our ai user can ask about anything , its a free flowing ai without
    context and boundries to deal with this we can give it a system prompt : Initial instructions 

    eg: youre an ai assistant expert in coding with Js , you only and only know Js as a coding language 
    if user ask anything other than Js coding question do not answer that question 
    
    System prompt se isko ek custom agent bana diya 
*/
// to give system prompt in chat ml format we can do it as 
