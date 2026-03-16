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

        const autoCarModel = String(form.get("autoCarModel") || "—");
        const autoYear = String(form.get("autoYear") || "—");
        const autoMileage = String(form.get("autoMileage") || "—");
        const fuelType = String(form.get("fuelType") || "—");
        const autoRegion = String(form.get("autoRegion") || "—");
        const autoPhone = String(form.get("autoPhone") || "—");
        const budget = String(form.get("budget") || "—");
        const comment = String(form.get("comment") || "—");

        const partsCarModel = String(form.get("partsCarModel") || "—");
        const partsYear = String(form.get("partsYear") || "—");
        const vin = String(form.get("vin") || "—");
        const partName = String(form.get("partName") || "—");
        const article = String(form.get("article") || "—");
        const partsRegion = String(form.get("partsRegion") || "—");
        const partsPhone = String(form.get("partsPhone") || "—");
        const partsComment = String(form.get("partsComment") || "—");

        const photo = form.get("partPhoto");
        const hasPhoto =
          photo &&
          typeof photo === "object" &&
          "size" in photo &&
          photo.size > 0;

        let telegramUserText = "";
        let userReplyChatId = null;

        const telegramUserRaw = form.get("telegramUser");
        if (telegramUserRaw) {
          try {
            const tgUser = JSON.parse(String(telegramUserRaw));
            const fullName =
              [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ") || "—";
            const username = tgUser.username ? `@${tgUser.username}` : "—";
            const userId = tgUser.id ? String(tgUser.id) : null;

            if (userId) {
              userReplyChatId = userId;
            }

            telegramUserText =
              "\n\nTelegram user: " + fullName +
              "\nUsername: " + username +
              "\nUser ID: " + (userId || "—");
          } catch (_) {}
        }

        if (formType === "Автозапчасти") {
          const caption =
            "🔧 Новая заявка на автозапчасти\n\n" +
            "Марка и модель: " + partsCarModel + "\n" +
            "Год выпуска: " + partsYear + "\n" +
            "VIN: " + vin + "\n" +
            "Что нужно: " + partName + "\n" +
            "Артикул: " + article + "\n" +
            "Регион доставки: " + partsRegion + "\n" +
            "Телефон: " + partsPhone + "\n" +
            "Дополнительно: " + partsComment +
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
            "Марка и модель: " + autoCarModel + "\n" +
            "Год выпуска: " + autoYear + "\n" +
            "Пробег: " + autoMileage + "\n" +
            "Топливо: " + fuelType + "\n" +
            "Регион получения: " + autoRegion + "\n" +
            "Телефон: " + autoPhone + "\n" +
            "Бюджет: " + budget + "\n" +
            "Дополнительно: " + comment +
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

        if (userReplyChatId) {
          const replyText =
            "Спасибо, ваша заявка получена.\n" +
            "Я уже получил ваш запрос и свяжусь с вами в ближайшее время.\n\n" +
            "Если вопрос срочный, можете написать мне напрямую: @nee_gm";

          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: userReplyChatId,
              text: replyText
            })
          });
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
