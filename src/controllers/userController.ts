import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { extractUserIdFromRequest } from '../middleware/auth';

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
      const userId = extractUserIdFromRequest(req);
      const user = await this.userService.getPartialUserById(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
