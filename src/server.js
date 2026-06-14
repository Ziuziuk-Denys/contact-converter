const express = require('express');
const { convertContact } = require('./converter');
const multer = require('multer');
const { parseExcel } = require('./excelParser');
const fs = require('fs/promises');

const PORT = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });


const app = express();
app.use(express.json());

app.post('/convert', async (req, res) => {
    try {
        const data = req.body.input;
        const contactString = await convertContact(data);
        try {
            const contactJson = JSON.parse(contactString);
            res.status(200).send(contactJson);
        } catch (error) {
            console.error('Server error', error);
            res.status(500).json({
                error: error,
            });
        }
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({
            error: error,
        });
    }
})

app.post('/convert/excel', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    try {
        const fileData = parseExcel(filePath)

        const cleanData = await Promise.all(
            fileData.map(row => convertContact(row))
        )
        const parsed = cleanData.map(item => JSON.parse(item)).flat();
        return res.status(200).send(parsed);
    } catch (error) {
        console.error('Server error', error);
        res.status(500).json({ error: error.message });
    } finally {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Failed to delete file', error);
        }
    }

});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})