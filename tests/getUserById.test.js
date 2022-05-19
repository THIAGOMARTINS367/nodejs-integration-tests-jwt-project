const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const server = require('../src/api/app');

const { expect } = chai;
chai.use(chaiHttp);

describe('Consulta dados de um usuário específico', () => {
  describe('quando o Token não é passado no Header da requisição', () => {
    let response;
    before(async () => {
      response = await chai.request(server).get('/api/users/1');
    });
    it('retorna o status com o código "400 - Not Found"', () => {
      expect(response).to.have.status(400);
    });
    it('retona messagem de erro: Token não encontrado ou informado', () => {
      expect(response.body).to.be.equal(1);
    });
  });

  describe(`quando o Token passado possui um id diferente
    do id passado no parâmetro da requisição`, () => {
      let response;
      before(async () => {
        response = await chai.request(server)
          .set('Authorization', 'token-aqui')
          .get('/api/users/1');
      });
      it('retorna o status com o código "401 - Unauthorized"', () => {
        expect(response).to.have.status(401);
      });
      it('retona messagem de erro: Acesso negado', () => {
        expect(response.body).to.be.equal(1);
      });
    });

  describe('quando o Token passado no Header da requisição é válido', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .set('Authorization', 'token-aqui')
        .get('/api/users/1');
    });
    it('retorna o status com o código "200 - OK"', () => {
      expect(response).to.have.status(200);
    });
    it('retona os dados do usuário que possui o id do parâmetro', () => {
      expect(response.body).to.be.equal(1);
    });
  });
});
