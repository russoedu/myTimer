const Phone = require('../src/views/Phone');
const sinon = require('sinon');
const expect = require('chai').expect;
const env = require('dotenv').config();
const request = require('request');

const message = 'message';
const token = 'token';
let req;
let tkn;

describe('Phone', () => {
  before(() => {
    req = sinon.stub(request, 'post');
    tkn = process.env.PUSH_ME_TOKEN;
  });
  beforeEach(() => {
    delete process.env.PUSH_ME_TOKEN;
  });
  after(() => {
    request.post.restore();
    process.env.PUSH_ME_TOKEN = tkn;
  });

  describe('display(message, token)', () => {
    it('should call request.post', () => {
      Phone.display(message, token);

      sinon.assert.calledOnce(req);
    });
    it('should fill the request object correctly', () => {
      Phone.display(message, token);
      const body = `token=${token}&title=${message}`;
      const expectedObj = {
        headers: {
          'Content-Length': body.length,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        uri: 'https://pushmeapi.jagcesar.se',
        body,
      };

      sinon.assert.calledWith(req, expectedObj);
    });
    it('should replace the ordinal on the message', () => {
      Phone.display('$3$ message', token);
      const body = `token=${token}&title=3rd%20message`;
      const expectedObj = {
        headers: {
          'Content-Length': body.length,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        uri: 'https://pushmeapi.jagcesar.se',
        body,
      };

      sinon.assert.calledWith(req, expectedObj);
    });
    it('should use .env token if no token is sent', () => {
      process.env.PUSH_ME_TOKEN = token;
      Phone.display(message);
      const body = `token=${token}&title=${message}`;
      const expectedObj = {
        headers: {
          'Content-Length': body.length,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        uri: 'https://pushmeapi.jagcesar.se',
        body,
      };

      sinon.assert.calledWith(req, expectedObj);
    });
    it('should throw error if no token is set', () => {
      const errorThrow = () => {
        throw Phone.display(message);
      };

      expect(errorThrow).to.throw('Token is not defined');
    });
  });
});
