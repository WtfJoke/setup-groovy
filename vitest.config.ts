import { defineConfig } from "vitest/config";

const exclude = [
  "**/node_modules/**",
  "**/dist/**",
  "**/lib/**",
  "**/.{idea,git,cache,output,temp}/**",
  "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
];

export default defineConfig({
  test: {
    globals: true,
    exclude,
    coverage: {
      exclude,
    },
  },
});
