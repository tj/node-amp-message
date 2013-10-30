
var Message = require('..');

// mixed message

var msg = new Message;

msg.push('foo')
msg.push({ foo: 'bar' })
msg.push(new Buffer('something'))

// buffer message

var bufmsg = new Message;

bufmsg.push(new Buffer('foo'))
bufmsg.push(new Buffer('bar'))
bufmsg.push(new Buffer('baz'))

// string message

var strmsg = new Message;

strmsg.push('foo')
strmsg.push('bar')
strmsg.push('baz')

// buffer

var bin = msg.toBuffer();

suite('Message', function(){
  bench('decode', function(){
    new Message(bin);
  })

  bench('encode', function(){
    msg.toBuffer();
  })

  bench('encode strings', function(){
    strmsg.toBuffer();
  })

  bench('encode buffers', function(){
    bufmsg.toBuffer();
  })
})
