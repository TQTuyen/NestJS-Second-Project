import { swcDefaultsFactory } from '@nestjs/cli/lib/compiler/defaults/swc-defaults';

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: swcDefaultsFactory().swcOptions,
        },
      },
    ],
  },
};
