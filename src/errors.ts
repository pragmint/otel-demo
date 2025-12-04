import { Logger } from "./Logger"
import { Express } from 'express';

export const setupErrorHandling = (app: Express) => {
    app.use((e, req, res, next) => {
        if (e instanceof HttpError) {
            Logger.error(e.message, { status: e.statusCode, ...e.attrs })
            res.status(e.statusCode).send(`HttpError: ${e.message}`)
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
    })
}    


export class HttpError extends Error {
    name = "HttpError";
    attrs: Record<string, any>
    constructor(message: string, public statusCode: number, attrs?: Record<string, any>) {
        super(message);
        this.attrs = attrs || {}
    }
}
