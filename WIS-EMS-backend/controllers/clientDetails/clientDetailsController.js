const { ClientDetailsService } = require('../../services');

class ClientDetailsController {
  async addClient(req, res, next) {
    try {
      await ClientDetailsService.addClient(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async updateClient(req, res, next) {
    try {
      await ClientDetailsService.updateClient(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async getAllClient(req, res, next) {
    try {
      await ClientDetailsService.getAllClient(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }

  async deleteClient(req, res, next) {
    try {
      await ClientDetailsService.deleteClient(req, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Error ' + error });
    }
  }
}

module.exports = new ClientDetailsController();
