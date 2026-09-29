import test from 'ava'
import Parser from '../../src/structure/parser.js'
import List from '../../src/structure/list.js'
import None from '../../src/structure/none.js'
import Value from '../../src/structure/value.js'

test('empty list', t => {
  const parser = new Parser()
    .parse(Buffer.from('0203', 'hex'))
  t.deepEqual(parser.parsed(), new None())
})

test('none item', t => {
  const parser = new Parser()
    .parse(Buffer.from('02020303', 'hex'))

  t.deepEqual(parser.parsed(), new List()
    .add(new None()))
})

test('some item', t => {
  const parser = new Parser()
    .parse(Buffer.from('0202666f6f0303', 'hex'))

  t.deepEqual(parser.parsed(), new List()
    .add(Value.from('foo')))
})

test('multiple items', t => {
  const parser = new Parser()
    .parse(Buffer.from(
      '02' +
      '02666f6f03' +
      '0262617203' +
      '0262617a03' +
      '03', 'hex'))

  t.deepEqual(parser.parsed(), new List()
    .add(Value.from('foo'))
    .add(Value.from('bar'))
    .add(Value.from('baz')))
})

test('nested lists', t => {
  const parser = new Parser()
    .parse(Buffer.from(
      '02' +
      '02' + '02666f6f03' + '03' +
      '02' + '0203' + '03' +
      '03', 'hex'))

  t.deepEqual(parser.parsed(), new List()
    .add(new List().add(Value.from('foo')))
    .add(new List().add(new None())))
})

test('expected start', t => {
  const data = Buffer.from(
    '02' +
    '02666f6f03' +
    '2a' +
    '03', 'hex')

  t.throws(() => new Parser().parse(data), {
    message: 'Error at 6: Expected 2, got 42'
  })
})