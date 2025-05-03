const { GAE_INSTANCE, K_SERVICE } = process.env

export function isGAE(): boolean {
  return !!GAE_INSTANCE
}

export function isCloudRun(): boolean {
  return !!K_SERVICE
}
