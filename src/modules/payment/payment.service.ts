import { Request, Response } from "express";
import { prisma } from "../../helper/prisma";
import { stripe } from "../../helper/stripe";
import Stripe from "stripe";
import config from "../../config";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { BookingStatus, PaymentStatus } from "../../generated/prisma/enums";
import { TUserJwtPayload } from "../../types";

const tourPayment = async (bookingId: string, user: TUserJwtPayload) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
      tourist: {
        email: user.email
      },
      status: BookingStatus.CONFIRMED
    },
    include: {
      tour: true,
      tourist: true,
      payment: true,
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: booking.tourist.email,
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Tour title: ${booking.tour.title}`,
          },
          unit_amount: booking.tour.tourFee * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId,
      paymentId: booking.payment!.id,
    },
    mode: "payment",
    success_url: `${config.frontend_url}/dashboard/my-trips`,
    cancel_url: "https://codewithharry.com",
  });

  return {
    paymentUrl: session.url,
  };
};

const paymentVerification = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.stripe_webhook_secret as string
    );
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      console.log(session)

    const bookingId = session.metadata?.bookingId;
    const paymentId = session.metadata?.paymentId;

    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });

    await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentGatewayData: session
      },
    });
  } else if (event.type === "checkout.session.async_payment_failed") {
    console.error("Payment failed");
    throw new AppError(httpStatus.CONFLICT, "Payment failed");
  }
};

export const paymentService = {
  tourPayment,
  paymentVerification
};
