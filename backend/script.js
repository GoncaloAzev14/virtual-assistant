const express = require('express');
const bodyParser = require('body-parser');  // Added body-parser
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const azureApiKey = process.env["AZURE_OPENAI_API_KEY"];
const deploymentId = "gpt-35-turbo"; // Update if using a different deployment

// Initialize OpenAI client
const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

// Conversation history (initially empty)
let conversationHistory = [];

const app = express();

// Added body-parser middleware to handle JSON requests
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000'); // Replace with your frontend origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  next();
});

// Route to handle chat requests
app.post('/chat', async (req, res) => {
  // Log the received request body for debugging
  console.log('Received request body:', req.body);

  // Get user input from the request body
  const userInput = req.body.message;

  // Add user input to conversation history
  conversationHistory.push({ role: "user", content: userInput });

  try {
    // Call OpenAI API with conversation history
    const response = await client.getChatCompletions(deploymentId, conversationHistory);

    // Update conversation history with AI response
    conversationHistory.push({ role: "assistant", content: response.choices[0].message.content });

    // Send AI response back to user
    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error("Error during chat completion:", error);
    res.status(500).json({ message: "Error occurred, please try again later." });
  }
});

// Start the Express server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server listening on port ${port}`));
