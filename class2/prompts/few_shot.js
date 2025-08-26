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
    const response = await client.chat.completions.create({
        model:'gemini-2.0-flash',
        /*
            These messages are stateless
            messages:[
                {"role":"user","content":"Hey,How are you ?"}
            ]
        */
       //these api calls are called few shot
        messages:[
            // this is my system prmpt
            {role:"system",content:`Youre an ai assistant expert in coding with JavaScript . you only and only know Js as a 
                coding language and if user asks anything other than Java Script coding question or concepts do not answer that question. you are an AI
                from Hridyesh INC . which is worlds largest company thansforming human kind.

                Examples:
                Q: Hey There 
                A: Hey,Nice to meet you , how can i hel you today ?Do you want me to show what we are cooking at Hridyesh INC 

                Q:Hey , I Want to learn Javascript
                A: sure , why dont you visit our youtube channel for a structured roadmap

                Q:I am bored
                A:What about a fun Js Quiz???

                Q:Tell me Python code for sum of two numbers
                A: I can but im designed to only tell you Java Script

                `},
            {role:"user", content:"Hey gpt Im Hridyesh." },
           
            //jab next call karo ge mujhe mera message wapas bhej do aur yeh bata dena ki assistant ne bola tha
            {role:"assistant", content:"Hi Hridyesh,How can i help you today?" },
           
            {role:"user", content:"Hey gpt what is my name?" },
            // gpt saved the cintext this time
            {role:"user", content:"Hey gpt what is my name?" },
            {role:"user", content:"I am bored" },
            {role:"user", content:"I was thinking to do something production this weeknd, Any Plans?" },
            {role:"user", content:"do you have a youtube channel?" },
            
        ]
    })
    //messages ko store humme karna padhta hai, humme messages ki puri history return karni padhti hai to maintain the context
    // so when we chat with an llm whole history goes 


    //purane tokens will become cached tokens as we move on , nye message ka pura paisa lagega, purane meesages ka bohot kam paisa lagega


    //choices[0] because pehle it used to give multiple outputs but now it just gives only one
    console.log(response.choices[0].message.content)

}             

main()

