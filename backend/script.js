const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] ;
const azureApiKey = process.env["AZURE_OPENAI_API_KEY"] ;
const readline = require("readline");

async function main() {
  console.log("== Azure OpenAI Chat ==");

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "gpt-35-turbo";

  const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  // Initial conversation starter (optional)
  let conversationHistory = []; // Array to store conversation history

  userInterface.prompt();

  userInterface.on("line", async (userInput) => {
    conversationHistory.push({ role: "user", content: userInput });

    try {
      const result = await client.getChatCompletions(deploymentId, conversationHistory);
      conversationHistory.push({ role: "assistant", content: result.choices[0].message.content });
      console.log(result.choices[0].message.content);
    } catch (error) {
      console.error("Error during chat completion:", error);
    }

    userInterface.prompt();
  });
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
