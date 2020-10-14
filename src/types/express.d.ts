export interface CurrentUser {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUser;
    }
  }
}
