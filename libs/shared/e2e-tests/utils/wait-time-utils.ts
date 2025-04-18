export const waitSeconds = async (seconds: number) => {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
