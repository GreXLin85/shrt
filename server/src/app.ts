import bodyParser from 'body-parser';
import express from 'express';
import { TypedRequestBody } from './types/TypedRequestBody';

const app = express();

app.use(bodyParser.json())

app.post('/shorturl', (req: TypedRequestBody<{
    url: string;
}>, res) => {
    const url = req.body.url

    // check if url valid with this regex https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)

    if(!new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g).test(url)){
        res.status(400).send('Invalid url')
    }
        

    res.send(url);
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});