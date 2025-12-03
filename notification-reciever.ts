import express, { Express } from 'express';

const PORT: number = parseInt(process.env.SERVER_PORT || '3002');
const app: Express = express();

let notifications: any[] = []

app.post(`/notify`, (req, res) => {
    notifications.push(req.body)
    res.json(notifications);
});

app.listen(PORT, () => console.log(`Listening for requests on http://localhost:${PORT}`));

