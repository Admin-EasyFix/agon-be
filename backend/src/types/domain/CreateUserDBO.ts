export interface CreateUserDBO {
  stravaId: number;
  firstname: string;
  lastname: string;
  profilePicture: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
}