DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(13,2) NOT NULL,
  department_id INT(10) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES deptartment(id)
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  manager_id INT(10),
  role_id INT(10),
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Vanille", "Oerba", 1), ("Dina", "Caliente", 2), ("Nina", "Caliente", 4), ("Bella", "Goth", 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Caroline", "Custard", 6, 3), ("Tyshawn", "Mercer", 7, 4), ("Ann", "Takamaki", 9, 2), ("Don", "Lothario", 8, 1), ("Chad", "Michaels", 10, 2);

INSERT INTO department (name)
VALUES ("Marketing"), ("Operations"), ("Finance"), ("Sales"), ("Research"), ("Sim Resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Chief Marketing Assistant", 150000.00, 1), ("CEO", 600000.00, 2), ("Vice President", 550000.00, 2), ("Futures Trader", 250000.00, 3), ("Angel Investor", 275000.00, 3), ("Telemarketer", 400000.00, 4), ("Field Sales Representative", 800000.00, 4),("Corporate Drone", 60.000, 5), ("Report Processor", 75.000, 5), ("Custom Content Creator", 175.000, 6);