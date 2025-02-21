import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  optimizeDeps: {
    include: [
      "react-datepicker",
      "swiper/react",
      "swiper/css",
      "swiper/css/navigation",
      "swiper/css/pagination",
    ],
  },
  resolve: {
    dedupe: ["swiper"],
  },
});
