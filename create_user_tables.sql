CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY NOT NULL,
  username text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text DEFAULT 'admin' NOT NULL,
  is_active integer DEFAULT 1 NOT NULL,
  last_login_at text,
  created_at text DEFAULT (datetime('now')) NOT NULL,
  updated_at text DEFAULT (datetime('now')) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users (is_active);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  session_token text NOT NULL UNIQUE,
  expires_at text NOT NULL,
  ip_address text,
  user_agent text,
  created_at text DEFAULT (datetime('now')) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions (session_token);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires ON auth_sessions (expires_at);
