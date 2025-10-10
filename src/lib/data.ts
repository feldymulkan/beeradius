import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function getRadiusUserDetailsById(id: number) {
  const initialUser = await prisma.radcheck.findUnique({
    where: { id },
  });

  if (!initialUser) {
    notFound(); // Panggil notFound jika user tidak ada
  }

  const { username } = initialUser;
  const [checkAttributes, userGroup, userInfo] = await Promise.all([
    prisma.radcheck.findMany({ where: { username }, select: { attribute: true, op: true, value: true } }),
    prisma.radusergroup.findFirst({ where: { username }, select: { groupname: true } }),
    prisma.userinfo.findUnique({ where: { username }, select: { fullName: true, department: true } }),
  ]);

  return {
    id, // kita sertakan ID untuk tombol delete
    username,
    group: userGroup?.groupname || "N/A",
    fullName: userInfo?.fullName || "N/A",
    department: userInfo?.department || "N/A",
    checkAttributes: checkAttributes.map((attr) => ({
      ...attr,
      value: attr.attribute.toLowerCase().includes("password") ? "********" : attr.value,
    })),
  };
}