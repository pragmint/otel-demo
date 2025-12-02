import express, { Express } from 'express';
import { Logger } from './src/Logger';
import { setupErrorHandling } from './src/errors';

const PORT: number = parseInt(process.env.SERVER_PORT || '3010');
const app: Express = express();

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const registerDiceEndpoint = (size: number) => {
    app.get(`/d${size}`, (_, res) => {
        const randomNumber = getRandomNumber(1, size).toString()
        Logger.debug(`Rolled d${size} - Result: ${randomNumber}`)
        res.send(randomNumber);
    });
}

setupErrorHandling(app)

registerDiceEndpoint(4)
registerDiceEndpoint(6)
registerDiceEndpoint(8)
registerDiceEndpoint(10)
registerDiceEndpoint(12)
registerDiceEndpoint(20)
registerDiceEndpoint(100)

app.get(`/health-check`, (_, res) => {
    Logger.debug(`Health Check`)
    res.json({ healthy: true });
});

app.listen(PORT, () => console.log(`Listening for requests on http://localhost:${PORT}`));

