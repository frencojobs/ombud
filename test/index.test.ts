import thanosSort from '../src/index'

test("the avengers failed (at least iron man don't die :3)", () => {
  expect(thanosSort([0, 1]).length).toBe(1)
})
