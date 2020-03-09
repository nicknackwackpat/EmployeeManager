const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const figlet = require("figlet");

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
        choices: ["View All Employees", "View All Employees by Department", "View All Employees by Manager", "Add Employee", "Remove Employee", "Update Employee", "Quit"],

    }).then(action => {


        switch (action.startQ) {
            case "View All Employees":
                viewEmployees();
            case "View All Employees by Department":
                viewEmployeesDep();
            case "View All Employees by Manager":
                viewEmployeesMang();
            case "Add Employee":
                addEmployee();
            case "Remove Employee":
                removeEmployee();
            case "Update Employee":
                updateEmployee();
            case "Quit":
                // connection.end();
        };
    });
};

function viewEmployees() {
    console.log("-----------------------------------");
    connection.query("SELECT employees.id, first_name, last_name, title, department_id, salary, manager_id FROM role INNER JOIN employees ON role.id = employees.role_id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("-----------------------------------");
        // };
        startPrompt();
    });
};

function viewEmployeesDep() {
    inquirer.prompt({
        type: "list",
        message: "Which department would you like to search for?",
        name: "departmentQ",
        choices: ["Marketing", "Operations", "Finance", "Sales", "Research", "Sim Resources"]

    }).then(answers => {
        connection.query("SELECT employees.id, first_name, last_name, title, department_id FROM role INNER JOIN employees ON department.id = role.department_id;", [`${answers.departmentQ}`], function (err, res) {
            if (err) throw err;
            console.table(res);
            // for (var i = 0; i < res.length; i++) {
            //     console.table(res[i].id + " | " + res[i].name + ");
            // });
        });
    });
};

function viewEmployeesMang() {

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
        choices: ["Chief Marketing Assistant", "CEO", "Vice President", "Futures Trader", "Angel Investor", "Telemarketer", "Field Sales Representative", "Corporate Drone", "Report Processor", "Custom Content Creator"]
    }, {
        type: "list",
        message: "Who is the employee's manager?",
        name: "employeeMang",
        choices: ["None", "Vanille Oerba", "Dina Caliente", "Nina Caliente", "Bella Goth"]

    }]).then(answers => {
        if(answers.employeeMang === "None") {
            connection.query(`INSERT INTO employees (first_name, last_name, role_id)  VALUES ("${answers.employeeFN}", "${answers.employeeLN}, ${answers.employeeRole});`, function (err, res) {
            if (err) throw err;
            console.table(res);
            });
        } else {
            connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)  VALUES ("${answers.employeeFN}", "${answers.employeeLN}, ${answers.employeeRole}, ${answers.employeeMang});`, function (err, res) {
                if (err) throw err;
                console.table(res);
            }); 
        };
    });
};

    function removeEmployee() {
        inquirer.prompt({
            type: "list",
            message: "Which employee would you like to remove?",
            name: "removeQ",
            choices: ["Vanille Oerba", "Dina Caliente", "Nina Caliente", "Bella Goth", "Caroline Custard", "Tyshawn Mercer", "Ann Takamaki", "Don Lothario", "Chad Michaels"]

        }).then(answers => {
            connection.query(`DELETE ${answers.removeQ} from employees;`, function (err, res) {
                if (err) throw err;
                console.table(res);
                startPrompt();
            });
        });
    };

    // function updateEmployee() {