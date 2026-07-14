import assert from 'node:assert/strict'
import test from 'node:test'

import { configureServiceWorker } from './platform.js'

test('configureServiceWorker removes stale web caches inside Tauri', async () => {
  // Given
  const removed = []
  const deleted = []
  const serviceWorker = {
    getRegistrations: async () => [
      { unregister: async () => removed.push('old-worker') },
    ],
  }
  const cacheStorage = {
    keys: async () => ['doom-master-v1', 'unrelated-cache'],
    delete: async (key) => deleted.push(key),
  }

  // When
  await configureServiceWorker({ isTauri: true, serviceWorker, cacheStorage })

  // Then
  assert.deepEqual(removed, ['old-worker'])
  assert.deepEqual(deleted, ['doom-master-v1'])
})

test('configureServiceWorker registers offline support in a browser', async () => {
  // Given
  const registered = []
  const serviceWorker = {
    register: async (path) => registered.push(path),
  }

  // When
  await configureServiceWorker({ isTauri: false, serviceWorker })

  // Then
  assert.deepEqual(registered, ['/sw.js'])
})
