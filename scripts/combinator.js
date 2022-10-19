const combinator = require('js-combinatorics');

const x = {
  a: [1, 2, 3, 4, 5],
  b: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  perms: 'x,y,z,p,q,r'
}
const it = new combinator.CartesianProduct(
  [1, 2, 3, 4, 5],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  ['x,y,z,p,q,r']
);
console.log([...it]);
