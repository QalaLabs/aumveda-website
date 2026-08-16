# Self-hosting the Draco decoder (optional)

By default `AssetManager` uses drei's built-in Draco decoder CDN
(`https://www.gstatic.com/draco/versioned/decoders/...`) — Draco-compressed
GLBs work with zero setup here.

To self-host instead (offline builds, dropping the CDN dependency):

1. Copy `draco_decoder.js`, `draco_decoder.wasm`, and `draco_wasm_wrapper.js`
   from `three/examples/jsm/libs/draco/` (or the official
   [Draco releases](https://github.com/google/draco)) into this folder.
2. Set `NEXT_PUBLIC_DRACO_DECODER_PATH=/draco/` in the web app's env.

`AssetManager` reads that env var and passes it straight to
`useGLTF`/`useGLTF.preload`; leave it unset to keep using the CDN default.
