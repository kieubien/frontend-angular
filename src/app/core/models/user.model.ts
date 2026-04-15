export interface User {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'admin' | 'user';
  status?: 'active' | 'banned';
}
