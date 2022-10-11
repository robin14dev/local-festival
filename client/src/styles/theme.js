const calcRem = (size) => `${size / 16}rem`;

// const fontSize = {
//   xsmall: calcRem(14),
//   small: calcRem(16),
//   base: calcRem(18),
//   large: calcRem(20),
//   xlarge: calcRem(22),
//   xxlarge: calcRem(24),
//   subtitle: calcRem(30),
//   title: calcRem(58),
//   clock: calcRem(110),
// };

// const space = {
//   xsmall: calcRem(8),
//   small: calcRem(10),
//   base: calcRem(12),
//   large: calcRem(16),
//   xlarge: calcRem(18),
//   xxlarge: calcRem(20),
// };

const color = {
  primaryBlue: 'rgb(64 82 255)',
  primaryGreen: '#60ff53',
  autumnOrange: '#FF9A62',
};

const usingColor = {
  mainColor: color['autumnOrange'],
};

const theme = { color, usingColor };

export default theme;
