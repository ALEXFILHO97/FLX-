import { prisma } from "@/app/api/prisma";
import { compare } from "bcrypt";

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const admin = await prisma.user.findUnique({ where: { email } });

  if (!admin || admin.password_hash == null) {
    throw new Error("Invalid email");
  }
  const isValid = await compare(password, admin.password_hash);

  if (!isValid) {
    throw new Error("Invalid password");
  }

  return admin;
}
