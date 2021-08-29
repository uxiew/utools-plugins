module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  // 好像没用~
  plugins: [
    [
      'prismjs',
      {
        languages: ['typescript', 'jsx', 'css', 'bash', 'json']
        // plugins: ['line-numbers']
        // theme: 'twilight',
        // css: true
      }
    ]
  ]
};
