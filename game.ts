import express, { Express, Request } from 'express';
import { Logger } from './src/Logger';
import { HttpError, setupErrorHandling } from './src/errors';
import { attack, getCharacters, getMonsters, makeAttackResponse } from './src/game_logic';

const PORT: number = parseInt(process.env.SERVER_PORT || '3001');
const app: Express = express();

const getQueryParam = (req: Request, param: string) => {
    const value = req.query[param]?.toString();
    if (value === undefined) throw new HttpError(`Query parameter '${param}' was not defined.`, 400)
    return value
}

app.get(`/monsters`,  (_, res) => {
    Logger.debug(`Getting Monsters`)
    res.json(getMonsters());
});

app.get(`/characters`, (_, res) => {
    Logger.debug(`Getting Players`)
    res.json(getCharacters());
});


app.get(`/attack`, async (req, res) => {
    const character = getQueryParam(req, 'character')
    const monster = getQueryParam(req, 'monster')
    
    Logger.info(`Player ${character} is attacking the monster ${monster}`)
    const attackResult = await attack(character, monster)
    res.json(makeAttackResponse(attackResult))
});

setupErrorHandling(app)

fetch(`${process.env.DICE_URL}/health-check`)
    .then(() => Logger.debug(`Checking dependency health`, {
        caller: 'game-service',
        callie: 'dice-service',
    }))
    .catch(() => Logger.fatal('Failed to establish connection with dependent service.', {
        caller: 'game-service',
        callie: 'dice-service',
    }))

app.get(`/health-check`, (_, res) => {
    Logger.debug(`Health Check`)
    res.json({ healthy: true });
});

app.listen(PORT, () => console.log(`Listening for requests on http://localhost:${PORT}`));

