exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Не заданы переменные окружения" })
      };
    }

    const user = data.telegramUser || {};
    const username = user.username ? `@${user.username}` : "—";
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "—";
    const userId = user.id || "—";

    let text = "";

    if (data.formType === "Автозапчасти") {
      text =
`<b>Новая заявка с Mini App</b>

<b>Тип:</b> Автозапчасти
<b>Имя:</b> ${escapeHtml(data.name || "—")}
<b>Контакт:</b> ${escapeHtml(data.phone || "—")}

<b>Марка:</b> ${escapeHtml(data.partsBrand || "—")}
<b>Модель:</b> ${escapeHtml(data.partsModel || "—")}
<b>VIN:</b> ${escapeHtml(data.vin || "—")}
<b>Деталь:</b> ${escapeHtml(data.partName || "—")}
<b>Комментарий:</b> ${escapeHtml(data.partsComment || "—")}

<b>Telegram user:</b> ${escapeHtml(fullName)}
<b>Username:</b> ${escapeHtml(username)}
<b>User ID:</b> ${escapeHtml(String(userId))}`;
    } else {
      text =
`<b>Новая заявка с Mini App</b>

<b>Тип:</b> Подбор авто
<b>Имя:</b> ${escapeHtml(data.name || "—")}
<b>Контакт:</b> ${escapeHtml(data.phone || "—")}

<b>Марка:</b> ${escapeHtml(data.brand || "—")}
<b>Модель:</b> ${escapeHtml(data.model || "—")}
<b>Год от:</b> ${escapeHtml(data.yearFrom || "—")}
<b>Бюджет:</b> ${escapeHtml(data.budget || "—")}
<b>Пожелания:</b> ${escapeHtml(data.comment || "—")}

<b>Telegram user:</b> ${escapeHtml(fullName)}
<b>Username:</b> ${escapeHtml(username)}
<b>User ID:</b> ${escapeHtml(String(userId))}`;
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML"
      })
    });

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: telegramResult.description || "Ошибка отправки в Telegram"
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Server error" })
    };
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
