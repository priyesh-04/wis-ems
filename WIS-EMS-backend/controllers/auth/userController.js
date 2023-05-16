const { CustomErrorhandler } = require('../../utils');
const { Employee } = require('../../models');

class UserController {
  async profile(req, res, next) {
    try {
      // console.log(req.user._id);
      const employee = await Employee.findOne({ _id: req.user._id }).select(
        '-password -updatedAt -__v'
      );
      if (!employee) {
        return next(CustomErrorhandler.notFound());
      }
      res.json(employee);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UserController();
