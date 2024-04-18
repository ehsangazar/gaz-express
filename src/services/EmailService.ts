class EmailService {
  sendEmail = async (): Promise<boolean> => {
    const randomNumber = Math.random();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return randomNumber < 0.95;
  };
}

export default EmailService;
