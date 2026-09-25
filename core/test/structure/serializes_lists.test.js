import test from 'ava'
import List from '../../src/structure/list.js'
import Value from '../../src/structure/value.js'

test('empty list', t => {
  const data = new List().serialize()
  t.is(data.toString('hex'), '0203')
})

test('one item', t => {
  const data = new List()
    .add(Value.from('foo'))
    .serialize()
  t.is(data.toString('hex'), '0202666f6f0303')
})

test('multiple items', t => {
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

test('nested lists', t => {
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