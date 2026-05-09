import http from 'http';

const check = (path, body) =>
  new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 8081,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });

(async () => {
  const tests = [
    ['/api/v1/chat', { message: 'hello there' }],
    ['/api/v1/ingest', { data: { foo: 'bar' } }],
  ];

  for (const [path, body] of tests) {
    const result = await check(path, body);
    console.log(path, result.status, result.body);
  }
})();
