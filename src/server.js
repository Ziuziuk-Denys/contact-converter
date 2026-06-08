const express = require('express');
const { convertContact } = require('./converter');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.post('/convert', async (req, res) => {
    try {
        const data = req.body.input;
        const contactString = await convertContact(data);
        const contactJson = JSON.parse(contactString);
        res.status(200).send(contactJson);
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({
            error: error,
        });
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})