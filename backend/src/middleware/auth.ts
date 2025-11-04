import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { Request } from 'express';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import { HttpStatusCode } from 'axios';
const { Unauthorized, NotFound } = HttpStatusCode;

const jwtSecret = process.env.JWT_SECRET!;
const userService = new UserService();
const authService = new AuthService();

export async function extractUserIdFromRequest(req: Request): Promise<number> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw createError(Unauthorized, 'Missing or invalid Authorization header');
    }

    const decodedToken = jwt.verify(token, jwtSecret) as { id: number };
    const userId = decodedToken?.id;
    if (!userId) {
      throw createError(Unauthorized, 'Invalid JWT: user ID missing');
    }

    return userId;
  } catch (error) {
    throw error;
  }
}

export async function extractStravaAccessToken(req: Request): Promise<string> {
  try {
    const userId = await extractUserIdFromRequest(req);
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