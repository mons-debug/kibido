import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Matching the enum in Prisma schema
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    id: string;
  }
} 