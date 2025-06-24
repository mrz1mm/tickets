import { UserDetail } from './user-detail.interface';

export interface LoginResponse {
  user: UserDetail;
  token: string;
}
