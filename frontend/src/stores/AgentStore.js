import { makeAutoObservable } from "mobx";

class AgentStore {
  agents = [
    { id: "general", name: "General Assistant" },
    { id: "billing", name: "Billing Assistant" },
    { id: "technical", name: "Technical Support" },
    { id: "orders", name: "Order Assistant" },
  ];

  activeAgent = "general";

  constructor() {
    makeAutoObservable(this);
  }

  setAgent(id) {
    this.activeAgent = id;
  }

  // AUTO-ROUTING LOGIC (dummy for now)
  autoDetectAgent(message) {
    message = message.toLowerCase();

    if (message.includes("payment") || message.includes("refund"))
      this.activeAgent = "billing";

    else if (message.includes("error") || message.includes("not working"))
      this.activeAgent = "technical";

    else if (message.includes("order") || message.includes("tracking"))
      this.activeAgent = "orders";

    else this.activeAgent = "general";
  }
}

const agentStore = new AgentStore();
export default agentStore;
