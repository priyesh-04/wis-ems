const Joi = require('joi');
const { ClientDetails } = require('../../models/clientDetails/clientDetails');
const { TaskDetails } = require('../../models/timesheets/taskDetails');

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
              message: 'Client result Update Successfully.',
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
      let { limit, page } = req.query;
      await ClientDetails.find({}, (err, details) => {
        if (err) {
          return res
            .status(400)
            .json({ msgErr: true, message: 'Error ' + err });
        } else {
          if (!limit || !page) {
            limit = 10;
            page = 1;
          }
          if (limit > 100) {
            limit = 100;
          }
          limit = parseInt(limit);
          page = parseInt(page);
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
        .json({ msgErr: true, message: 'Internal server error ' + error });
    }
  }

  async deleteClient(req, res, next) {
    try {
      const usedClient = await TaskDetails.find({ client: req.params.id });
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
              message: 'Client result Deleted Successfully.',
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

  async getAllTaskClientWise(req, res, next) {
    try {
      let { limit, page } = req.query;
      await TaskDetails.find({ client: req.params.id })
        .populate('client', '_id client_name')
        .populate('created_by', '_id name')
        .sort({ createdAt: -1 })
        .lean()
        .exec((err, details) => {
          if (err) {
            return res
              .status(400)
              .json({ msgErr: true, message: 'Error ' + err });
          } else {
            if (!limit || !page) {
              limit = 10;
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
        .json({ msgErr: true, message: 'Internal server error ' + error });
    }
  }
}

module.exports = new ClientDetailsService();
