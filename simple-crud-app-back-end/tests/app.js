var chaiHttp = require('chai-http');
var chai     = require('chai');
var should   = chai.should();
var server   = require('../server.js');

chai.use(chaiHttp);

describe('API Integration Test', (done) => {
  it('responds to /contacts', (done) => {
    chai.request(server.callback())
      .get('/contacts')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
    });
  });

  it('responds to /contact/:id', (done) => {
    chai.request(server.callback())
      .put('/contact/1')
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.n.should.equal(1);
        res.body.nModified.should.equal(1);
        res.body.ok.should.equal(1);
        done();
    });
  });
});
