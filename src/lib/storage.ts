import { Message } from '../types/chat';

const STORAGE_KEYS = {
  MESSAGES: 'ai_chat_messages',
  FINANCE_DATA: 'finance_data',
  SALES_DATA: 'sales_data',
  PRODUCT_DATA: 'product_data'
} as const;

export function saveMessages(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

export function loadMessages(): Message[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved).map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })) : [];
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
}

export function saveData(key: keyof typeof STORAGE_KEYS, data: any) {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
}

export function loadData(key: keyof typeof STORAGE_KEYS) {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS[key]);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    
    // Validate data structure and return null if invalid
    if (!data || typeof data !== 'object') return null;
    
    return data;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return null;
  }
}

export function clearAllData() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

// Helper function to sync finance and sales data
export function syncFinanceAndSalesData() {
  try {
    const financeData = loadData('FINANCE_DATA');
    const salesData = loadData('SALES_DATA');

    if (!financeData || !salesData) return;

    // Calculate total revenue from deals
    const totalRevenue = salesData.deals.recent.reduce((sum: number, deal: any) => sum + deal.value, 0);

    // Update finance data
    const updatedFinanceData = {
      ...financeData,
      balance: totalRevenue - financeData.moneyOut.total,
      moneyIn: {
        ...financeData.moneyIn,
        total: totalRevenue,
        recentTransactions: salesData.deals.recent.map((deal: any) => ({
          id: deal.id,
          name: `Deal: ${deal.name} (${deal.company})`,
          amount: deal.value,
          date: deal.date
        }))
      }
    };

    saveData('FINANCE_DATA', updatedFinanceData);
  } catch (error) {
    console.error('Error syncing data:', error);
  }
}