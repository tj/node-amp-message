
var Message = require('..');

var msg = new Message(['foo', { foo: 'bar' }, new Buffer('foo')]);

msg = new Message(msg.toBuffer());

console.log(msg.shift());
console.log(msg.shift());
console.log(msg.shift());