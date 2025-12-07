import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../generated/prisma/enums";

export type TUserJwtPayload = {
    email: string;
    role: UserRole;
} & JwtPayload