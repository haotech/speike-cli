const test = require('ava')

test.before(() => {
  console.log('test before')
})

test('should xxx', t => {
  t.pass()
})

test.after(t => {
  console.log('test after')
})
