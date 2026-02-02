import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { Request } from 'express';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import { HttpStatusCode } from 'axios';
const { Unauthorized, NotFound } = HttpStatusCode;

export function extractUserIdFromRequest(req: Request): number {
  try {
    if (!process.env.JWT_SECRET) {
      throw createError(Unauthorized, 'JWT_SECRET is not set in env.');
    }

    if (!req.headers.authorization) {
      throw createError(Unauthorized, 'Missing Authorization header');
    }

    if (!req.headers.authorization.startsWith('Bearer ')) {
      throw createError(Unauthorized, 'Invalid Authorization header format');
    }
    
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw createError(Unauthorized, 'Missing or invalid Authorization header');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const userId = decodedToken?.id;
    if (!userId) {
      throw createError(Unauthorized, 'Invalid JWT: user ID missing');
    }

    return userId;
  } catch (error) {
    throw error;
  }
}

export async function extractStravaAccessToken(req: Request, userService: UserService = new UserService(), authService: AuthService = new AuthService()): Promise<string> {
  try {
    if (userService == null || authService == null) {
      throw new Error('UserService or AuthService is not provided');
    }
    const userId = extractUserIdFromRequest(req);
    const stravaTokens = await userService.getStravaTokensById(userId);
    if (!stravaTokens) {
      throw createError(NotFound, 'Strava tokens not found for the user');
    }

    const validTokens = await authService.validateStravaTokens(stravaTokens);

    if (validTokens && validTokens !== stravaTokens) {
      await userService.upsertUserFromStrava(validTokens);
    }

    return validTokens?.access_token ?? stravaTokens.access_token;
  } catch (error) {
    throw error;
  }
}