const Joi = require('joi');
const designation = require('../../models/designation/designation');

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

      const newRequest = await designation(payload);
      newRequest.save((err, details) => {
        if (err) {
          return res
            .status(400)
            .json({ msgError: true, message: 'Error ' + err });
        } else {
          return res.status(201).json({
            msgError: false,
            message: 'Designation created succesfully',
            details,
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

      await designation.findByIdAndUpdate(
        { _id: req.params.id },
        payload,
        (err, details) => {
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
      await designation.find({}, (err, details) => {
        if (err) {
          return res
            .status(400)
            .json({ msgError: true, message: 'Error ' + err });
        } else {
          return res.status(201).json({
            msgError: false,
            message: 'All Designations.',
            details,
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
      await designation.findByIdAndDelete(
        { _id: req.params.id },
        (err, done) => {
          if (err) {
            return res
              .status(400)
              .json({ msgError: true, message: 'Error ' + err });
          } else {
            return res.status(200).json({
              msgError: false,
              message: 'Designation Deleted Succesfully',
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
