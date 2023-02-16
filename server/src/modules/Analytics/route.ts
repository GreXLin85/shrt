import { Application } from 'express';
import AnalyticsController from './controller';

export class AnalyticsRoute {
    private controller = new AnalyticsController();

    public routes(app: Application): void {
        app.route('/analytics/:linkId')
            .get(this.controller.getAnalytics)
    }
}