CREATE TABLE redroomsimdb.user_login_logs (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(100),
    event VARCHAR(255),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    ip_address VARCHAR(45)
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

CREATE TABLE redroomsimdb.simulation_progress (
    id SERIAL PRIMARY KEY,
    sim_uuid UUID NOT NULL UNIQUE,
    scenario_id TEXT NOT NULL,
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    score INTEGER,
    completed BOOLEAN,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE (username, scenario_id)
);

CREATE TABLE redroomsimdb.simulation_step_progress (
    id SERIAL PRIMARY KEY,
    sim_uuid UUID NOT NULL REFERENCES redroomsimdb.simulation_progress(sim_uuid),
    step_index INTEGER NOT NULL,
    decision TEXT NOT NULL,
    feedback TEXT,
    time_ms INTEGER,
    sequence INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Stores high-level audit information for administrator actions
CREATE TABLE redroomsimdb.audit_logs (
    id SERIAL PRIMARY KEY, -- unique audit entry ID
    actor VARCHAR(255), -- user performing the action
    action TEXT NOT NULL, -- description of what happened
    details TEXT, -- optional additional context
    timestamp TIMESTAMPTZ DEFAULT now() -- time of the event
);
