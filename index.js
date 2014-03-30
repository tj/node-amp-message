
/**
 * Module dependencies.
 */

var fmt = require('util').format;
var amp = require('amp');

/**
 * Proxy methods.
 */

var methods = [
  'push',
  'pop',
  'shift',
  'unshift'
];

/**
 * Expose `Message`.
 */

module.exports = Message;

/**
 * Initialize an AMP message with the
 * given `args` or message buffer.
 *
 * @param {Array|Buffer} args or blob
 * @api public
 */

function Message(args) {
  if (Buffer.isBuffer(args)) args = decode(args);
  this.args = args || [];
}

// proxy methods

methods.forEach(function(method){
  Message.prototype[method] = function(){
    return this.args[method].apply(this.args, arguments);
  };
});

/**
 * Inspect the message.
 *
 * @return {String}
 * @api public
 */

Message.prototype.inspect = function(){
  return fmt('<Message args=%d size=%d>',
    this.args.length,
    this.toBuffer().length);
};

/**
 * Return an encoded AMP message.
 *
 * @return {Buffer}
 * @api public
 */

Message.prototype.toBuffer = function(){
  return encode(this.args);
};

/**
 * AMP Protocol version.
 */

var version = 1;

/**
 * Decode `msg` and unpack all args.
 *
 * @param {Buffer} msg
 * @return {Array}
 * @api private
 */

function decode(msg) {
  var args = amp.decode(msg);

  for (var i = 0; i < args.length; i++) {
    args[i] = unpack(args[i]);
  }

  return args;
}

/**
 * Encode and pack all `args`.
 *
 * @param {Array} args
 * @return {Buffer}
 * @api private
 */

function encode(args) {
  var types = new Array(args);
  var sizes = new Array(args);
  var argc = args.length, copied = false;
  var len = 1 + args.length * 6;
  var off = 1;

  // data length
  for (var i = argc - 1; i >= 0; i--) {
    var arg = args[i];

    // blob
    if (Buffer.isBuffer(arg)) {
      types[i] = 0;
      len += (sizes[i] = arg.length);
      continue;
    }

    // string
    if (typeof arg === 'string') {
      types[i] = 2;
      len += (sizes[i] = Buffer.byteLength(arg));
      continue;
    }

    if (!copied) {
      copied = true;
      // gotta copy for the stringify :(
      args = args.slice();
    }

    // undefined
    if (arg === undefined) arg = null;

    // json
    types[i] = 1;
    len += (sizes[i] = (args[i] = JSON.stringify(arg)).length);
  }

  // buffer
  var buf = new Buffer(len);

  // pack meta
  buf[0] = version << 4 | argc;

  // pack args
  for (i = 0; i < argc; i++) {
    var type = types[i], size = sizes[i], arg = args[i];

    buf.writeUInt32BE(size + 2, off);
    off += 4;

    if (type === 0) {
      // blob
      buf[off++] = 98;
      buf[off++] = 58;
      arg.copy(buf, off);
    } else {
      // string or json
      buf[off++] = 97 + type * 9; // s or j
      buf[off++] = 58;
      buf.write(arg, off);
    }

    off += size;
  }

  return buf;
}

/**
 * Unpack `arg`.
 *
 * @param {Buffer} arg
 * @return {Mixed}
 * @api private
 */

function unpack(arg) {
  // json
  if (isJSON(arg)) return JSON.parse(arg.slice(2));

  // string
  if (isString(arg)) return arg.slice(2).toString();

  // blob
  return arg;
}

/**
 * String argument.
 */

function isString(arg) {
  return 115 == arg[0] && 58 == arg[1];
}

/**
 * JSON argument.
 */

function isJSON(arg) {
  return 106 == arg[0] && 58 == arg[1];
}
