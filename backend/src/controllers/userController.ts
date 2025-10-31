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
      const token = this._getValidatedToken(req);
      const userProfile = await this.userService.getUserProfile(token);
      res.json(userProfile);
    } catch (error) {
      next(error);
    }
  }

  private _getValidatedToken(req: Request): string {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw createError(Unauthorized, 'Bearer token is required');
    }

    return token;
  }
}
