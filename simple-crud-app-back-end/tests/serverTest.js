var chaiHttp = require('chai-http');
var chai     = require('chai');
var expect   = chai.expect;
var should   = chai.should();
var server   = require('../server.js');

chai.use(chaiHttp);

describe('API Integration Test', (done) => {
  it('responds to /contacts', (done) => {
    chai.request(server.callback())
      .get('/contacts')
      .end(function(err, res){
        expect(res.status).to.eq(200);
        res.should.be.json;
        res.body.contacts.should.be.a('array');
        done();
    });
  });

  it('responds to /contact/:id', (done) => {
    const contact = {
      firstName: "John",
      lastName:  "Stewart",
      company:   "IBM",
      address:   "123 Somewhere Cool Road"
    };
    chai.request(server.callback())
      .post('/contacts')
      .send(contact)
      .end(function(err, res){
        res.should.have.status(200);
        res.body.contacts.should.be.a('object');
        expect(res.body.contacts).to.have.property('firstName', 'John');
        expect(res.body.contacts).to.have.property('lastName',  'Stewart');
        expect(res.body.contacts).to.have.property('company',   'IBM');
        done();
    });
  });
});
