const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = parseInt(process.env.PORT || '8080', 10)

const app = next({ dev, hostname, port, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  server.listen(port, hostname, () => {
    console.log(`> Aumveda ready on http://${hostname}:${port} [${dev ? 'development' : 'production'}]`)
  })

  // Graceful shutdown handling for Cloud Run container lifecycle
  const handleShutdown = (signal) => {
    console.log(`Received ${signal}, closing HTTP server gracefully...`)
    server.close(() => {
      console.log('HTTP server closed cleanly.')
      process.exit(0)
    })
    // Force shutdown after 10s if connections fail to close
    setTimeout(() => {
      console.error('Forced shutdown due to timeout.')
      process.exit(1)
    }, 10000)
  }

  process.on('SIGTERM', () => handleShutdown('SIGTERM'))
  process.on('SIGINT', () => handleShutdown('SIGINT'))
})
