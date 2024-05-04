import logger from "../../../utils/logger";
import nodemailer from "nodemailer";

class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_ENDPOINT,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  sendEmail = async (data): Promise<boolean> => {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: data.userEmail,
      subject: data.subject,
      text: data.body,
    };

    let result = false;
    try {
      await this.transporter.sendMail(mailOptions);
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: "eadomestic@gmail.com",
        subject: `Test Email has sent to ${data.userEmail}`,
        text: `Email was requested by ${data.userEmail}, system is working [gaz-express][mail-scheduler]`,
      });
      result = true;
    } catch (error) {
      logger.error(error);
    }
    logger.info(`Email: ${data.userEmail} => ${result}`);
    return result;
  };
}

export default EmailService;
