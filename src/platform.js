const APP_CACHE_PREFIX = 'doom-master-'

export async function configureServiceWorker({ isTauri, serviceWorker, cacheStorage }) {
  if (!serviceWorker) return

  if (isTauri) {
    const registrations = await serviceWorker.getRegistrations()
    await Promise.all(registrations.map((registration) => registration.unregister()))

    if (cacheStorage) {
      const keys = await cacheStorage.keys()
      await Promise.all(
        keys
          .filter((key) => key.startsWith(APP_CACHE_PREFIX))
          .map((key) => cacheStorage.delete(key)),
      )
    }
    return
  }

  await serviceWorker.register('/sw.js')
}
