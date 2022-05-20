const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const server = require('../src/api/app');
// const validateJWT = require('../src/api/auth/validateJWT');
const { User } = require('../src/models');

const { expect } = chai;
chai.use(chaiHttp);

describe('Consulta dados de um usuário específico', () => {
  describe('quando o Token não é passado no Header da requisição', () => {
    let response;
    before(async () => {
      sinon.stub(User, 'findByPk').resolves();
      sinon.stub(User, 'findOne').resolves();
      response = await chai.request(server).get('/api/users/1');
    });
    after(() => {
      User.findByPk.restore();
      User.findOne.restore();
    });
    it('retorna o status com o código "401 - Não autorizado"', () => {
      expect(response).to.have.status(401);
    });
    it('retona um objeto que possui a propriedade "error"', () => {
      expect(response.body).to.a.property('error');
    });
    it('tal propriedade possui a mensagem "Token não encontrado"', () => {
      expect(response.body.error).to.be.equal('Token não encontrado');
    });
  });

  describe(`quando o Token passado possui um id diferente
    do id passado no parâmetro da requisição`, () => {
      let response;
      let tokenLogin;
      const user = {
        username: 'carlos',
        password: '12345678',
      };
      const userSent = { ...user }
      before(async () => {
        sinon.stub(User, 'findByPk').resolves();
        sinon.stub(User, 'findOne').resolves({
          id: 2,
          ...userSent,
        });
        tokenLogin = await chai.request(server)
          .post('/api/login').send(userSent);
        const { token } = tokenLogin.body;
        response = await chai.request(server)
          .get('/api/users/1')
          .set('Authorization', token);
      });
      after(() => {
        User.findByPk.restore();
        User.findOne.restore();
      });
      it('retorna o status com o código "401 - Unauthorized"', () => {
        expect(response).to.have.status(401);
      });
      it('retona um objeto que possui a propriedade "message"', () => {
        expect(response.body).to.a.property('message');
      });
      it('tal propriedade possui a mensagem "Acesso negado"', () => {
        expect(response.body.message).to.be.equal('Acesso negado');
      });
    });

  describe('quando o Token passado no Header da requisição é válido', () => {
    let response;
    let tokenLogin;
      const user = {
        username: 'carlos',
        password: '12345678',
      };
      const userSent = { ...user }
      before(async () => {
        sinon.stub(User, 'findByPk').resolves({
          id: 2,
          ...userSent,
        });
        sinon.stub(User, 'findOne').resolves({
          id: 2,
          ...userSent,
        });
        tokenLogin = await chai.request(server)
          .post('/api/login').send(userSent);
        const { token } = tokenLogin.body;
        response = await chai.request(server)
          .get('/api/users/2')
          .set('Authorization', token);
      });
      after(() => {
        User.findByPk.restore();
        User.findOne.restore();
      });
    it('retorna o status com o código "200 - OK"', () => {
      expect(response).to.have.status(200);
    });
    it('retona um objeto que possui as propriedades "id", "username" e "password"', () => {
      expect(response.body).to.a.property('id');
      expect(response.body).to.a.property('username');
      expect(response.body).to.a.property('password');
    });
    it('tais propriedades possuem os valores corretos', () => {
      expect(response.body.id).to.be.equal(2);
      expect(response.body.username).to.be.equal(user.username);
      expect(response.body.password).to.be.equal(user.password);
    });
  });
});
