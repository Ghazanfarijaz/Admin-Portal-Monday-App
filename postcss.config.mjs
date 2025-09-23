import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export const plugins = [require("tailwindcss"), require("autoprefixer")];
