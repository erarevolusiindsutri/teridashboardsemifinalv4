import { useDataStore } from './dataManager';

interface CommandResult {
  success: boolean;
  message: string;
  action?: () => Promise<void>;
}

export function parseCommand(message: string): CommandResult {
  const lowerCommand = message.toLowerCase();
  const dataStore = useDataStore.getState();

  // Add client/deal pattern
  const clientDealMatch = lowerCommand.match(/(?:new\s+)?client(?:\s+called\s+)?(\w+)(?:\s+at\s+)?(\d+)(?:\s+of\s+)?(\w+)(?:\s+for\s+)?(\d+)(?:\s+usd)?/i);
  
  if (clientDealMatch) {
    const [_, clientName, day, month, amount] = clientDealMatch;
    const numericAmount = Number(amount);
    const numericDay = Number(day);
    
    if (isNaN(numericAmount) || isNaN(numericDay)) {
      return {
        success: false,
        message: "❌ Please provide valid numbers for day and amount"
      };
    }

    return {
      success: true,
      message: `💼 Added new client deal:\n📅 ${numericDay} ${month}\n💰 $${numericAmount}\n🏢 ${clientName}`,
      action: async () => {
        await dataStore.addDeal({
          name: 'T.E.R.I Customer Service',
          company: clientName,
          value: numericAmount,
          status: 'won',
          date: `2024-${month.slice(0,3)}-${numericDay.toString().padStart(2, '0')}`
        });
      }
    };
  }

  // Add lead pattern
  const addLeadMatch = lowerCommand.match(/(?:new\s+)?lead(?:s)?(?:\s+from\s+)?(\w+)/i);
  if (addLeadMatch) {
    const [_, company] = addLeadMatch;
    return {
      success: true,
      message: `✨ Added new lead from ${company}`,
      action: async () => {
        await dataStore.addLead({
          name: `Contact from ${company}`,
          company,
          status: 'New'
        });
      }
    };
  }

  // Remove lead pattern
  const removeLeadMatch = lowerCommand.match(/remove\s+lead(?:s)?(?:\s+from\s+)?(\w+)/i);
  if (removeLeadMatch) {
    const [_, company] = removeLeadMatch;
    return {
      success: true,
      message: `🗑️ Removed lead from ${company}`,
      action: async () => {
        await dataStore.removeLead(company);
      }
    };
  }

  return {
    success: false,
    message: "❌ Command not recognized. Please try rephrasing your request."
  };
}