const calcRem = (size: number) => `${size / 16}rem`;

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

const theme = { calcRem };

export const mixin = {
  spinner: (
    circleBorder: string,
    topBorderColor: string,
    width: string = '1rem',
    height: string = '1rem'
  ) =>
    `content: '';
    position: absolute;
    width: ${width};
    height: ${height};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: ${circleBorder};
    border-top-color: ${topBorderColor};
    border-radius: 50%;
    animation: button-loading-spinner 1s ease infinite;`,
};

export default theme;
