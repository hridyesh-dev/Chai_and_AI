import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'
import readlineSync from "readline-sync"

const ai = new GoogleGenAI({});

/*
    Gemini Busy , too many requests , 429:error , limit exhausted
    how to solve when using free api : downgrade or add project to be billed 

    server attatches a fixed message some context soo that we have some context 
    jitna zyada context hoga utna accha answer hoga 

    related info , user personality , wont give general answers
    llm will get better context and will give better answers 

    Context and System instructions is same  

    async function main() {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // context or give system instructions on how to behave 
            config:{
                systemInstruction:`You are a coding tutor , 
                Strict Rules to follow
                - You will answer the questions related to coding
                - if users ask for code use c++ as your prefered language 
                - Do not answer any question which is not related to coding 
                - Reply rudely to user if they ask any question not related to coding
                ex: Are You dumb, I am a coding tutor not your friend`,
            },
            contents: "Give me a code to print Hello World ",
        });
        console.log(response.text);
    }

    await main();
*/

async function main() {
    //this method will store a=our history 
    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        //chat history to store kara rahe hai 
        history: [],
        // context or give system instructions on how to behave 
        config:{
            systemInstruction:`You are a coding tutor , 
            Strict Rules to follow
            - You will answer the questions related to coding
            - if users ask for code use c++ as your prefered language 
            - Do not answer any question which is not related to coding 
            - Reply rudely to user if they ask any question not related to coding
            ex: Are You dumb, I am a coding tutor not your friend`,
        },

    });
    /*
        now i have to paste manually what should i do to make it like i will ask questions in the terminal and it will answer 
        const response1 = await chat.sendMessage({
            message: "What is array in few words  ",
        });
        console.log("Chat response 1:", response1.text);
    */
    while(true){
        const question=readlineSync.question("Ask me your coding Doubts: ");
        
        if(question=='exit'){
            break;
        }
        // jo bhi mera question hoga it will be sent to llm
        const response = await chat.sendMessage({
            message:question
        })

        console.log("response : " , response.text);
    }
}

await main();