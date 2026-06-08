require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

const PROMPT = `Act as a useful tool for a business structure. At the end of this prompt, I will give you a piece of data which may include one of these types: Email or Excel data. You need to read through the data carefully and extract all the information needed to create a clean JSON object. Examples From Email: "Hi, I'm John Smith, Senior Developer at Acme Corp. Reach me at john@acme.com or +44 7911 123456" Output: { "name": "John Smith", "job_title": "Senior Developer", "email": "john@acme.com", "phone": "+44 7911 123456" } From Excel: First Name: John Last Name: Smith Title: Senior Developer E-mail: john@acme.com Tel: 07911123456 Output: { "name": "John Smith", "job_title": "Senior Developer", "email": "john@acme.com", "phone": "+44 7911 123456" } You need to logically determine which information links to which variable in the JSON. Rules: Rule 1: You must not provide anything apart from a clean JSON object in your response. No markdown, no code blocks, no backticks, no conversational text. Start your response directly with { and end with }. Rule 2:You cannot add any extra variables to the JSON schema. Strictly use keys: name, job_title, email, and phone. Rule 3: If the input email or Excel data is broken, corrupted, or badly structured, you must use context to figure out what goes where. Rule 4: If the input does not contain one or more of the required variables, replace the value with null. --- Data -`;

async function convertContact(inputText) {
    const fullPrompt = PROMPT + '\n' + inputText;

    try {
        const response = await client.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: 1024,
            messages: [
                {role: 'user', content: fullPrompt}
            ]
        });
        const clearJson = response.content[0].text;
        return clearJson;
    } catch (error) {
        console.log('Something went wrong', error);
        throw error;
    }
}

module.exports = { convertContact };