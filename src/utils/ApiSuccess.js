const httpStatus = require('http-status');

class SuccessResponse {
  constructor({ message, status = httpStatus.OK, data = {} }) {
    this.message = message;
    this.status = status;
    this.data = data;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class Ok extends SuccessResponse {
  constructor({ message, data = {} }) {
    super({ message, data });
  }
}

class Create extends SuccessResponse {
  constructor({ message, data = {} }) {
    super({ message, status: httpStatus.CREATED, data });
  }
}

const CREATED = ({ res, message = 'success', data }) => {
  new Create({
    message,
    data,
  }).send(res);
};

const OK = ({ res, message = 'success', data }) => {
  new Ok({
    message,
    data,
  }).send(res);
};

module.exports = {
  OK,
  CREATED,
};
