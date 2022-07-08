declare global {
  interface Window {
    is_debug: boolean,
  }
}
/* eslint-disable no-console */
export const cl = (msg: unknown, options: Record<string, unknown> = {}) => {
  if (window.is_debug) {
    console.log(`debug: ${msg}`);
    if (options.throw === true) {
      console.log(new Error().stack);
    }
  }
};
