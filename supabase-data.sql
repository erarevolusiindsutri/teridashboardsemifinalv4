-- Insert test financial transactions
WITH test_user AS (
  SELECT id FROM users LIMIT 1
)
INSERT INTO financial_transactions (user_id, amount, transaction_type, description, created_at)
SELECT 
  (SELECT id FROM test_user),
  amount,
  transaction_type,
  description,
  created_at
FROM (
  VALUES
    (470, 'income', 'CAFERACER ID', NOW()),
    (350, 'income', 'PT Hasta Kencana', NOW() - INTERVAL '15 days'),
    (250, 'income', 'Digital Ocean', NOW() - INTERVAL '20 days'),
    (50, 'expense', 'bolt.new', NOW()),
    (15, 'expense', 'Notion', NOW() - INTERVAL '2 days'),
    (30, 'expense', 'Zapier', NOW() - INTERVAL '5 days')
) AS data(amount, transaction_type, description, created_at);

-- Insert test leads
WITH test_user AS (
  SELECT id FROM users LIMIT 1
)
INSERT INTO leads (user_id, name, company, status, created_at)
SELECT 
  (SELECT id FROM test_user),
  name,
  company,
  status,
  created_at
FROM (
  VALUES
    ('Sarah Chen', 'Digital Ocean', 'New', NOW()),
    ('Michael Park', 'Stripe', 'Follow-up', NOW() - INTERVAL '1 hour'),
    ('Emma Wilson', 'Netflix', 'New', NOW() - INTERVAL '3 hours')
) AS data(name, company, status, created_at);

-- Insert test meetings
WITH test_user AS (
  SELECT id FROM users LIMIT 1
)
INSERT INTO meetings (user_id, name, company, scheduled_time, status, created_at)
SELECT 
  (SELECT id FROM test_user),
  name,
  company,
  scheduled_time,
  status,
  created_at
FROM (
  VALUES
    ('John Smith', 'AWS', NOW() + INTERVAL '2 hours', 'scheduled', NOW()),
    ('Anna Lee', 'Google', NOW() + INTERVAL '1 day', 'scheduled', NOW()),
    ('Tom Wilson', 'Meta', NOW() + INTERVAL '2 days', 'scheduled', NOW())
) AS data(name, company, scheduled_time, status, created_at);

-- Insert test deals
WITH test_user AS (
  SELECT id FROM users LIMIT 1
)
INSERT INTO deals (user_id, name, company, value, status, created_at)
SELECT 
  (SELECT id FROM test_user),
  name,
  company,
  value,
  status,
  created_at
FROM (
  VALUES
    ('Enterprise Plan', 'Shopify', 15000, 'won', NOW()),
    ('Team License', 'Atlassian', 8500, 'won', NOW() - INTERVAL '1 day'),
    ('Custom Solution', 'Salesforce', 12000, 'won', NOW() - INTERVAL '2 days')
) AS data(name, company, value, status, created_at);