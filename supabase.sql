-- Drop existing tables if they exist
DROP TABLE IF EXISTS project_components;
DROP TABLE IF EXISTS components;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS deals;
DROP TABLE IF EXISTS meetings;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS financial_transactions;

-- Create tables with UUID foreign keys
CREATE TABLE financial_transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount NUMERIC(10, 2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leads (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('New', 'Follow-up', 'Qualified', 'Lost')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE meetings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deals (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('won', 'lost', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'proposal')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE components (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE CHECK (name IN ('sales', 'customer-service', 'data', 'operation'))
);

CREATE TABLE project_components (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
  component_id BIGINT REFERENCES components(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, component_id)
);

-- Insert default components
INSERT INTO components (name) VALUES
  ('sales'),
  ('customer-service'),
  ('data'),
  ('operation');

-- Create indexes
CREATE INDEX idx_financial_transactions_user_id ON financial_transactions(user_id);
CREATE INDEX idx_financial_transactions_created_at ON financial_transactions(created_at);
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_meetings_user_id ON meetings(user_id);
CREATE INDEX idx_meetings_scheduled_time ON meetings(scheduled_time);
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_created_at ON deals(created_at);
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Enable RLS
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_components ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for own transactions" ON financial_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for own transactions" ON financial_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own transactions" ON financial_transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for own transactions" ON financial_transactions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for own leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for own meetings" ON meetings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for own meetings" ON meetings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own meetings" ON meetings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for own meetings" ON meetings
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for own deals" ON deals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for own deals" ON deals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own deals" ON deals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for own deals" ON deals
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Enable read access for own project components" ON project_components
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_components.project_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Enable insert for own project components" ON project_components
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_components.project_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Enable update for own project components" ON project_components
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_components.project_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Enable delete for own project components" ON project_components
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_components.project_id 
      AND user_id = auth.uid()
    )
  );