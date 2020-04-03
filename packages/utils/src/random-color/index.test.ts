import randomColor from '.';

test('randomColor', () => {
  expect(randomColor().toString()).toContain('rgb(');
});
