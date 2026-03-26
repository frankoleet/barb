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

export default async function handler(request, response) {
  if (request.method === 'OPTIONS') {
    response.status(204).end()
    return
  }

  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, error: 'method_not_allowed' })
    return
  }

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID

  if (!telegramBotToken || !telegramChatId) {
    response.status(500).json({ ok: false, error: 'telegram_env_missing' })
    return
  }

  const booking = request.body ?? {}

  if (!booking?.serviceName || !booking?.name || !booking?.phone || !booking?.date || !booking?.time) {
    response.status(400).json({ ok: false, error: 'validation_failed' })
    return
  }

  try {
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
      response.status(502).json({ ok: false, error: 'telegram_send_failed' })
      return
    }

    response.status(200).json({ ok: true })
  } catch (error) {
    console.error('Booking API error:', error)
    response.status(500).json({ ok: false, error: 'internal_error' })
  }
}
