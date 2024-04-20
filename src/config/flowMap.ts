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
  websiteSignup: {
    when: {
      seconds: 5,
    },
    subject: "Welcome!",
    body: "Thanks to join our website",
  },
  socksDispatched: {
    subject: "Dispatched!",
    body: "Thanks, your item has been dispatched",
  },
  socksPurchased: {
    subject: "Purchased!",
    body: "Thanks for shopping with us",
    next: ["socksDispatched"],
  },
};

export default flowMap;
