require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const readline = require("readline");

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateAIResponse(prompt) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });

  return response.data.choices[0].text.trim();
}

async function runChat() {
  try {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("Chat with AI. Type 'exit' to finish the conversation.\n");

    let aiPrompt = "The following is a conversation with an AI assistant. The AI is an expert assistance for handicap people.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?";
    console.log(aiPrompt);

    let userMessage = await new Promise((resolve) => {
      rl.question("Human: ", (answer) => {
        resolve(answer.trim());
      });
    });

    while (userMessage.toLowerCase() !== "exit") {
      const prompt = `${aiPrompt}\nHuman: ${userMessage}\nAI: `;
      const aiResponse = await generateAIResponse(prompt);

      console.log(`AI: ${aiResponse}`);

      aiPrompt = `Human: ${userMessage}\nAI: ${aiResponse}`;

      userMessage = await new Promise((resolve) => {
        rl.question("Human: ", (answer) => {
          resolve(answer.trim());
        });
      });
    }

    console.log("Conversation ended. Exiting...");
    rl.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

runChat();