import { Application } from 'express';
import { IndexController } from '../controllers';

const indexController = new IndexController();

export function setRoutes(app: Application) {
    app.get('/', indexController.getIndex.bind(indexController));
}