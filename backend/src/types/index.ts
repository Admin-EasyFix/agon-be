export interface RequestWithUser extends Express.Request {
  user?: any; // Replace 'any' with the actual user type if available
}

export interface ResponseWithData<T> extends Express.Response {
  data?: T;
}

export interface ErrorResponse {
  error: string;
  message: string;
}