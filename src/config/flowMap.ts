export type IflowMap = {
  [key: string]: {
    type: string;
    when: {
      seconds: string;
      minutes: string;
      hours: string;
    };
    subject: string;
    body: string;
    after?: string[];
  };
};

const flowMap = {
  websiteSignup: {
    type: "scheduled",
    when: {
      hours: 2,
    },
    subject: "Welcome!",
    body: "Thanks to join our website",
  },
  socksDispatched: {
    type: "now",
    subject: "Dispatched!",
    body: "Thanks, your item has been dispatched",
  },
  socksPurchased: {
    type: "now",
    subject: "Purchased!",
    body: "Thanks for shopping with us",
    after: ["socksDispatched"],
  },
};

export default flowMap;
