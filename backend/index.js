const express = require('express');  //module
const app = express();  //instance


app.use(express.json());
const PORT = process.env.PORT || 5000;

//test
app.get('/', (req, res) => {
    res.send('Backend test route');
});

app.post('/api/command', (req, res) => {
    const { command } = req.body;
    console.log(`Received command: ${command}`);
    res.json({ message: `Command '${command}' received!` });
});

//err
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is a Success. Running on port ${PORT}`);
    } else {
        console.error("Error, Server can't start:", error);
    }
});