const tg = window.Telegram?.WebApp;

if (tg) {
  tg.expand();
  tg.ready();
}

const tabs = document.querySelectorAll(".tab");
const autoFields = document.getElementById("autoFields");
const partsFields = document.getElementById("partsFields");
const formTypeInput = document.getElementById("formType");
const form = document.getElementById("leadForm");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const currentTab = tab.dataset.tab;

    if (currentTab === "auto") {
      autoFields.classList.remove("hidden");
      partsFields.classList.add("hidden");
      formTypeInput.value = "Подбор авто";
    } else {
      partsFields.classList.remove("hidden");
      autoFields.classList.add("hidden");
      formTypeInput.value = "Автозапчасти";
    }
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusEl.textContent = "Отправляем заявку...";
  submitBtn.disabled = true;

  const formData = new FormData(form);

  const payload = {
    formType: formData.get("formType") || "",
    name: formData.get("name") || "",
    phone: formData.get("phone") || "",
    brand: formData.get("brand") || "",
    model: formData.get("model") || "",
    yearFrom: formData.get("yearFrom") || "",
    budget: formData.get("budget") || "",
    comment: formData.get("comment") || "",
    partsBrand: formData.get("partsBrand") || "",
    partsModel: formData.get("partsModel") || "",
    vin: formData.get("vin") || "",
    partName: formData.get("partName") || "",
    partsComment: formData.get("partsComment") || "",
    telegramUser: tg?.initDataUnsafe?.user || null
  };

  try {
    const response = await fetch("/.netlify/functions/send-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Ошибка отправки");
    }

    statusEl.textContent = "Заявка успешно отправлена.";
    form.reset();
    formTypeInput.value = document.querySelector(".tab.active").dataset.tab === "auto"
      ? "Подбор авто"
      : "Автозапчасти";

    if (tg?.HapticFeedback?.notificationOccurred) {
      tg.HapticFeedback.notificationOccurred("success");
    }
  } catch (error) {
    statusEl.textContent = "Не удалось отправить заявку. Попробуйте ещё раз.";
    console.error(error);
  } finally {
    submitBtn.disabled = false;
  }
});
