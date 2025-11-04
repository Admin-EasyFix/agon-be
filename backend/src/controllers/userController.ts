import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { extractUserIdFromRequest } from '../utils/auth';
import { UserMapper } from '../mappers/userMapper';

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
      const userId = await extractUserIdFromRequest(req);
      const user = await this.userService.getUserById(userId);
      res.json(UserMapper.toPartialUser(user));
    } catch (error) {
      next(error);
    }
  }
}
