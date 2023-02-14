/**
 *
 * @param {number} ms unit time
 * @param {() => void} callback
 * @returns
 */
export async function delay(time, callback) {
  return new Promise((resolve) => {
    // TODO: clearTimeout은 어디에?
    setTimeout(resolve(callback), time);
  });
}
