module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    [
      '@babel/preset-typescript',
      { "onlyRemoveTypeImports": true }
    ]
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@config':'./src/config',
        '@controllers':'./src/controllers',
        '@helpers':'./src/helpers',
        '@middlewares': './src/middlewares',
        '@interfaces': './src/interfaces',
        '@models':'./src/models',
        '@repositories':'./src/repositories',
        '@services':'./src/services',
        '@utils':'./src/utils'
      }
    }],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "babel-plugin-parameter-decorator",
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
