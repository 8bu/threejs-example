import { defineConfig } from "windicss/helpers";

export default defineConfig({
  /* configurations... */
  extract: {
    include: ["src/**/*.{vue,ts}"],
  },
});
