export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/send-lead") {
      try {
        const form = await request.formData();

        const botToken = env.TELEGRAM_BOT_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
          return Response.json({ error: "ENV_NOT_FOUND" }, { status: 500 });
        }

        const formType = String(form.get("formType") || "");
        const name = String(form.get("name") || "—");
        const phone = String(form.get("phone") || "—");

        const brand = String(form.get("brand") || "—");
        const model = String(form.get("model") || "—");
        const yearFrom = String(form.get("yearFrom") || "—");
        const budget = String(form.get("budget") || "—");
        const engineVolume = String(form.get("engineVolume") || "—");
        const mileage = String(form.get("mileage") || "—");
        const comment = String(form.get("comment") || "—");

        const partsBrand = String(form.get("partsBrand") || "—");
        const partsModel = String(form.get("partsModel") || "—");
        const partsYear = String(form.get("partsYear") || "—");
        const vin = String(form.get("vin") || "—");
        const partName = String(form.get("partName") || "—");
        const article = String(form.get("article") || "—");
        const partsComment = String(form.get("partsComment") || "—");

        const photo = form.get("partPhoto");
        const hasPhoto =
          photo &&
          typeof photo === "object" &&
          "size" in photo &&
          photo.size > 0;

        let telegramUserText = "";
        const telegramUserRaw = form.get("telegramUser");

        if (telegramUserRaw) {
          try {
            const tgUser = JSON.parse(String(telegramUserRaw));
            const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ") || "—";
            const username = tgUser.username ? `@${tgUser.username}` : "—";
            const userId = tgUser.id || "—";

            telegramUserText =
              "\n\nTelegram user: " + fullName +
              "\nUsername: " + username +
              "\nUser ID: " + userId;
          } catch (_) {}
        }

        if (formType === "Автозапчасти") {
          const caption =
            "🔧 Новая заявка на автозапчасти\n\n" +
            "Имя: " + name + "\n" +
            "Контакт: " + phone + "\n" +
            "Марка: " + partsBrand + "\n" +
            "Модель: " + partsModel + "\n" +
            "Год: " + partsYear + "\n" +
            "VIN: " + vin + "\n" +
            "Деталь: " + partName + "\n" +
            "Артикул: " + article + "\n" +
            "Комментарий: " + partsComment +
            telegramUserText;

          if (hasPhoto) {
            const telegramForm = new FormData();
            telegramForm.append("chat_id", String(chatId));
            telegramForm.append("caption", caption);
            telegramForm.append("photo", photo, photo.name || "part-photo.jpg");

            const telegramResponse = await fetch(
              `https://api.telegram.org/bot${botToken}/sendPhoto`,
              {
                method: "POST",
                body: telegramForm
              }
            );

            const telegramResult = await telegramResponse.json();

            if (!telegramResponse.ok || !telegramResult.ok) {
              return Response.json(
                { error: telegramResult.description || "TELEGRAM_SEND_PHOTO_ERROR" },
                { status: 500 }
              );
            }
          } else {
            const telegramResponse = await fetch(
              `https://api.telegram.org/bot${botToken}/sendMessage`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: String(chatId),
                  text: caption
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
          }
        } else {
          const text =
            "🚘 Новая заявка на подбор авто\n\n" +
            "Имя: " + name + "\n" +
            "Контакт: " + phone + "\n" +
            "Марка: " + brand + "\n" +
            "Модель: " + model + "\n" +
            "Год от: " + yearFrom + "\n" +
            "Бюджет: " + budget + "\n" +
            "Объём двигателя: " + engineVolume + "\n" +
            "Пробег до: " + mileage + "\n" +
            "Пожелания: " + comment +
            telegramUserText;

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
