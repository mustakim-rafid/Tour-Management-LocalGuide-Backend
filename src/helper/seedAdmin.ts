import config from "../config"
import { UserRole } from "../generated/prisma/enums"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const seedAdmin = async () => {
    try {
        const isAdminExists = await prisma.user.findUnique({
            where: {
                email: config.super_admin.email
            }
        })

        if (isAdminExists) {
            console.log("Admin already created")
            return
        }

        const hashedPassword = await bcrypt.hash(config.super_admin.password as string, Number(config.bcrypt_salt_round))

        await prisma.$transaction(async (tnx) => {
            await tnx.user.create({
                data: {
                    email: config.super_admin.email!,
                    password: hashedPassword,
                    role: UserRole.ADMIN
                }
            })

            await tnx.admin.create({
                data: {
                    email: config.super_admin.email!,
                    name: "Super admin"
                }
            })
        })

        console.log("Admin created successfully")
    } catch (error) {
        console.log("Something went wrong while creating the ADMIN user.", error)
    }
}