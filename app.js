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

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.className = "status";
  if (type) statusEl.classList.add(type);
}

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

    setStatus("");
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  setStatus("Отправляем заявку...");
  submitBtn.disabled = true;

  const formData = new FormData(form);

  const payload = {
    formType: formData.get("formType") || "",
    name: formData.get("name") || "",
    phone: formData.get("phone") || "",

    // Авто
    brand: formData.get("brand") || "",
    model: formData.get("model") || "",
    yearFrom: formData.get("yearFrom") || "",
    budget: formData.get("budget") || "",
    engineVolume: formData.get("engineVolume") || "",
    mileage: formData.get("mileage") || "",
    comment: formData.get("comment") || "",

    // Запчасти
    partsBrand: formData.get("partsBrand") || "",
    partsModel: formData.get("partsModel") || "",
    partsYear: formData.get("partsYear") || "",
    vin: formData.get("vin") || "",
    partName: formData.get("partName") || "",
    article: formData.get("article") || "",
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

    setStatus("Заявка успешно отправлена.", "success");
    form.reset();
    formTypeInput.value =
      document.querySelector(".tab.active").dataset.tab === "auto"
        ? "Подбор авто"
        : "Автозапчасти";

    if (tg?.HapticFeedback?.notificationOccurred) {
      tg.HapticFeedback.notificationOccurred("success");
    }
  } catch (error) {
    setStatus("Не удалось отправить заявку. Попробуйте ещё раз.", "error");
    console.error(error);
  } finally {
    submitBtn.disabled = false;
  }
});
