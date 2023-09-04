const Joi = require('joi');
const { Designation } = require('../../models/designation/designation');
const { User } = require('../../models/auth/user');

class DesignationService {
  async addDesignation(req, res, next) {
    try {
      const payload = req.body;
      const designationData = Joi.object({
        name: Joi.string().required(),
      });
      const { error } = designationData.validate(payload);
      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const newRequest = await Designation(payload);
      newRequest.save((err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ msgError: true, message: 'Error ' + err });
        } else {
          return res.status(201).json({
            msgError: false,
            message: 'Designation created Successfully',
            result,
          });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msgError: true, message: 'Internal Server Error ' + error });
    }
  }

  async editDesignation(req, res, next) {
    try {
      const payload = req.body;
      const designationData = Joi.object({
        name: Joi.string().required(),
      });
      const { error } = designationData.validate(payload);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      if (payload.name == 'Admin') {
        return res.status(400).json({
          msgError: true,
          message: "Admin designation is fixed. Can't edit",
        });
      }

      await Designation.findByIdAndUpdate(
        { _id: req.params.id },
        payload,
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgError: true, message: 'Error ' + err });
          } else {
            return res.status(201).json({
              msgError: false,
              message: 'Designation Updated Successfully',
            });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgError: true, message: 'Internal Server Error ' + error });
    }
  }

  async allDesignation(req, res, next) {
    try {
      let { limit, page } = req.query;
      Designation.find({})
        .sort({ createdAt: -1 })
        .exec((err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgError: true, message: 'Error ' + err });
          } else {
            if (!limit || !page) {
              limit = 100;
              page = 1;
            }
            limit = parseInt(limit);
            page = parseInt(page);
            if (limit > 100) {
              limit = 100;
            }

            let total_page = Math.ceil(details.length / limit);
            let sliceArr =
              details && details.slice(limit * (page - 1), limit * page);
            return res.status(200).json({
              msgErr: false,
              result: sliceArr,
              pagination: {
                limit,
                current_page: page,
                total_page: total_page,
              },
            });
          }
        });
    } catch (error) {
      return res
        .status(500)
        .json({ msgError: true, message: 'Internal Server Error ' + error });
    }
  }

  async deleteDesignation(req, res, next) {
    try {
      const existActiveDesignation = await User.find({
        designation: req.params.id,
      });
      if (existActiveDesignation.length > 0) {
        return res.status(400).json({
          msgError: true,
          message: "Designation already used. Can't Delete.",
        });
      }
      let existDesignation = await Designation.findById({ _id: req.params.id });
      if (!existDesignation) {
        return res.status(400).json({
          msgError: true,
          message: 'Designation not found.',
        });
      } else if (existDesignation.name == 'Admin') {
        return res.status(400).json({
          msgError: true,
          message: "Admin designation is fixed. Can't delete.",
        });
      }
      await Designation.findByIdAndDelete(
        { _id: req.params.id },
        (err, done) => {
          if (err) {
            return res
              .status(400)
              .json({ msgError: true, message: 'Error ' + err });
          } else {
            return res.status(200).json({
              msgError: false,
              message: 'Designation Deleted Successfully',
            });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgError: true, message: 'Internal Server Error ' + error });
    }
  }
}

module.exports = new DesignationService();
