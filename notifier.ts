import express, { Express, Request } from 'express';

const PORT: number = parseInt(process.env.SERVER_PORT || '3002');
const app: Express = express();

let notifications: string[] = []

const getQueryParam = (req: Request, param: string) => {
    const value = req.query[param]?.toString();
    if (value === undefined) throw new Error(`Query parameter '${param}' was not defined.`)
    return value
}

app.get(`/`, (_, res) => {
    res.json(notifications);
});
app.get(`/clear`, (_, res) => {
    notifications = []
    res.send("cleared");
});

app.post(`/notify`, (req, res) => {
    notifications.push(`Got notified of a '${getQueryParam(req, 'type')}' issue.`)
    res.json(notifications);
});

app.listen(PORT, () => console.log(`Listening for requests on http://localhost:${PORT}`));

