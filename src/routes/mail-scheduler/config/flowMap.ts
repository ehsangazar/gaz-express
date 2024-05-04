export type IflowMap = {
  [key: string]: {
    when?: {
      seconds?: number;
      minutes?: number;
      hours?: number;
    };
    subject: string;
    body: string;
    after?: string[];
  };
};

const flowMap = {
  testEmail: {
    when: {
      hours: 2,
    },
    subject: "Welcome To Gazar.dev",
    body: "This is a test Email sent from Gazar.dev based on your request",
  },
};

export default flowMap;
