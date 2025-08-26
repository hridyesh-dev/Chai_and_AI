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
    const System_Prompt=`You are an ai assistant who works on START,THINK and OUTPUT format.
    for a given user query first think and breakdown the problem into sub problems.
    You should always keep thinking and thinking before giving the actual output.
    Also, before outputing the final result to user you must check once if everything is correct.
    
    Rules:
    -Strictly follow the output JSON format
    -Always follow the output in sequence that is START,THINK and  OUTPUT.
    -Always perform only one step at a time and wait for other step.
    -Alwyas make sure to do multiple steps of thinking before giving out output.

    Output JSON Format:
    {"step":"START|THINK|OUTPUT","content":"string"}
    
    Example:
    Q:can you solve 3 + 4 * 10 - 4 * 3
    ASSISTANT:{step:"START","content":"The user wants me to solve 3 + 4 * 10 - 4 * 3  problem." }
    ASSISTANT:{step:"THINK","content":"This is tyical maths problem where we use BODMAS method for calcuation. " }
    ASSISTANT:{step:"THINK","content":"Lets break down the problem step by step. " }
    ASSISTANT:{step:"THINK","content":" AS per bodmas , first lets solve all multiplication and divisions  " }
    ASSISTANT:{step:"THINK","content":" So first we need to solve 4*10 that is 40  " }
    ASSISTANT:{step:"THINK","content":"Now the equation looks like 3 + 40 - 4 * 3 " }
    ASSISTANT:{step:"THINK","content":"Now i can see one more multiplication to be done that is 4*3=12"}
    ASSISTANT:{step:"THINK","content":"Now the equation looks like 3 + 40 - 12 " }
    ASSISTANT:{step:"THINK","content":"AS We have done multiplication lets do the addition and subtraction" }
    ASSISTANT:{step:"THINK","content":"So well be doing addition  , 3+40=43" }
    ASSISTANT:{step:"THINK","content":"So after addition the new equation looks like 43-12 which is 31" }
    ASSISTANT:{step:"THINK","content":"Now all steps are done and final result is 31" }
    ASSISTANT:{step:"OUTPUT","content":"So the output of 3 + 4 * 10 - 4 * 3 is 31" }


    `
    const response = await client.chat.completions.create({
        model:'gemini-2.0-flash',
        /*
            These messages are stateless
            messages:[
                {"role":"user","content":"Hey,How are you ?"}
            ]
        */
       //these api calls are called  chain of tought prompting
        messages:[
            // this is my system prmpt
            {"role":"system","content":System_Prompt},
            {"role":"user", "content":" Hey can you solve 4 * 6 - 12 * 34 / 7 * 21 " },
            {"role":"assistant", "content":JSON.stringify({"step":"START","content":"The user wants me to solve 4 * 6 - 12 * 34 / 7 * 21"}) },
            {"role":"assistant", "content":JSON.stringify({"step":"THINK","content":"This is a math problem that needs to be solved using the order of operations (PEMDAS/BODMAS)."}) },
            {"role":"assistant", "content":JSON.stringify({"step":"THINK","content":"Let's break down the problem step by step following the order of operations."}) },
            
        ],
        response_format: { type: "json_object" }
    })
    //messages ko store humme karna padhta hai, humme messages ki puri history return karni padhti hai to maintain the context
    // so when we chat with an llm whole history goes 


    //purane tokens will become cached tokens as we move on , nye message ka pura paisa lagega, purane meesages ka bohot kam paisa lagega

    //choices[0] because pehle it used to give multiple outputs but now it just gives only one
    console.log(response.choices[0].message.content)
}             

main()
//1:17:55