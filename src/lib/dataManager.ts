import { create } from 'zustand';
import { supabase } from './supabase';
import { saveData, loadData, syncFinanceAndSalesData } from './storage';

interface DataState {
  currentUser: {
    id: string;
    email: string;
  } | null;
  financeData: {
    balance: number;
    moneyIn: {
      total: number;
      trend: number;
      recentTransactions: Array<{
        id: string;
        name: string;
        amount: number;
        date: string;
      }>;
    };
    moneyOut: {
      total: number;
      trend: number;
      recentTransactions: Array<{
        id: string;
        name: string;
        amount: number;
        date: string;
      }>;
    };
  };
  salesData: {
    totalRevenue: number;
    leads: {
      count: number;
      trend: number;
      recent: Array<{
        id: string;
        name: string;
        company: string;
        status: string;
        time: string;
      }>;
    };
    meetings: {
      count: number;
      trend: number;
      upcoming: Array<{
        id: string;
        name: string;
        company: string;
        time: string;
        date: string;
        status: string;
      }>;
    };
    deals: {
      count: number;
      trend: number;
      recent: Array<{
        id: string;
        name: string;
        company: string;
        value: number;
        date: string;
        status: string;
      }>;
    };
  };
  productData: {
    projects: Array<{
      id: string;
      name: string;
      client: string;
      modules: Array<'sales' | 'customer-service' | 'data' | 'operation'>;
      status: 'active' | 'proposal';
      details?: {
        tasks: Array<{
          id: string;
          title: string;
          description: string;
          status: 'todo' | 'in-progress' | 'done';
        }>;
        documents: Array<any>;
        timeline: Array<any>;
      };
    }>;
    metrics: {
      activeProjects: number;
      proposals: number;
    };
  };
  initialize: () => Promise<void>;
  addDeal: (deal: { name: string; company: string; value: number; status: string; date: string; }) => Promise<void>;
  addLead: (lead: { name: string; company: string; status: string; }) => Promise<void>;
  removeLead: (id: string) => Promise<void>;
  editLead: (id: string, data: any) => Promise<void>;
  editDeal: (id: string, data: any) => Promise<void>;
  removeDeal: (id: string) => Promise<void>;
  addTransaction: (type: 'in' | 'out', transaction: { name: string; amount: number; date: string; }) => Promise<void>;
  editTransaction: (type: 'in' | 'out', id: string, data: any) => Promise<void>;
  removeTransaction: (type: 'in' | 'out', id: string) => Promise<void>;
  addProject: (project: { name: string; client: string; modules: string[]; status: string; }) => Promise<void>;
  addTask: (projectId: string, task: { title: string; description: string; status: string; }) => Promise<void>;
  updateTask: (projectId: string, taskId: string, data: any) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  currentUser: null,
  financeData: {
    balance: 0,
    moneyIn: {
      total: 0,
      trend: 0,
      recentTransactions: []
    },
    moneyOut: {
      total: 0,
      trend: 0,
      recentTransactions: []
    }
  },
  salesData: {
    totalRevenue: 0,
    leads: {
      count: 0,
      trend: 0,
      recent: []
    },
    meetings: {
      count: 0,
      trend: 0,
      upcoming: []
    },
    deals: {
      count: 0,
      trend: 0,
      recent: []
    }
  },
  productData: {
    projects: [],
    metrics: {
      activeProjects: 0,
      proposals: 0
    }
  },

  initialize: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      set({ currentUser: { id: user.id, email: user.email || '' } });

      // Load initial data
      const [
        { data: transactions },
        { data: leads },
        { data: meetings },
        { data: deals },
        { data: projects }
      ] = await Promise.all([
        supabase.from('financial_transactions').select().eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('leads').select().eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('meetings').select().eq('user_id', user.id).order('scheduled_time', { ascending: true }),
        supabase.from('deals').select().eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('projects').select('*, project_components(component_id)').eq('user_id', user.id)
      ]);

      // Process transactions
      const moneyIn = transactions?.filter(t => t.transaction_type === 'income') || [];
      const moneyOut = transactions?.filter(t => t.transaction_type === 'expense') || [];

      // Update state
      set({
        financeData: {
          balance: moneyIn.reduce((sum, t) => sum + t.amount, 0) - moneyOut.reduce((sum, t) => sum + t.amount, 0),
          moneyIn: {
            total: moneyIn.reduce((sum, t) => sum + t.amount, 0),
            trend: moneyIn.length > 1 ? (moneyIn[0].amount - moneyIn[1].amount) / moneyIn[1].amount : 0,
            recentTransactions: moneyIn.map(t => ({
              id: t.id.toString(),
              name: t.description || '',
              amount: t.amount,
              date: t.created_at
            }))
          },
          moneyOut: {
            total: moneyOut.reduce((sum, t) => sum + t.amount, 0),
            trend: moneyOut.length > 1 ? (moneyOut[0].amount - moneyOut[1].amount) / moneyOut[1].amount : 0,
            recentTransactions: moneyOut.map(t => ({
              id: t.id.toString(),
              name: t.description || '',
              amount: t.amount,
              date: t.created_at
            }))
          }
        },
        salesData: {
          totalRevenue: deals?.reduce((sum, d) => sum + d.value, 0) || 0,
          leads: {
            count: leads?.length || 0,
            trend: leads && leads.length > 1 ? 0.1 : 0,
            recent: (leads || []).map(l => ({
              id: l.id.toString(),
              name: l.name,
              company: l.company,
              status: l.status,
              time: new Date(l.created_at).toLocaleString()
            }))
          },
          meetings: {
            count: meetings?.length || 0,
            trend: meetings && meetings.length > 1 ? 0.08 : 0,
            upcoming: (meetings || []).map(m => ({
              id: m.id.toString(),
              name: m.name,
              company: m.company,
              time: new Date(m.scheduled_time).toLocaleTimeString(),
              date: new Date(m.scheduled_time).toLocaleDateString(),
              status: m.status
            }))
          },
          deals: {
            count: deals?.length || 0,
            trend: deals && deals.length > 1 ? 0.15 : 0,
            recent: (deals || []).map(d => ({
              id: d.id.toString(),
              name: d.name,
              company: d.company,
              value: d.value,
              date: new Date(d.created_at).toLocaleDateString(),
              status: d.status
            }))
          }
        },
        productData: {
          projects: (projects || []).map(p => ({
            id: p.id.toString(),
            name: p.name,
            client: p.client,
            modules: p.project_components.map((pc: any) => 
              pc.component_id === 1 ? 'sales' :
              pc.component_id === 2 ? 'customer-service' :
              pc.component_id === 3 ? 'data' : 'operation'
            ),
            status: p.status,
            details: {
              tasks: [],
              documents: [],
              timeline: []
            }
          })),
          metrics: {
            activeProjects: (projects || []).filter(p => p.status === 'active').length,
            proposals: (projects || []).filter(p => p.status === 'proposal').length
          }
        }
      });
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  },

  addDeal: async (deal) => {
    try {
      const { data: dealData } = await supabase
        .from('deals')
        .insert({
          user_id: get().currentUser?.id,
          name: deal.name,
          company: deal.company,
          value: deal.value,
          status: deal.status,
          created_at: deal.date
        })
        .select()
        .single();

      if (dealData) {
        // Add corresponding financial transaction
        const { data: transactionData } = await supabase
          .from('financial_transactions')
          .insert({
            user_id: get().currentUser?.id,
            amount: deal.value,
            transaction_type: 'income',
            description: `Deal: ${deal.name} with ${deal.company}`,
            created_at: deal.date
          })
          .select()
          .single();

        // Update state
        set(state => ({
          salesData: {
            ...state.salesData,
            totalRevenue: state.salesData.totalRevenue + deal.value,
            deals: {
              count: state.salesData.deals.count + 1,
              trend: ((state.salesData.deals.count + 1) - state.salesData.deals.count) / state.salesData.deals.count,
              recent: [{
                id: dealData.id.toString(),
                name: dealData.name,
                company: dealData.company,
                value: dealData.value,
                date: new Date(dealData.created_at).toLocaleDateString(),
                status: dealData.status
              }, ...state.salesData.deals.recent]
            }
          },
          financeData: {
            ...state.financeData,
            balance: state.financeData.balance + deal.value,
            moneyIn: {
              ...state.financeData.moneyIn,
              total: state.financeData.moneyIn.total + deal.value,
              recentTransactions: [{
                id: transactionData.id.toString(),
                name: transactionData.description || '',
                amount: transactionData.amount,
                date: transactionData.created_at
              }, ...state.financeData.moneyIn.recentTransactions]
            }
          }
        }));

        // Add project if it's a won deal
        if (deal.status === 'won') {
          const { data: projectData } = await supabase
            .from('projects')
            .insert({
              user_id: get().currentUser?.id,
              name: deal.name,
              client: deal.company,
              status: 'active'
            })
            .select()
            .single();

          if (projectData) {
            await supabase
              .from('project_components')
              .insert([
                { project_id: projectData.id, component_id: 1 }, // Sales
                { project_id: projectData.id, component_id: 2 }  // Customer Service
              ]);

            set(state => ({
              productData: {
                ...state.productData,
                projects: [
                  ...state.productData.projects,
                  {
                    id: projectData.id.toString(),
                    name: projectData.name,
                    client: projectData.client,
                    modules: ['sales', 'customer-service'],
                    status: 'active',
                    details: {
                      tasks: [],
                      documents: [],
                      timeline: []
                    }
                  }
                ],
                metrics: {
                  ...state.productData.metrics,
                  activeProjects: state.productData.metrics.activeProjects + 1
                }
              }
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error adding deal:', error);
      throw error;
    }
  },

  addLead: async (lead) => {
    try {
      const { data } = await supabase
        .from('leads')
        .insert({
          user_id: get().currentUser?.id,
          name: lead.name,
          company: lead.company,
          status: lead.status
        })
        .select()
        .single();

      if (data) {
        set(state => ({
          salesData: {
            ...state.salesData,
            leads: {
              count: state.salesData.leads.count + 1,
              trend: ((state.salesData.leads.count + 1) - state.salesData.leads.count) / state.salesData.leads.count,
              recent: [{
                id: data.id.toString(),
                name: data.name,
                company: data.company,
                status: data.status,
                time: new Date(data.created_at).toLocaleString()
              }, ...state.salesData.leads.recent]
            }
          }
        }));
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      throw error;
    }
  },

  removeLead: async (id) => {
    try {
      await supabase
        .from('leads')
        .delete()
        .eq('id', id)
        .eq('user_id', get().currentUser?.id);

      set(state => ({
        salesData: {
          ...state.salesData,
          leads: {
            ...state.salesData.leads,
            count: state.salesData.leads.count - 1,
            recent: state.salesData.leads.recent.filter(lead => lead.id !== id)
          }
        }
      }));
    } catch (error) {
      console.error('Error removing lead:', error);
      throw error;
    }
  },

  editLead: async (id, data) => {
    try {
      const { data: updatedLead } = await supabase
        .from('leads')
        .update(data)
        .eq('id', id)
        .eq('user_id', get().currentUser?.id)
        .select()
        .single();

      if (updatedLead) {
        set(state => ({
          salesData: {
            ...state.salesData,
            leads: {
              ...state.salesData.leads,
              recent: state.salesData.leads.recent.map(lead =>
                lead.id === id ? {
                  ...lead,
                  name: updatedLead.name,
                  company: updatedLead.company,
                  status: updatedLead.status
                } : lead
              )
            }
          }
        }));
      }
    } catch (error) {
      console.error('Error editing lead:', error);
      throw error;
    }
  },

  editDeal: async (id, data) => {
    try {
      const { data: updatedDeal } = await supabase
        .from('deals')
        .update(data)
        .eq('id', id)
        .eq('user_id', get().currentUser?.id)
        .select()
        .single();

      if (updatedDeal) {
        set(state => ({
          salesData: {
            ...state.salesData,
            totalRevenue: state.salesData.totalRevenue - 
              state.salesData.deals.recent.find(d => d.id === id)?.value +
              updatedDeal.value,
            deals: {
              ...state.salesData.deals,
              recent: state.salesData.deals.recent.map(deal =>
                deal.id === id ? {
                  ...deal,
                  name: updatedDeal.name,
                  company: updatedDeal.company,
                  value: updatedDeal.value,
                  status: updatedDeal.status
                } : deal
              )
            }
          }
        }));

        // Sync finance data
        syncFinanceAndSalesData();
      }
    } catch (error) {
      console.error('Error editing deal:', error);
      throw error;
    }
  },

  removeDeal: async (id) => {
    try {
      const deal = get().salesData.deals.recent.find(d => d.id === id);
      if (!deal) return;

      await supabase
        .from('deals')
        .delete()
        .eq('id', id)
        .eq('user_id', get().currentUser?.id);

      set(state => ({
        salesData: {
          ...state.salesData,
          totalRevenue: state.salesData.totalRevenue - deal.value,
          deals: {
            ...state.salesData.deals,
            count: state.salesData.deals.count - 1,
            recent: state.salesData.deals.recent.filter(d => d.id !== id)
          }
        }
      }));

      // Sync finance data
      syncFinanceAndSalesData();
    } catch (error) {
      console.error('Error removing deal:', error);
      throw error;
    }
  },

  addTransaction: async (type, transaction) => {
    try {
      const { data } = await supabase
        .from('financial_transactions')
        .insert({
          user_id: get().currentUser?.id,
          amount: transaction.amount,
          transaction_type: type === 'in' ? 'income' : 'expense',
          description: transaction.name,
          created_at: transaction.date
        })
        .select()
        .single();

      if (data) {
        set(state => ({
          financeData: {
            ...state.financeData,
            balance: type === 'in' ?
              state.financeData.balance + transaction.amount :
              state.financeData.balance - transaction.amount,
            [type === 'in' ? 'moneyIn' : 'moneyOut']: {
              ...state.financeData[type === 'in' ? 'moneyIn' : 'moneyOut'],
              total: state.financeData[type === 'in' ? 'moneyIn' : 'moneyOut'].total + transaction.amount,
              recentTransactions: [{
                id: data.id.toString(),
                name: data.description || '',
                amount: data.amount,
                date: data.created_at
              }, ...state.financeData[type === 'in' ? 'moneyIn' : 'moneyOut'].recentTransactions]
            }
          }
        }));
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  editTransaction: async (type, id, data) => {
    try {
      const { data: updatedTransaction } = await supabase
        .from('financial_transactions')
        .update(data)
        .eq('id', id)
        .eq('user_id', get().currentUser?.id)
        .select()
        .single();

      if (updatedTransaction) {
        set(state => {
          const transactions = state.financeData[type === 'in' ? 'moneyIn' : 'moneyOut'].recentTransactions;
          const oldTransaction = transactions.find(t => t.id === id);
          const amountDiff = updatedTransaction.amount - (oldTransaction?.amount || 0);

          return {
            financeData: {
              ...state.financeData,
              balance: type === 'in' ?
                state.financeData.balance + amountDiff :
                state.financeData.balance - amountDiff,
              [type === 'in' ? 'moneyIn' : 'moneyOut']: {
                ...state.financeData[type === 'in' ? 'moneyIn' : 'moneyOut'],
                total: state.financeData[type === 'in' ? 'moneyIn' : 'moneyOut'].total + amountDiff,
                recentTransactions: transactions.map(transaction =>
                  transaction.id === id ? {
                    ...transaction,
                    name: updatedTransaction.description || '',
                    amount: updatedTransaction.amount,
                    date: updatedTransaction.created_at
                  } : transaction
                )
              }
            }
          };
        });
      }
    } catch (error) {
      console.error('Error editing transaction:', error);
      throw error;
    }
  },

  removeTransaction: async (type, id) => {
    try {
      const transaction = get().financeData[type === 'in' ? 'moneyIn' : 'moneyOut'].recentTransactions.find(t => t.id === id);
      if (!transaction) return;

      await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', get().currentUser?.id);

      set(state => ({
        financeData: {
          ...state.financeData,
          balance: type === 'in' ?
            state.financeData.balance - transaction.amount :
            state.financeData.balance + transaction.amount,
          [type === 'in' ? 'moneyIn' : 'moneyOut']: {
            ...state.financeData[type === 'in' ? 'moneyIn' : 'moneyOut'],
            total: state.financeData[type === 'in' ? 'moneyIn' : 'moneyOut'].total - transaction.amount,
            recentTransactions: state.financeData[type === 'in' ? 'moneyIn' : 'moneyOut'].recentTransactions.filter(t => t.id !== id)
          }
        }
      }));
    } catch (error) {
      console.error('Error removing transaction:', error);
      throw error;
    }
  },

  addProject: async (project) => {
    try {
      const { data: projectData } = await supabase
        .from('projects')
        .insert({
          user_id: get().currentUser?.id,
          name: project.name,
          client: project.client,
          status: project.status
        })
        .select()
        .single();

      if (projectData) {
        // Add project components
        const componentIds = project.modules.map(module =>
          module === 'sales' ? 1 :
          module === 'customer-service' ? 2 :
          module === 'data' ? 3 : 4
        );

        await supabase
          .from('project_components')
          .insert(
            componentIds.map(component_id => ({
              project_id: projectData.id,
              component_id
            }))
          );

        set(state => ({
          productData: {
            ...state.productData,
            projects: [
              ...state.productData.projects,
              {
                id: projectData.id.toString(),
                name: projectData.name,
                client: projectData.client,
                modules: project.modules as Array<'sales' | 'customer-service' | 'data' | 'operation'>,
                status: project.status as 'active' | 'proposal',
                details: {
                  tasks: [],
                  documents: [],
                  timeline: []
                }
              }
            ],
            metrics: {
              ...state.productData.metrics,
              [project.status === 'active' ? 'activeProjects' : 'proposals']:
                state.productData.metrics[project.status === 'active' ? 'activeProjects' : 'proposals'] + 1
            }
          }
        }));
      }
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  },

  addTask: async (projectId, task) => {
    try {
      set(state => ({
        productData: {
          ...state.productData,
          projects: state.productData.projects.map(project =>
            project.id === projectId ? {
              ...project,
              details: {
                ...project.details!,
                tasks: [
                  ...project.details!.tasks,
                  {
                    id: Date.now().toString(),
                    title: task.title,
                    description: task.description,
                    status: task.status as 'todo' | 'in-progress' | 'done'
                  }
                ]
              }
            } : project
          )
        }
      }));
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  updateTask: async (projectId, taskId, data) => {
    try {
      set(state => ({
        productData: {
          ...state.productData,
          projects: state.productData.projects.map(project =>
            project.id === projectId ? {
              ...project,
              details: {
                ...project.details!,
                tasks: project.details!.tasks.map(task =>
                  task.id === taskId ? { ...task, ...data } : task
                )
              }
            } : project
          )
        }
      }));
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
}));