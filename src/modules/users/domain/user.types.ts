export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "KITCHEN";
}
