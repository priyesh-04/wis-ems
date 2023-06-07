const Joi = require('joi');
const ClientDetails = require('../../models/clientDetails/clientDetails');
const taskDetails = require('../../models/timesheets/taskDetails');

class ClientDetailsService {
  async addClient(req, res, next) {
    try {
      const payload = req.body;
      const clientdetails = Joi.object({
        client_name: Joi.string().required(),
        company_name: Joi.string().required(),
        person_name: Joi.string().required(),
        mobile_number: Joi.number().required(),
        company_email: Joi.string().email().required(),
        employee_assigned: Joi.array(),
        start_date: Joi.string(),
        end_date: Joi.string(),
      });

      const { error } = clientdetails.validate(payload);

      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const newRequest = await new ClientDetails(payload);
      newRequest.save((err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ msgErr: true, message: 'Error ' + err });
        } else {
          return res.status(201).json({
            msgErr: false,
            result,
            message: 'Client Create Succesfull.',
          });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error ' + error });
    }
  }

  async updateClient(req, res, next) {
    try {
      const payload = req.body;
      const clientdetails = Joi.object({
        client_name: Joi.string().required(),
        company_name: Joi.string().required(),
        person_name: Joi.string().required(),
        mobile_number: Joi.number().required(),
        company_email: Joi.string().email().required(),
        employee_assigned: Joi.array(),
        start_date: Joi.string(),
        end_date: Joi.string(),
      });

      const { error } = clientdetails.validate(payload);

      if (error) {
        return res.status(400).json({ message: error.message });
      }
      await ClientDetails.findByIdAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true },
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Bad Request' });
          } else {
            return res.status(200).json({
              msgErr: false,
              message: 'Client result Update Succesfully.',
            });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error ' + error });
    }
  }

  async getAllClient(req, res, next) {
    try {
      await ClientDetails.find({}, (err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ msgErr: true, message: 'Error ' + err });
        } else {
          return res.status(200).json({
            msgErr: false,
            result,
          });
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal server error ' + error });
    }
  }

  async deleteClient(req, res, next) {
    try {
      const usedClient = await taskDetails.find({ client: req.params.id });
      if (usedClient) {
        return res.status(400).json({
          msgErr: true,
          message:
            "Can't Delete this client. This Client carrying some employee timesheet records.",
        });
      }
      await ClientDetails.findByIdAndDelete(
        { _id: req.params.id },
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else if (!result) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Invalid Id' });
          } else {
            return res.status(200).json({
              msgErr: false,
              message: 'Client result Deleted Succesfully.',
            });
          }
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ msgErr: true, message: 'Internal server error ' + error });
    }
  }
}

module.exports = new ClientDetailsService();
