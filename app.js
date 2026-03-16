const tg = window.Telegram?.WebApp;

if (tg) {
  tg.expand();
  tg.ready();
}

const tabs = document.querySelectorAll(".tab");
const autoFields = document.getElementById("autoFields");
const partsFields = document.getElementById("partsFields");
const formTypeInput = document.getElementById("formType");
const fuelTypeInput = document.getElementById("fuelType");

const form = document.getElementById("leadForm");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

const budgetInput = document.getElementById("budget");
const autoMileageInput = document.getElementById("autoMileage");
const fuelChips = document.querySelectorAll(".fuel-chip");

const autoCarModelInput = document.getElementById("autoCarModel");
const autoYearInput = document.getElementById("autoYear");
const autoRegionInput = document.getElementById("autoRegion");
const autoPhoneInput = document.getElementById("autoPhone");
const commentInput = document.getElementById("comment");

const partsCarModelInput = document.getElementById("partsCarModel");
const partsYearInput = document.getElementById("partsYear");
const partsPhoneInput = document.getElementById("partsPhone");
const partNameInput = document.getElementById("partName");
const partsCommentInput = document.getElementById("partsComment");

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

function formatMileage(value) {
  const digits = onlyDigits(value);
  if (!digits) return "";
  return `${formatNumberSpaces(digits)} км`;
}

function setActiveTab(tabName) {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });

  if (tabName === "auto") {
    autoFields.classList.remove("hidden");
    partsFields.classList.add("hidden");
    formTypeInput.value = "Подбор авто";
  } else {
    partsFields.classList.remove("hidden");
    autoFields.classList.add("hidden");
    formTypeInput.value = "Автозапчасти";
  }

  clearErrors();
  setStatus("");
}

function markError(input, message = "") {
  if (!input) return;
  input.classList.add("input-error");
  if (message) setStatus(message, "error");
}

function clearError(input) {
  if (!input) return;
  input.classList.remove("input-error");
}

function clearErrors() {
  form.querySelectorAll(".input-error").forEach((el) => {
    el.classList.remove("input-error");
  });
}

function isPhoneValid(value) {
  const digits = onlyDigits(value);
  return digits.length >= 10;
}

function isYearRangeValid(value) {
  if (!value.trim()) return true;
  const years = value.match(/\b(19|20)\d{2}\b/g) || [];
  if (!years.length) return false;
  return years.every((year) => {
    const y = Number(year);
    return y >= 2010 && y <= 2026;
  });
}

function scrollToFirstError() {
  const firstError = form.querySelector(".input-error");
  if (firstError) {
    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    firstError.focus({ preventScroll: true });
  }
}

function validateAutoForm() {
  clearErrors();

  if (!autoCarModelInput.value.trim()) {
    markError(autoCarModelInput, "Укажите марку и модель автомобиля.");
    scrollToFirstError();
    return false;
  }

  if (!autoPhoneInput.value.trim()) {
    markError(autoPhoneInput, "Укажите телефон для связи.");
    scrollToFirstError();
    return false;
  }

  if (!isPhoneValid(autoPhoneInput.value)) {
    markError(autoPhoneInput, "Проверьте телефон. Нужно минимум 10 цифр.");
    scrollToFirstError();
    return false;
  }

  if (autoYearInput.value.trim() && !isYearRangeValid(autoYearInput.value)) {
    markError(autoYearInput, "Год должен быть в диапазоне от 2010 до 2026.");
    scrollToFirstError();
    return false;
  }

  return true;
}

function validatePartsForm() {
  clearErrors();

  if (!partsCarModelInput.value.trim()) {
    markError(partsCarModelInput, "Укажите марку и модель автомобиля.");
    scrollToFirstError();
    return false;
  }

  if (!partNameInput.value.trim()) {
    markError(partNameInput, "Укажите, какая запчасть нужна.");
    scrollToFirstError();
    return false;
  }

  if (!partsPhoneInput.value.trim()) {
    markError(partsPhoneInput, "Укажите телефон для связи.");
    scrollToFirstError();
    return false;
  }

  if (!isPhoneValid(partsPhoneInput.value)) {
    markError(partsPhoneInput, "Проверьте телефон. Нужно минимум 10 цифр.");
    scrollToFirstError();
    return false;
  }

  if (partsYearInput.value.trim()) {
    const yearDigits = onlyDigits(partsYearInput.value);
    const yearNum = Number(yearDigits);
    if (!(yearDigits.length === 4 && yearNum >= 2010 && yearNum <= 2026)) {
      markError(partsYearInput, "Год выпуска должен быть от 2010 до 2026.");
      scrollToFirstError();
      return false;
    }
  }

  return true;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveTab(tab.dataset.tab);
  });
});

fuelChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    fuelChips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    fuelTypeInput.value = chip.dataset.fuel;
  });
});

[
  autoCarModelInput,
  autoYearInput,
  autoRegionInput,
  autoPhoneInput,
  commentInput,
  partsCarModelInput,
  partsYearInput,
  partsPhoneInput,
  partNameInput,
  partsCommentInput,
  budgetInput,
  autoMileageInput
].forEach((input) => {
  if (!input) return;
  input.addEventListener("input", () => clearError(input));
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

autoMileageInput.addEventListener("input", (e) => {
  const digits = onlyDigits(e.target.value);
  e.target.value = digits ? formatNumberSpaces(digits) : "";
});

autoMileageInput.addEventListener("blur", (e) => {
  e.target.value = formatMileage(e.target.value);
});

autoMileageInput.addEventListener("focus", (e) => {
  e.target.value = onlyDigits(e.target.value);
  if (e.target.value) {
    e.target.value = formatNumberSpaces(e.target.value);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isAuto = formTypeInput.value === "Подбор авто";
  const isValid = isAuto ? validateAutoForm() : validatePartsForm();

  if (!isValid) return;

  setStatus("Отправляем заявку...", "loading");
  submitBtn.disabled = true;

  try {
    const formData = new FormData(form);

    if (budgetInput.value) {
      formData.set("budget", formatBudget(budgetInput.value));
    }

    if (autoMileageInput.value) {
      formData.set("autoMileage", formatMileage(autoMileageInput.value));
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

    setStatus("Спасибо, заявка отправлена. Я свяжусь с вами в ближайшее время.", "success");
    form.reset();

    fuelTypeInput.value = "Дизель";
    fuelChips.forEach((chip) => chip.classList.remove("active"));
    const firstChip = document.querySelector('.fuel-chip[data-fuel="Дизель"]');
    if (firstChip) firstChip.classList.add("active");

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
