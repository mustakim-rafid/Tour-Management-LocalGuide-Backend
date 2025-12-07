import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middleware/globalErrorHandler';
import router from './routes';
import bodyParser from 'body-parser';
import { paymentController } from './modules/payment/payment.controller';
import config from './config';

const app: Application = express();

app.post(
  "/api/v1/webhook",
  bodyParser.raw({ type: "application/json" }),
  paymentController.paymentVerification
)

app.use(cors({
    origin: config.frontend_url,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Tour Management (Local Guide)",
        runningTime: `${Math.floor(process.uptime())} seconds`,
        time: new Date().toLocaleString()        
    })
});

app.use("/api/v1", router)

app.use(globalErrorHandler);

export default app;