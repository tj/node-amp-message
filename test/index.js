
var assert = require('assert');

var Message = require('..');

describe('Message()', function(){
  it('should be an empty message', function(){
    var msg = new Message;
    msg.toBuffer().should.have.length(1);
  })
})

describe('Message(args)', function(){
  it('should add arguments', function(){
    var msg = new Message(['foo', 'bar', 'baz']);
    msg.toBuffer().should.have.length(28);
  })
})

describe('Message(buffer)', function(){
  it('should decode the message', function(){
    var msg = new Message;

    msg.push('foo');
    msg.push({ foo: 'bar' });
    msg.push(new Buffer('bar'));

    msg = new Message(msg.toBuffer());

    msg.args[0].should.equal('foo')
    msg.args[1].should.eql({ foo: 'bar' })
    msg.args[2].constructor.name.should.equal('Buffer')
    msg.args[2].toString().should.equal('bar')
  })

  it('should handle undefined', function() {
    var msg = new Message;

    msg.push(undefined);
    msg = new Message(msg.toBuffer());

    assert(1 == msg.args.length);
    assert(null === msg.args[0]);
  })
})
