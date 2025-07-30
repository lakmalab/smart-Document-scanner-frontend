export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: any; 
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

