import logger from "./utils/logger";

class EmailService {
  sendEmail = async (data): Promise<boolean> => {
    const randomNumber = Math.random();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = randomNumber < 0.95;
    logger.info(`Email: ${data.userEmail} => ${result}`);
    return result;
  };
}

export default EmailService;
