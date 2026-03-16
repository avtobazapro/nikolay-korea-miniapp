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

const brandSelect = document.getElementById("brand");
const modelSelect = document.getElementById("model");
const modificationSelect = document.getElementById("modification");

const partsBrandSelect = document.getElementById("partsBrand");
const partsModelSelect = document.getElementById("partsModel");

const yearFromSelect = document.getElementById("yearFrom");
const partsYearSelect = document.getElementById("partsYear");

const mileageInput = document.getElementById("mileage");
const mileageValue = document.getElementById("mileageValue");

const budgetInput = document.getElementById("budget");

const CAR_DATA = window.CAR_DATA || {};

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

function fillBrandSelect(selectEl, placeholder = "Выберите марку") {
  if (!selectEl) return;
  selectEl.innerHTML = `<option value="">${placeholder}</option>`;

  Object.entries(CAR_DATA)
    .sort((a, b) => a[1].label.localeCompare(b[1].label))
    .forEach(([key, brandObj]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = brandObj.label;
      selectEl.appendChild(option);
    });
}

function fillModelSelect(selectEl, brandKey, placeholder = "Сначала выберите марку") {
  if (!selectEl) return;
  selectEl.innerHTML = "";

  if (!brandKey || !CAR_DATA[brandKey] || !CAR_DATA[brandKey].models) {
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    return;
  }

  const models = Object.keys(CAR_DATA[brandKey].models);
  if (!models.length) {
    selectEl.innerHTML = `<option value="">Нет моделей</option>`;
    return;
  }

  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = "Выберите модель";
  selectEl.appendChild(firstOption);

  models.sort((a, b) => a.localeCompare(b)).forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    selectEl.appendChild(option);
  });
}

function fillModificationSelect(selectEl, brandKey, model, placeholder = "Сначала выберите модель") {
  if (!selectEl) return;
  selectEl.innerHTML = "";

  if (
    !brandKey ||
    !model ||
    !CAR_DATA[brandKey] ||
    !CAR_DATA[brandKey].models ||
    !CAR_DATA[brandKey].models[model]
  ) {
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    return;
  }

  const mods = CAR_DATA[brandKey].models[model];

  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = "Выберите модификацию";
  selectEl.appendChild(firstOption);

  mods.forEach((modification) => {
    const option = document.createElement("option");
    option.value = modification;
    option.textContent = modification;
    selectEl.appendChild(option);
  });
}

fillBrandSelect(brandSelect, "Выберите марку");
fillBrandSelect(partsBrandSelect, "Выберите марку");

fillModelSelect(modelSelect, "");
fillModelSelect(partsModelSelect, "");
fillModificationSelect(modificationSelect, "", "");

fillYearSelect(yearFromSelect, "Выберите год");
fillYearSelect(partsYearSelect, "Выберите год");

updateRangeValue(mileageInput, mileageValue);

brandSelect.addEventListener("change", () => {
  fillModelSelect(modelSelect, brandSelect.value);
  fillModificationSelect(modificationSelect, "", "");
});

modelSelect.addEventListener("change", () => {
  fillModificationSelect(modificationSelect, brandSelect.value, modelSelect.value);
});

partsBrandSelect.addEventListener("change", () => {
  fillModelSelect(partsModelSelect, partsBrandSelect.value);
});

mileageInput.addEventListener("input", () => {
  updateRangeValue(mileageInput, mileageValue);
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

    fillBrandSelect(brandSelect, "Выберите марку");
    fillBrandSelect(partsBrandSelect, "Выберите марку");
    fillModelSelect(modelSelect, "");
    fillModelSelect(partsModelSelect, "");
    fillModificationSelect(modificationSelect, "", "");

    fillYearSelect(yearFromSelect, "Выберите год");
    fillYearSelect(partsYearSelect, "Выберите год");

    mileageInput.value = 80000;
    updateRangeValue(mileageInput, mileageValue);

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
