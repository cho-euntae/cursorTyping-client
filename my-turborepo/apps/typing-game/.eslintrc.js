// module.exports = {
//   root: true,
//   extends: ["../../eslint.config.mjs"],
// };
module.exports = {
  root: true,
  extends: ['next', 'prettier'],
  plugins: [],
  settings: {
    next: {
      rootDir: ['apps/*/'], // 앱 경로 지정
    },
  },
};
