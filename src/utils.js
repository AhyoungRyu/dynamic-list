/**
 *
 * @param {number} ms unit time
 * @param {() => void} callback
 * @returns
 */
export async function delay(time, callback) {
  return new Promise((resolve) => {
    setTimeout(resolve(callback), time);
  });
}
