const http = require('http')

function enableCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, content-type, x-client-id, authorization'
  );
}

http.createServer(async (req, res) => {
  console.log(req)
  let buffer = []
  req.on('error', err => {
    console.log(err)
  })
  req.on('data', data => {
    buffer.push(data)
  })
  req.on('close', data => {
    console.log('close')
  })

  await new Promise(resolve => req.on('end', () => {
    console.log('end')
    resolve()
  }))
  let body = Buffer.concat(buffer)
  console.log(body.toString('utf8'))
  const { descriptors } = JSON.parse(Buffer.from(body).toString('ut8'))
  console.log(descriptors)
  const [descriptor] = descriptors
  enableCors(res)
  res.setHeader('content-type', 'application/json')
  res.end(
    JSON.stringify({
      data: {
        created: [
          {
            fileId: descriptor.fileId,
            uploadId: '1234'
          }
        ]
      }
    })
  )
}).listen(3000)