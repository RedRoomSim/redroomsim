CREATE TABLE user_login_logs (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(100),
    event VARCHAR(255),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    ip_address VARCHAR(45)  -- for future
);

 CREATE TABLE redroomsimdb.simulation_analytics (
     id SERIAL PRIMARY KEY,
     uid TEXT NOT NULL,
     scenario_id TEXT NOT NULL,
     score INTEGER,
     timeline JSONB,
     started_at TIMESTAMP,
     ended_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT now()
);