const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const uuid  = require('uuid/v4')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')

const CLIENT_SESSION_SECRET = 'cat'
const CLIENT_SESSION_ID = uuid()

const sign = (payload) => new Promise((resolve, reject) =>
  jwt.sign(
    payload,
    CLIENT_SESSION_SECRET, {
      expiresIn: '168h',
      audience: CLIENT_SESSION_ID
    },
    (err, token) => {
      if (err) reject(err)
      else resolve({ token })
    }
  )
)

app.use(require('cors')())

app.post('/upload/createWithFiles', bodyParser.json(), (req, res) => {
  const [descriptor] = req.body.descriptors
  res.json({
    data: {
      created: [
        {
          fileId: descriptor.fileId,
          uploadId: '1234'
        }
      ]
    }
  })
})

app.post('/auth', async (req, res) => {
  const payload = {
    sub: randomBytes(10).toString('hex')
  }
  const token = await sign(payload)
  res.json({
    asapIssuer: 'prosemirror-editor',
    token: token,
    baseUrl: 'http://localhost:3000'
  })
})

app.listen(3000)
