export async function waitDelay(timeoutMSec: number) {
  await new Promise(function (r) {
    setTimeout(r, timeoutMSec);
  });
}

export async function waitSeconds(timeoutSec: number) {
  await waitDelay(timeoutSec * 1000);
}
