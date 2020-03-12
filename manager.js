const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const figlet = require("figlet");
// Wouldn't work for some reason 
// const dotenv = require('dotenv').config();
// const dotenv = require('dotenv').config({path: __dirname + '/.env'});

figlet('Landgraab Inc.', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Biacxv448!",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    startPrompt();
});

function startPrompt() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "startQ",
        choices: ["View All Employees", "View All Employees by Department", "View All Departments", "Add Department", "Remove Department", "View All Roles", "Add Role", "Remove Role", "View All Employees by Manager", "Update Employee Manager", "Update Employee Role", "Update Employee Department", "Add Employee", "Remove Employee", "Quit"],

    }).then(action => {


        switch (action.startQ) {
            case "View All Employees":
                viewEmployees();
                break;
            case "View All Employees by Manager":
                viewEmployeesMang();
                break;
            case "View All Employees by Department":
                viewEmployeesDep();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;    
            case "View All Departments":
                viewAllDep();
                break;
            case "Add Department":
                addDep();
                break;
            case "Remove Department":
                removeDep();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "Add Role":
                addRole();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "Quit":
                connection.end();
                break;
        };
    });
};

const employeeArray = ["Vanille Oerba", "Dina Caliente", "Nina Caliente", "Bella Goth", "Caroline Custard", "Tyshawn Mercer", "Ann Takamaki", "Don Lothario", "Chad Michaels", "Malcolm Landgraab IV", "Brandi Broke"]
const managerArray = ["Vanille Oerba", "Dina Caliente", "Nina Caliente", "Bella Goth", "Null"];
const roleTitleArray = ["Chief Marketing Assistant", "CEO", "Vice President", "Futures Trader", "Angel Investor", "Telemarketer", "Field Sales Representative", "Corporate Drone", "Report Processor", "Custom Content Creator"]
const departmentArray = ["Marketing", "Operations", "Finance", "Sales", "Research", "Sim Resources"];

function viewEmployees() {
    console.log("-----------------------------------");
    connection.query("SELECT employees.id, first_name, last_name, title, department_id, salary, manager_id AS manager FROM role INNER JOIN employees ON role.id = employees.role_id INNER JOIN department ON department.id = role.department_id ORDER BY employees.id ASC;", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("-----------------------------------");
        startPrompt();
    });
};

function viewEmployeesMang() {
    inquirer.prompt({
        type: "list",
        message: "Which manager would you like to see employees for?",
        name: "managerQ",
        choices: managerArray

    }).then(answers => {
        let managerName = answers.managerQ.split(" ");
        let managerFirst = managerName[0];
        let managerLast = managerName[1];
        //use this for UPDATE EMPLOYEE TOO //
        // const [firstName, lastName] = fullName.split(" ");

        connection.query("SELECT * FROM employees WHERE first_name = ? AND last_name = ?", [managerFirst, managerLast],
            function (err, manager) {
                if (err) throw err;
                // console.table(manager);

                connection.query("SELECT employees.id, first_name, last_name FROM employees WHERE employees.manager_id = ?", [manager[0].id],
                    function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        startPrompt();
                    });
            });
    });
};

function viewEmployeesDep() {
    inquirer.prompt({
        type: "list",
        message: "Which department would you like to search for?",
        name: "departmentQ",
        choices: departmentArray

    }).then(answers => {
        connection.query("SELECT employees.id, first_name, last_name, title FROM role INNER JOIN employees ON role.id = employees.role_id INNER JOIN department ON role.department_id = department.id WHERE department.name = ?;", [answers.departmentQ], function (err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
        });
    });
};

function viewAllDep() {
    connection.query("SELECT department.id, department.name FROM department;",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
        });
};

function addEmployee() {
    inquirer.prompt([{
        type: "input",
        message: "What is the employee's first name?",
        name: "employeeFN",
    }, {
        type: "input",
        message: "What is the employee's last name?",
        name: "employeeLN",
    }, {
        type: "list",
        message: "What is the employee's role?",
        name: "employeeRole",
        choices: roleTitleArray
    }, {
        type: "list",
        message: "Who is the employee's manager?",
        name: "employeeMang",
        choices: managerArray

    }]).then(answers => {
        const [first_name, last_name] = answers.employeeMang.split(" ");

        connection.query(`SELECT id FROM role WHERE role.title = "${answers.employeeRole}" UNION ALL SELECT manager_id FROM employees WHERE first_name = ? AND last_name = ?`, [first_name, last_name], function (err, res) {
            if (err) throw err;
            if (answers.employeeMang === "Null") {
                connection.query("INSERT INTO employees SET ?", [{
                    first_name: answers.employeeFN,
                    last_name: answers.employeeLN,
                    role_id: res[0].id,
                }], function (err, res) {
                    if (err) throw err;
                    res = newEmployee;
                    newEmployee.push(employeeArray);
                    console.log("Successfully added employee to the database!");
                    startPrompt();
                });
            } else {
                connection.query("INSERT INTO employees SET ?", [{
                    first_name: answers.employeeFN,
                    last_name: answers.employeeLN,
                    role_id: res[0].id,
                    manager_id: res.manager_id,
                }], function (err, res) {
                    if (err) throw err;
                    // res.push(employeeArray);
                    console.log("Successfully added employee to the database!");
                    startPrompt();
                });
            }
        });
    });
};

function removeEmployee() {
    inquirer.prompt({
        type: "list",
        message: "Which employee would you like to remove?",
        name: "removeQ",
        choices: employeeArray

    }).then(answers => {
        const [first_name, last_name] = answers.removeQ.split(" ");
        connection.query("DELETE FROM employees WHERE first_name = ? AND last_name = ?", [first_name, last_name], function (err, res) {
            if (err) throw err;
            console.log("Sucessfully removed employee from the database!");
            startPrompt();
        });
    });
};

function viewAllRoles() {
    connection.query("SELECT role.id, title FROM role;",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            startPrompt();
        });
};

function updateEmployeeRole() {
    inquirer.prompt([{
        type: "list",
        message: "Which employee's role would you like to update?",
        name: "whichEmployeeQ",
        choices: employeeArray
    }, {
        type: "list",
        message: "Which role would you like to assign to the chosen employee?",
        name: "updateRoleQ",
        choices: roleTitleArray

    }]).then(answers => {
       // const [first_name, last_name] = answers.whichEmployeeQ.split(" ");

        connection.query("SELECT first_name, last_name, role_id, title FROM employees INNER JOIN role ON role.id = employees.role_id", function (err, res) {
            if (err) throw err;
        roleTitleId = res[0].id;
       });
        connection.query("UPDATE role SET title = ? WHERE role.id = 6", [answers.updateRoleQ], function (err, res) {
                if (err) throw err;
                console.log(`${answers.whichEmployeeQ}'s role successfully updated!`);
                startPrompt();
            });
        });
    };

function addDep() {
    inquirer.prompt({
        type: "input",
        message: "What is the name of the department you would like to add?",
        name: "addDeptQ"

    }).then(answers => {
        connection.query("INSERT INTO department(name) VALUES (?)", [answers.addDeptQ], function (err, res) {
            if (err) throw err;
            // res.toString().push(departmentArray);
            console.log(`Successfully added ${answers.addDeptQ} to the database`);
            startPrompt();
        });
    });
}

function addRole() {
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the role you would like to add?",
        name: "addRoleQ"
    }, {
        type: "number",
        message: "What is the annual salary for this role?",
        name: "salaryQ"
    }, {
        type: "list",
        message: "To which department does this role belong?",
        name: "roleDepQ",
        choices: departmentArray

    }]).then(roleAnswers => {
        connection.query("SELECT department.id FROM department WHERE department.name = ?", [roleAnswers.departmentArray], function (err, res) {
            if (err) throw err;
            // console.log(res.department.id);
            connection.query("INSERT INTO role SET ?", [{
                title: roleAnswers.addRoleQ,
                salary: roleAnswers.salaryQ,
                department_id: 6,
            }], function (err, res) {
                if (err) throw err;
                console.log("Successfully added role to the database!");
                // res.push(roleTitleArray);
            });
        });
    });
};

function removeRole() {
    inquirer.prompt({
        type: "list",
        message: "What is the name of the role you would like to remove?",
        name: "removeRoleQ",
        choices: roleTitleArray

    }).then(answers => {
        connection.query("DELETE FROM role WHERE role.title = ?", [answers.removeRoleQ], function (err, res) {
            if (err) throw err;
            console.log(`Successfully removed the ${answers.removeRoleQ} role from the database`);
            startPrompt();
        });
    })
};

function removeDep() {
    inquirer.prompt({
        type: "list",
        message: "What is the name of the department you would like to remove?",
        name: "removeDeptQ",
        choices: departmentArray

    }).then(answers => {
        connection.query("DELETE FROM department WHERE department.name = ?", [answers.removeDeptQ], function (err, res) {
            if (err) throw err;
            for (i = 1; i < departmentArray.length; i++) {
                let chosenDepartment = departmentArray[i];
                if (chosenDepartment === answers.removeDeptQ) {
                    departmentArray.splice(chosenDepartment, 1);
                }
                console.log(`Successfully removed the ${answers.removeDeptQ} department from the database`);
                startPrompt();
            };
        });
    });
};