exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "ENV_NOT_FOUND" }),
      };
    }

    let text = "";

    if (data.formType === "Автозапчасти") {
      text =
        "🔧 Новая заявка на автозапчасти\n\n" +
        "Имя: " + String(data.name || "—") + "\n" +
        "Контакт: " + String(data.phone || "—") + "\n" +
        "Марка: " + String(data.partsBrand || "—") + "\n" +
        "Модель: " + String(data.partsModel || "—") + "\n" +
        "Год: " + String(data.partsYear || "—") + "\n" +
        "VIN: " + String(data.vin || "—") + "\n" +
        "Деталь: " + String(data.partName || "—") + "\n" +
        "Артикул: " + String(data.article || "—") + "\n" +
        "Комментарий: " + String(data.partsComment || "—");
    } else {
      text =
        "🚘 Новая заявка на подбор авто\n\n" +
        "Имя: " + String(data.name || "—") + "\n" +
        "Контакт: " + String(data.phone || "—") + "\n" +
        "Марка: " + String(data.brand || "—") + "\n" +
        "Модель: " + String(data.model || "—") + "\n" +
        "Год от: " + String(data.yearFrom || "—") + "\n" +
        "Бюджет: " + String(data.budget || "—") + "\n" +
        "Объём двигателя: " + String(data.engineVolume || "—") + "\n" +
        "Пробег до: " + String(data.mileage || "—") + "\n" +
        "Пожелания: " + String(data.comment || "—");
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: String(chatId),
          text: text,
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: telegramResult.description || "TELEGRAM_SEND_ERROR",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e.message || "SERVER_ERROR",
      }),
    };
  }
};
