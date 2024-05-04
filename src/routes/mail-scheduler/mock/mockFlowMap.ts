const mockFlowMap = {
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

export default mockFlowMap;
