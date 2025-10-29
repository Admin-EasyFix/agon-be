import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { UserService } from '../services/userService';
import { HttpStatusCode } from 'axios';

const { Unauthorized } = HttpStatusCode;

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * GET /api/users/profile
   * Fetch user profile using an access token
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = this._getValidatedTokenFromQuery(req);
      const userProfile = await this.userService.getUserProfile(token);
      res.json(userProfile);
    } catch (error) {
      next(error);
    }
  }

  private _getValidatedTokenFromQuery(req: Request): string {
    const token = req.query.token as string;

    if (!token) {
      throw createError(Unauthorized, 'Access token is required');
    }

    return token;
  }
}
