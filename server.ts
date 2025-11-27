import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import compression from 'compression';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();

  // Habilitar compresión gzip
  server.use(compression());

  // Rutas correctas basadas en la estructura real del build
  const distRoot = resolve(process.cwd(), 'dist/renta-raiz-frontend-2');

  // Carpeta donde están los JS/CSS/Assets del navegador
  const browserDistFolder = join(distRoot, 'browser');

  // Carpeta donde está el código SSR
  const serverDistFolder = join(distRoot, 'server');

  // Archivo principal SSR
  const indexHtml = join(serverDistFolder, 'index.server.html');

  // Logs para verificar dentro del contenedor
  console.log("📁 Server Dist:", serverDistFolder);
  console.log("📁 Browser Dist:", browserDistFolder);
  console.log("📄 indexHtml:", indexHtml);

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Cache de HTML renderizado en memoria
  const pageCache = new Map<string, string>();



  // Rutas que empiezan con /prioritarios deben servir el index SSR igual
  server.get('/prioritarios*', async (req, res, next) => {
    try {
      const url = req.originalUrl;

      // cache
      if (pageCache.has(url)) {
        res.send(pageCache.get(url));
        return;
      }

      const html = await commonEngine.render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: '/prioritarios' }],
      });

      pageCache.set(url, html);

      res.send(html);
      return;

    } catch (err) {
      next(err);
      return;
    }
  });



  // Servir archivos estáticos con cache largo
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y',
    etag: false
  }));

  // Todas las demás rutas usan Angular SSR
  server.get('*', async (req, res, next) => {
    try {
      const { protocol, originalUrl, baseUrl, headers } = req;
      const url = originalUrl;

      // Devolver HTML de cache si existe
      if (pageCache.has(url)) {
        return res.send(pageCache.get(url));
      }

      const html = await commonEngine.render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      });

      // Guardar en cache
      pageCache.set(url, html);

      res.send(html);
      return;
    } catch (err) {
      next(err);
      return;
    }
  });

  return server;
}

function run(): void {
  const port = 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
