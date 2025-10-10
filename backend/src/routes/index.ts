import { Application } from 'express';
import { IndexController } from '../controllers';
import { StravaController } from '../controllers/stravaController';

const indexController = new IndexController();
const stravaController = new StravaController();

export function setRoutes(app: Application) {
    // Health check
    app.get('/', indexController.getIndex.bind(indexController));
    
    // Strava API endpoints
    app.get('/api/strava/activities', stravaController.getActivities.bind(stravaController));
    app.get('/api/suggest', stravaController.getSuggestion.bind(stravaController));
}
