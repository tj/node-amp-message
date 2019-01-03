
var Message = require('..');

var msg = new Message;

console.log(msg.toBuffer());

msg.push('foo');
msg.push('bar');
msg.push('baz');
console.log(msg.toBuffer());

msg.push({ foo: 'bar' });
console.log(msg.toBuffer());

msg.push(Buffer.from('image data'));
console.log(msg.toBuffer());
