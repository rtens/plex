import test from 'ava'
import Deserializer from '../../src/structure/deserializer.js'
import List from '../../src/structure/list.js'
import None from '../../src/structure/none.js'

test('empty list', t => {
  const list = new Deserializer()
    .parse(Buffer.from('0203', 'hex'))
  t.deepEqual(list, new None())
})

test('one item', t => {
  const list = new Deserializer()
    .parse(Buffer.from('0202666f6f0303', 'hex'))
  t.deepEqual(list, new None())

  t.deepEqual(list, new List()
    .add(Value.from('foo')))
})

test.skip('multiple items', t => {
  const data = new List()
    .add(Value.from('foo'))
    .add(Value.from('bar'))
    .add(Value.from('baz'))
    .serialize()
  t.is(data.toString('hex'),
    '02' +
    '02666f6f03' +
    '0262617203' +
    '0262617a03' +
    '03')
})

test.skip('nested lists', t => {
  const data = new List()
    .add(new List().add(Value.from('foo')))
    .add(new List().add(new List()))
    .serialize()
  t.is(data.toString('hex'),
    '02' +
    '0202666f6f0303' +
    '02020303' +
    '03')
})