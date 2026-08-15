import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

// Dev-only endpoint: POST /__capture {name, data(base64)} -> .captures/<name>.jpg
// Used by the headless verification harness; not part of the production build.
function captureEndpoint() {
  return {
    name: 'capture-endpoint',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__capture', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('method not allowed')
        }
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', () => {
          try {
            const { name, data, dir: reqDir, ext } = JSON.parse(body)
            const safe = String(name).replace(/[^a-z0-9-_]/gi, '_')
            const allowedDirs = { captures: '.captures', 'days33': 'public/projects/33-days', images: 'public/images' }
            const dir = join(server.config.root, allowedDirs[reqDir] || '.captures')
            const safeExt = ext === 'png' ? '.png' : '.jpg'
            mkdirSync(dir, { recursive: true })
            writeFileSync(join(dir, safe + safeExt), Buffer.from(data, 'base64'))
            res.end('ok:' + safe)
          } catch (e) {
            res.statusCode = 400
            res.end('bad request: ' + e.message)
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), captureEndpoint()],
})
