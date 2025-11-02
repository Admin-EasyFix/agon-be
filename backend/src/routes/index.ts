import { Application } from 'express';
import { IndexController } from '../controllers';
import { AuthController } from '../controllers/authController';
import { StravaController } from '../controllers/stravaController';

const indexController = new IndexController();
const stravaController = new StravaController();
const authController = new AuthController();

export function setRoutes(app: Application) {
    // Health check
    app.get('/', indexController.getIndex.bind(indexController));
    
    // Auth endpoints
    app.get('/api/strava/auth/authorize', authController.redirectToStrava.bind(authController));
    app.get('/api/strava/auth/callback', authController.handleStravaCallback.bind(authController));
    app.post('/api/strava/auth/deauthorize', authController.deauthorizeUser.bind(authController));

    // Strava API endpoints
    app.get('/api/strava/activities', stravaController.getActivities.bind(stravaController));
    app.get('/api/suggest', stravaController.getSuggestion.bind(stravaController));
}
