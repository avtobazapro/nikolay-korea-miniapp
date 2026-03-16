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

const yearFromSelect = document.getElementById("yearFrom");
const partsYearSelect = document.getElementById("partsYear");
const engineVolumeSelect = document.getElementById("engineVolume");
const partsEngineVolumeSelect = document.getElementById("partsEngineVolume");

const mileageInput = document.getElementById("mileage");
const mileageValue = document.getElementById("mileageValue");
const partsMileageInput = document.getElementById("partsMileage");
const partsMileageValue = document.getElementById("partsMileageValue");

const budgetInput = document.getElementById("budget");

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.className = "status";
  if (type) statusEl.classList.add(type);
}

function formatNumberSpaces(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function onlyDigits(value) {
  return String(value).replace(/\D/g, "");
}

function formatBudget(value) {
  const digits = onlyDigits(value);
  if (!digits) return "";
  return `${formatNumberSpaces(digits)} ₽`;
}

function updateRangeValue(input, output) {
  output.textContent = `${formatNumberSpaces(input.value)} km`;
}

function fillYearSelect(selectEl, placeholder = "Выберите год") {
  if (!selectEl) return;
  selectEl.innerHTML = `<option value="">${placeholder}</option>`;
  for (let year = 2026; year >= 1910; year--) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    selectEl.appendChild(option);
  }
}

function fillEngineSelect(selectEl, placeholder = "Выберите объём") {
  if (!selectEl) return;
  selectEl.innerHTML = `<option value="">${placeholder}</option>`;

  const values = [
    "1.0 л", "1.2 л", "1.3 л", "1.4 л", "1.5 л", "1.6 л", "1.7 л", "1.8 л",
    "2.0 л", "2.2 л", "2.3 л", "2.4 л", "2.5 л", "2.7 л", "2.8 л",
    "3.0 л", "3.2 л", "3.3 л", "3.5 л", "3.6 л", "3.8 л",
    "4.0 л", "4.2 л", "4.4 л", "4.6 л", "4.7 л", "5.0 л",
    "5.2 л", "5.5 л", "5.7 л", "6.0 л", "6.2 л", "6.3 л", "6.7 л"
  ];

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectEl.appendChild(option);
  });
}

fillYearSelect(yearFromSelect, "Выберите год");
fillYearSelect(partsYearSelect, "Выберите год");

fillEngineSelect(engineVolumeSelect, "Выберите объём");
fillEngineSelect(partsEngineVolumeSelect, "Выберите объём");

updateRangeValue(mileageInput, mileageValue);
updateRangeValue(partsMileageInput, partsMileageValue);

mileageInput.addEventListener("input", () => {
  updateRangeValue(mileageInput, mileageValue);
});

partsMileageInput.addEventListener("input", () => {
  updateRangeValue(partsMileageInput, partsMileageValue);
});

budgetInput.addEventListener("input", (e) => {
  const digits = onlyDigits(e.target.value);
  e.target.value = digits ? formatNumberSpaces(digits) : "";
});

budgetInput.addEventListener("blur", (e) => {
  e.target.value = formatBudget(e.target.value);
});

budgetInput.addEventListener("focus", (e) => {
  e.target.value = onlyDigits(e.target.value);
  if (e.target.value) {
    e.target.value = formatNumberSpaces(e.target.value);
  }
});

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

  try {
    const formData = new FormData(form);

    if (budgetInput.value) {
      formData.set("budget", formatBudget(budgetInput.value));
    }

    if (mileageInput.value) {
      formData.set("mileage", `${formatNumberSpaces(mileageInput.value)} km`);
    }

    if (partsMileageInput.value) {
      formData.set("partsMileage", `${formatNumberSpaces(partsMileageInput.value)} km`);
    }

    if (tg?.initDataUnsafe?.user) {
      formData.append("telegramUser", JSON.stringify(tg.initDataUnsafe.user));
    }

    const response = await fetch("/api/send-lead", {
      method: "POST",
      body: formData
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

    fillYearSelect(yearFromSelect, "Выберите год");
    fillYearSelect(partsYearSelect, "Выберите год");
    fillEngineSelect(engineVolumeSelect, "Выберите объём");
    fillEngineSelect(partsEngineVolumeSelect, "Выберите объём");

    mileageInput.value = 80000;
    partsMileageInput.value = 80000;
    updateRangeValue(mileageInput, mileageValue);
    updateRangeValue(partsMileageInput, partsMileageValue);

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
