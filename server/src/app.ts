import bodyParser from 'body-parser';
import express from 'express';
import { AnalyticsRoute } from './modules/Analytics/route';
import { LinkRoute } from './modules/Link/route';

const app = express();

app.use(bodyParser.json())

new LinkRoute().routes(app)
new AnalyticsRoute().routes(app)

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});