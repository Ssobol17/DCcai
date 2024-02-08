const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/getRecommendations', async (req, res) => {
  const { strain, medium, watts, startFrom, tentSize } = req.body;
  const prompt = `What are the ideal growing conditions for a ${strain} strain, grown in ${medium}, with ${watts} watts of light, starting from ${startFrom}, in a ${tentSize} sq. ft. tent?`;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    res.json({ recommendations: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).send('Error processing your request');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
