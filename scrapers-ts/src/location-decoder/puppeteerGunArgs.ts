export const minimal_args = [
  '--disable-web-security',
  '--disable-features=IsolateOrigins,site-per-process',
  '--allow-running-insecure-content',
  '--disable-blink-features=AutomationControlled',
  '--no-sandbox',
  '--mute-audio',
  '--no-zygote',
  '--no-xshm',
  '--window-size=1920,1080',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--enable-webgl',
  '--ignore-certificate-errors',
  '--lang=en-US,en;q=0.9',
  '--password-store=basic',
  '--disable-gpu-sandbox',
  '--disable-software-rasterizer',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-infobars',
  '--disable-breakpad',
  '--disable-canvas-aa',
  '--disable-2d-canvas-clip-aa',
  '--disable-gl-drawing-for-tests',
  '--enable-low-end-device-mode',
  // '--disable-extensions-except=./plugin',
  // '--load-extension=./plugin',
  '--use-gl=egl',
  '--incognito',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--ignore-certificate-errors',
  '--proxy-server="direct://"',
  '--proxy-bypass-list=*',
];
