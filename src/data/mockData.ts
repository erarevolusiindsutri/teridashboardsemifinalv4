export const mockFinanceData = {
  balance: 329,
  moneyIn: {
    total: 470,
    trend: 0.196,
    recentTransactions: [
      { name: 'CAFERACER ID', amount: 470, date: '2024-03-01' },
      { name: 'PT Hasta Kencana', amount: 350, date: '2024-02-15' },
      { name: 'Digital Ocean', amount: 250, date: '2024-02-10' }
    ]
  },
  moneyOut: {
    total: 50,
    trend: -0.025,
    recentTransactions: [
      { name: 'bolt.new', amount: 50, date: '2024-03-01' },
      { name: 'Notion', amount: 15, date: '2024-02-28' },
      { name: 'Zapier', amount: 30, date: '2024-02-25' }
    ]
  }
};

export const mockSalesData = {
  totalRevenue: 47280,
  leads: {
    count: 24,
    trend: 0.12,
    recent: [
      { name: 'Sarah Chen', company: 'Digital Ocean', status: 'New', time: '2m ago' },
      { name: 'Michael Park', company: 'Stripe', status: 'Follow-up', time: '1h ago' },
      { name: 'Emma Wilson', company: 'Netflix', status: 'New', time: '3h ago' }
    ]
  },
  meetings: {
    count: 8,
    trend: 0.08,
    upcoming: [
      { name: 'John Smith', company: 'AWS', time: '2:30 PM', date: '2024-03-01' },
      { name: 'Anna Lee', company: 'Google', time: '4:00 PM', date: '2024-03-02' },
      { name: 'Tom Wilson', company: 'Meta', time: '10:00 AM', date: '2024-03-03' }
    ]
  },
  deals: {
    count: 5,
    trend: 0.15,
    recent: [
      { name: 'Enterprise Plan', company: 'Shopify', value: 15000, date: '2024-03-01' },
      { name: 'Team License', company: 'Atlassian', value: 8500, date: '2024-02-28' },
      { name: 'Custom Solution', company: 'Salesforce', value: 12000, date: '2024-02-25' }
    ]
  }
};

export const mockProductData = {
  projects: [
    {
      id: 'digital-ocean',
      name: 'Digital Ocean Dashboard',
      status: 'In Progress',
      modules: ['sales', 'customer-service', 'data', 'operation']
    },
    {
      id: 'aws',
      name: 'AWS Analytics Platform',
      status: 'Proposal',
      modules: ['customer-service', 'data']
    },
    {
      id: 'stripe',
      name: 'Stripe Integration',
      status: 'In Progress',
      modules: ['sales', 'customer-service']
    }
  ],
  metrics: {
    activeProjects: 5,
    proposals: 8,
    efficiency: 92
  }
};