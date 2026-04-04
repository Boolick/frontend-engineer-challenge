export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface LoginResponse {
  session: Session;
}

export interface RegisterResponse {
  userId: string;
  session: Session;
}
