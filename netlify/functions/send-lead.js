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
        "Имя: " + (data.name || "—") + "\n" +
        "Контакт: " + (data.phone || "—") + "\n" +
        "Марка: " + (data.partsBrand || "—") + "\n" +
        "Модель: " + (data.partsModel || "—") + "\n" +
        "Год: " + (data.partsYear || "—") + "\n" +
        "VIN: " + (data.vin || "—") + "\n" +
        "Деталь: " + (data.partName || "—") + "\n" +
        "Артикул: " + (data.article || "—") + "\n" +
        "Комментарий: " + (data.partsComment || "—");
    } else {
      text =
        "🚘 Новая заявка на подбор авто\n\n" +
        "Имя: " + (data.name || "—") + "\n" +
        "Контакт: " + (data.phone || "—") + "\n" +
        "Марка: " + (data.brand || "—") + "\n" +
        "Модель: " + (data.model || "—") + "\n" +
        "Год от: " + (data.yearFrom || "—") + "\n" +
        "Бюджет: " + (data.budget || "—") + "\n" +
        "Объём двигателя: " + (data.engineVolume || "—") + "\n" +
        "Пробег до: " + (data.mileage || "—") + "\n" +
        "Пожелания: " + (data.comment || "—");
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
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
