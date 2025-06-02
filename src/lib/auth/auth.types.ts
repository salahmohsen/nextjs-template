export type LoginResponse = {
  data: Session;
  message: string;
  statusCode: number;
  success: boolean;
};

export type Session = {
  expires_in_minutes: number;
  token: string;
  user: User;
};

export type User = {
  assigned_branches: Branch[];
  assigned_branches_type: string;
  assigned_brands: Brand[];
  assigned_brands_type: string;
  blocked: boolean;
  created_at: string;
  email: string;
  id: number;
  image: string;
  job_title: string;
  name: string;
  permissions: string[];
  phone: string;
  role: Role;
  status: boolean;
  updated_at: string;
  vendor: Vendor;
};

type Branch = {
  id: number;
  name: string;
};

type Brand = {
  id: number;
  name: string;
};

type Role = {
  description: string;
  id: number;
  name: string;
  permission_type: string;
  permissions: string[];
};

type Vendor = {
  id: number;
  name: string;
};
