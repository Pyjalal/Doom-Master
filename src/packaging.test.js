import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import viteConfig from '../vite.config.js'

test('desktop build uses stable asset names and a cache-busted entry URL', async () => {
  // Given
  const output = viteConfig.build.rollupOptions.output
  const tauriConfig = JSON.parse(
    await readFile(new URL('../src-tauri/tauri.conf.json', import.meta.url), 'utf8'),
  )

  // When
  const windowUrl = tauriConfig.app.windows[0].url

  // Then
  assert.equal(output.entryFileNames, 'assets/[name].js')
  assert.equal(output.chunkFileNames, 'assets/[name].js')
  assert.equal(output.assetFileNames, 'assets/[name][extname]')
  assert.match(windowUrl, /^index\.html\?desktop-build=/)
})
