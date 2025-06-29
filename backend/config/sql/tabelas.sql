CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  salary DECIMAL(10,2),
  admission_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE incomes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  description TEXT,
  amount DECIMAL(10,2),
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  description TEXT,
  category VARCHAR(100),
  amount DECIMAL(10,2),
  date DATE,
  employee_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE income_parts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  income_id INT,
  amount DECIMAL(10, 2),
  date DATE,
  label VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (income_id) REFERENCES incomes(id)
);
