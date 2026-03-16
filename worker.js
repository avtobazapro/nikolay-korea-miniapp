export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/send-lead") {
      try {
        const data = await request.json();

        const botToken = env.TELEGRAM_BOT_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
          return Response.json(
            { error: "ENV_NOT_FOUND" },
            { status: 500 }
          );
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: String(chatId),
              text
            })
          }
        );

        const telegramResult = await telegramResponse.json();

        if (!telegramResponse.ok || !telegramResult.ok) {
          return Response.json(
            { error: telegramResult.description || "TELEGRAM_SEND_ERROR" },
            { status: 500 }
          );
        }

        return Response.json({ ok: true });
      } catch (e) {
        return Response.json(
          { error: e.message || "SERVER_ERROR" },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
