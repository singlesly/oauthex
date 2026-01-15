export interface AccessTokenPayload {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  iat: number;
  exp: number;
  aud: string[];
  iss: string;
  sub: string;
}

export interface RefreshTokenPayload {
  iat: number;
  exp: number;
  aud: string[];
  iss: string;
  sub: string;
}
