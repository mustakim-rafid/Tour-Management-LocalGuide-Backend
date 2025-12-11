import { prisma } from "../../helper/prisma";
import { TUserJwtPayload } from "../../types";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status"

const createReview = async (payload: any, user: TUserJwtPayload) => {
    const tourist = await prisma.tourist.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
    const booking = await prisma.booking.findUniqueOrThrow({
        where: {
            id: payload.bookingId
        },
        include: {
            tour: true
        }
    })
    if (tourist.id !== booking.touristId) {
        throw new AppError(httpStatus.CONFLICT, "This is not your booking")
    }
    return await prisma.$transaction(async (tnx) => {
        const review = await tnx.review.create({
            data: {
                bookingId: booking.id,
                touristId: tourist.id,
                guideId: booking.tour.guideId,
                rating: payload.rating,
                comment: payload.comment
            }
        })
        const averageRating = await prisma.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                guideId: review.guideId
            }
        })
        await tnx.guide.update({
            where: {
                id: review.guideId
            },
            data: {
                avrgRating: averageRating._avg.rating ?? 0
            }
        })
        return review
    })
}

export const reviewService = {
    createReview
}