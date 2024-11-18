import { supabase } from './supabase';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  created_at: string;
  updated_at: string;
}

export const taskManager = {
  async fetchTasks(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data || [];
  },

  async createTask(projectId: string, task: {
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
  }): Promise<Task> {
    const { data, error } = await supabase
      .from('project_tasks')
      .insert({
        project_id: projectId,
        title: task.title,
        description: task.description,
        status: task.status
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return data;
  },

  async updateTask(taskId: string, updates: {
    title?: string;
    description?: string;
    status?: 'todo' | 'in-progress' | 'done';
  }): Promise<Task> {
    const { data, error } = await supabase
      .from('project_tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }

    return data;
  },

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('project_tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};