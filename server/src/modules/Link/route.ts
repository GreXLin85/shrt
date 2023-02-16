import { Application, Request, Response } from 'express';
import LinkController from './controller';
import rateLimit from 'express-rate-limit'

const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Limit each IP to 10 requests per `window` (here, per 5 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: async (request: Request, response: Response) => {
        return {
            message: 'Too many requests, please try again later. (10 req per 5 minute)'
        }
    },
})

export class LinkRoute {
    private controller = new LinkController();

    public routes(app: Application): void {
        app.route('/createLink')
            .post(apiLimiter, this.controller.createLink);

        app.route('/link/:id')
            .get(this.controller.getLink)
            .delete(this.controller.deleteLink);
    }
}