import 'dotenv/config';
import { OpenAI } from 'openai';

const client = new OpenAI({
    apiKey: '',
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function main() {
    const System_Prompt = `You are an ai assistant who works on START, THINK and OUTPUT format.
    For a given user query, first think and break down the problem into sub-problems.
    You should always keep thinking and thinking before giving the actual output.
    Also, before outputting the final result to user, you must check once if everything is correct.

    
    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence: START, THINK, OUTPUT
    - Always perform only one step at a time and wait for the next step
    - Always make sure to do multiple steps of thinking before giving out output
    - Avoid using Markdown formatting like **bold**, backticks, or code blocks in your responses.
    - Never use any step other than START, THINK, EVALUATE, or OUTPUT. Do not use CODE or any other custom step.

    Output JSON Format:
    {"step":"START | THINK | OUTPUT","content":"string"}

    Example:
    Q: can you solve 3 + 4 * 10 - 4 * 3
    ASSISTANT: {"step":"START","content":"The user wants me to solve 3 + 4 * 10 - 4 * 3 maths problem."}
    ASSISTANT: {"step":"THINK","content":"This is a typical maths problem where we use BODMAS method for calculation."}
    ...
    ASSISTANT: {"step":"OUTPUT","content":"So the output of 3 + 4 * 10 - 4 * 3 is 31"}
    `;

    const messages = [
        { role: "system", content: System_Prompt },
        { role: "user", content: "Hey can you solve 4 * 6 - 12 * 34 / 7 * 21" },
    ];

    while (true) {
        try {
            const response = await client.chat.completions.create({
                model: 'gemini-2.0-flash',
                messages: messages,
            });

            const rawContent = response.choices?.[0]?.message?.content;

            if (!rawContent) {
                console.error("❌ No content received from the model.");
                break;
            }

            const cleanedContent = rawContent.replace(/```json\s*|\s*```/g, '').trim();

            let parsedContent;
            try {
                parsedContent = JSON.parse(cleanedContent);
            } catch (err) {
                console.error("❌ Failed to parse JSON:", cleanedContent);
                break;
            }

            messages.push({ role: "assistant", content: JSON.stringify(parsedContent) });

            switch (parsedContent.step) {
                case "START":
                    console.log(`🔥 ${parsedContent.content}`);
                    break;
                case "THINK":
                    console.log(`🧠 ${parsedContent.content}`);
                    break;
                case "OUTPUT":
                    console.log(`🤖 ${parsedContent.content}`);
                    break;
                default:
                    console.warn("⚠️ Unknown step type:", parsedContent.step);
                    break;
            }
            if(parsedContent.step!="OUTPUT"){
                // Add a new user message to prompt the next step
                messages.push({ role: "user", content: "continue" });
            }else{
                console.log("Task done !");
            }

        } catch (error) {
            console.error("❌ Error during API call:", error.message);
            break;
        }
    }
}

main()




// import 'dotenv/config';
// import { OpenAI } from 'openai';

// const client = new OpenAI({
//     apiKey: '',
//     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
// });

// async function main() {
//     const System_Prompt = `
//         You are an ai assistant who works on START, THINK and OUTPUT format.
//         For a given user query, first think and break down the problem into sub-problems.
//         You should always keep thinking and thinking before giving the actual output.
//         Also, before outputting the final result to user, you must check once if everything is correct.

//         Rules:
//         - Strictly follow the output JSON format
//         - Always follow the output in sequence: START, THINK, EVALUATE and OUTPUT 
//         - After every think , there is going to be an evaluate step which is done by someone and you need to wait about it .
//         - Always perform only one step at a time and wait for the next step
//         - Always make sure to do multiple steps of thinking before giving out output

//         Output JSON Format:
//         {"step":"START | THINK | OUTPUT | EVALUATE ","content":"string"}

//         Avoid using Markdown formatting like **bold**, backticks, or code blocks in your responses.
//         - Never use any step other than START, THINK, EVALUATE, or OUTPUT. Do not use CODE or any other custom step.

//         Example:
//             Q:can you solve 3 + 4 * 10 - 4 * 3
//             ASSISTANT:{step:"START","content":"The user wants me to solve 3 + 4 * 10 - 4 * 3 maths  problem." }
            
//             ASSISTANT:{step:"THINK","content":"This is tyical maths problem where we use BODMAS method for calcuation. " }
//             ASSISTANT:{step:"EVALUATE","content":"Alright going good " }
            
//             ASSISTANT:{step:"THINK","content":"Lets break down the problem step by step . " }
//             ASSISTANT:{step:"EVALUATE","content":"Alright going good " }
            
//             ASSISTANT:{step:"THINK","content":" AS per bodmas , first lets solve all multiplication and divisions  " }
//             ASSISTANT:{step:"EVALUATE","content":"Alright going good " }
            
//             ASSISTANT:{step:"THINK","content":" So first we need to solve 4*10 that is 40  " }
//             ASSISTANT:{step:"EVALUATE","content":"Alright going good " }
            
//             ASSISTANT:{step:"THINK","content":"Now the equation looks like 3 + 40 - 4 * 3 " }
//             ASSISTANT:{step:"EVALUATE","content":"Alright going good " }
            
//             ASSISTANT:{step:"THINK","content":"Now i can see one more multiplication to be done that is 4*3=12"}
//             ASSISTANT:{step:"EVALUATE","content":"Alright going good " }
            
//             ASSISTANT:{step:"THINK","content":"Now the equation looks like 3 + 40 - 12 " }
//             ASSISTANT:{step:"EVALUATE","content":"Alright going good " }
            
//             ASSISTANT:{step:"THINK","content":"AS We have done multiplication lets do the addition and subtraction" }
//             ASSISTANT:{step:"EVALUATE","content":"Alright going good " }
            
//             ASSISTANT:{step:"THINK","content":"So well be doing addition  , 3+40=43" }
//             ASSISTANT:{step:"EVALUATE","content":"Alright going good " }
            
//             ASSISTANT:{step:"THINK","content":"So after addition the new equation looks like 43-12 which is 31" }
//             ASSISTANT:{step:"EVALUATE","content":"Alright going good " }
            
//             ASSISTANT:{step:"THINK","content":"Now all steps are done and final result is 31" }
//             ASSISTANT:{step:"EVALUATE","content":"Alright going good " }
            
//             ASSISTANT:{step:"OUTPUT","content":"So the output of 3 + 4 * 10 - 4 * 3 is 31" }

//     `;

//     const messages = [
//         { role: "system", content: System_Prompt },
//         { role: "user", content: "Write a Js code to find prime numbers as fast as possible ." },
//     ];

//     while (true) {
//         try {
//             const response = await client.chat.completions.create({
//                 model: 'gemini-2.0-flash',
//                 messages: messages,
//             });

//             const rawContent = response.choices?.[0]?.message?.content;

//             if (!rawContent) {
//                 console.error("❌ No content received from the model.");
//                 break;
//             }

//             const cleanedContent = rawContent.replace(/```json\s*|\s*```/g, '').trim();

//             let parsedContent;
//             try {
//                 parsedContent = JSON.parse(cleanedContent);
//             } catch (err) {
//                 console.error("❌ Failed to parse JSON:", cleanedContent);
//                 break;
//             }

//             messages.push({ role: "assistant", content: JSON.stringify(parsedContent) });
//             switch (parsedContent.step) {
//                 case "START":
//                     console.log(`🔥 ${parsedContent.content}`);
//                     break;

//                 // LLM As a Judge : send the messages as history to gemini and ask for a review and append it to history 
//                 // Multi model agent : perplexity 
//                 // if user is asking a coding question then instead of gemini use claude or else for general stuff use gemini
//                 case "THINK":
//                     console.log(`🧠 ${parsedContent.content}`);

//                     // when ever there is a think step make an api call to check the output of think step 
//                     messages.push({role:"developer",content:JSON.stringify({step:"EVALUATE",content:"ALRIGHT GOING GOOD "})})
                
//                     break;

//                 case "OUTPUT":
//                     console.log(`🤖 ${parsedContent.content}`);
//                     break;
//                 default:
//                     console.warn("⚠️ Unknown step type:", parsedContent.step);
//                     break;
//             }
//             if(parsedContent.step!="OUTPUT"){
//                 // Add a new user message to prompt the next step
//                 messages.push({ role: "user", content: "continue" });
//             }else{
//                 console.log("Task done !");
//             }

//         } catch (error) {
//             console.error("❌ Error during API call:", error.message);
//             break;
//         }
//     }
//     console.log(messages);
// }

// main()