import { Logger } from "./Logger"
import { Express } from 'express';

export const setupErrorHandling = (app: Express) => {
    app.use((_, res, next) => {
        try {
            next()
        } catch (e) {
            if (e instanceof HttpError) {
                res.status(e.statusCode).send(`HttpError: ${e.message}`)
                Logger.error(e.message, { status: e.statusCode })
                return
            } else if (e instanceof Error) {
                Logger.error(e.message)
                res.status(500).send(`Error: ${e.message}`)
            } else if (typeof e === 'string') {
                Logger.error(e)
                res.status(500).send(`Error: ${e}`)
            } else {
                Logger.error(`Unknown Error Type: ${JSON.stringify(e)}`)
                res.status(500).send(`Unknown Error Type: ${JSON.stringify(e)}`)
            }
        }
    })
}

class HttpError extends Error {
    name = "HttpError";
    constructor(message: string, public statusCode: number) {
        super(message);
    }
}
