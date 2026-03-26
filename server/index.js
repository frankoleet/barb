import http from 'node:http'

const port = Number(process.env.PORT || 8787)
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
const telegramChatId = process.env.TELEGRAM_CHAT_ID

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  })

  response.end(JSON.stringify(payload))
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const buildTelegramMessage = (booking) => {
  const comment = booking.comment?.trim()
    ? escapeHtml(booking.comment.trim())
    : 'гость не оставил комментарий'
  const bookingSlot = `${escapeHtml(booking.time)} ${escapeHtml(booking.dateLabel || booking.date)}`

  return [
    `🔔 Новая заявка на запись в ${bookingSlot}`,
    '',
    `💈 Услуга: ${escapeHtml(booking.serviceName)}`,
    `💲 Цена: ${escapeHtml(String(booking.price ?? '-'))}`,
    '',
    `👤 Имя: ${escapeHtml(booking.name)}`,
    `📞 Телефон: ${escapeHtml(booking.phone)}`,
    '',
    `💬 Комментарий: ${comment}`
  ].join('\n')
}

const readJsonBody = (request) =>
  new Promise((resolve, reject) => {
    let rawBody = ''

    request.on('data', (chunk) => {
      rawBody += chunk

      if (rawBody.length > 1_000_000) {
        reject(new Error('payload_too_large'))
        request.destroy()
      }
    })

    request.on('end', () => {
      try {
        resolve(rawBody ? JSON.parse(rawBody) : {})
      } catch {
        reject(new Error('invalid_json'))
      }
    })

    request.on('error', reject)
  })

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, { ok: true })
    return
  }

  if (request.url !== '/api/telegram-booking' || request.method !== 'POST') {
    sendJson(response, 404, { ok: false, error: 'not_found' })
    return
  }

  if (!telegramBotToken || !telegramChatId) {
    sendJson(response, 500, { ok: false, error: 'telegram_env_missing' })
    return
  }

  try {
    const booking = await readJsonBody(request)

    if (!booking?.serviceName || !booking?.name || !booking?.phone || !booking?.date || !booking?.time) {
      sendJson(response, 400, { ok: false, error: 'validation_failed' })
      return
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: buildTelegramMessage(booking)
      })
    })

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text()
      console.error('Telegram send failed:', telegramError)
      sendJson(response, 502, { ok: false, error: 'telegram_send_failed' })
      return
    }

    sendJson(response, 200, { ok: true })
  } catch (error) {
    console.error('Booking API error:', error)
    sendJson(response, 500, { ok: false, error: 'internal_error' })
  }
})

server.listen(port, () => {
  console.log(`Telegram booking API listening on http://localhost:${port}`)
})
