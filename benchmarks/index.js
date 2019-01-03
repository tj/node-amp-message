
var Message = require('..');

// mixed message

var msg = new Message;

msg.push('foo')
msg.push({ foo: 'bar' })
msg.push(Buffer.from('something'))

// buffer message

var bufmsg = new Message;

bufmsg.push(Buffer.from('foo'))
bufmsg.push(Buffer.from('bar'))
bufmsg.push(Buffer.from('baz'))

// string message

var strmsg = new Message;

strmsg.push('foo')
strmsg.push('bar')
strmsg.push('baz')

// buffer

var bin = msg.toBuffer();
var bufbin = bufmsg.toBuffer();
var strbin = strmsg.toBuffer();

suite('Message', function(){
  bench('decode mixed', function(){
    new Message(bin);
  })

  bench('decode strings', function(){
    new Message(strbin);
  })

  bench('decode buffers', function(){
    new Message(bufbin);
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
