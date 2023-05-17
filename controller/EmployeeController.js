const Employee = require('../models/EmployeeModel');

//Show all employee
const index = async (req, res, next) => {
  try {
    if (req.query.page && req.query.limit) {
      await Employee.paginate(
        {},
        { page: req.query.page, limit: req.query.limit }
      ).then((response) => {
        res.status(200).json({
          response,
        });
      });
    } else {
      await Employee.find().then((response) => {
        res.status(200).json({
          response,
        });
      });
    }
  } catch (error) {
    res.status(400).json({
      message: `Error occured, ${error}`,
    });
  }
};

//Query for an Employee by ID
const show = async (req, res, next) => {
  try {
    let employeeID = req.body.employeeID;
    await Employee.findById(employeeID).then((response) => {
      res.json({
        response,
      });
    });
  } catch (error) {
    res.json({
      message: `Error encountered ${error}`,
    });
  }
};

//Add an employee to db
const store = async (req, res, next) => {
  try {
    let employee = new Employee({
      name: req.body.name,
      designation: req.body.designation,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
    });
    if (req.file) {
      employee.avatar = req.file.path;
    }
    // if(req.files){
    //     let path = ''
    //     req.files.forEach(function(files, index, arr){
    //         path= path + files.path + ','
    //     })
    //     path=path.substring(0, path.lastIndexOf(','))
    //     employee.avatar = path
    // } ^^^^^^^^^^ multiple files
    await employee.save().then((response) => {
      res.json({
        message: 'Employee added',
      });
    });
  } catch (error) {
    res.json({
      message: `Error encountered ${error}`,
    });
  }
};

//Update an employee
const update = async (req, res, next) => {
  try {
    let employeeID = req.body.employeeID;

    let updatedData = {
      name: req.body.name,
      designation: req.body.designation,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
    };
    await Employee.findByIdAndUpdate(employeeID, { $set: updatedData }).then(
      (response) => {
        res.json({
          response: 'Employee updated',
        });
      }
    );
  } catch (error) {
    res.json({
      message: `Error encountered ${error}`,
    });
  }
};

//Delete an employee
const destroy = async (req, res, next) => {
  try {
    let employeeID = req.body.employeeID;
    await Employee.findByIdAndRemove(employeeID).then((response) => {
      res.json({
        response: 'Employee deleted',
      });
    });
  } catch (error) {
    res.json({
      message: `Error encountered ${error}`,
    });
  }
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
