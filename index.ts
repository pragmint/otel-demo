import express, { Express } from 'express';
import { Logger } from './Logger';

const PORT: number = parseInt(process.env.SERVER_PORT || '3000');
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

registerDiceEndpoint(4)
registerDiceEndpoint(6)
registerDiceEndpoint(8)
registerDiceEndpoint(10)
registerDiceEndpoint(12)
registerDiceEndpoint(20)
registerDiceEndpoint(100)

app.listen(PORT, () => console.log(`Listening for requests on http://localhost:${PORT}`));

