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

const fullNameInput = document.getElementById("fullName");
const partsFullNameInput = document.getElementById("partsFullName");

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

function isContactValid(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("@")) {
    return trimmed.length >= 4;
  }

  const digits = onlyDigits(trimmed);
  return digits.length >= 11;
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

  if (!fullNameInput.value.trim()) {
    markError(fullNameInput, "Укажите ФИО.");
    scrollToFirstError();
    return false;
  }

  if (!autoCarModelInput.value.trim()) {
    markError(autoCarModelInput, "Укажите марку и модель автомобиля.");
    scrollToFirstError();
    return false;
  }

  if (!autoPhoneInput.value.trim()) {
    markError(autoPhoneInput, "Укажите телефон или Telegram.");
    scrollToFirstError();
    return false;
  }

  if (!isContactValid(autoPhoneInput.value)) {
    markError(autoPhoneInput, "Укажите корректный телефон или @username.");
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

  if (!partsFullNameInput.value.trim()) {
    markError(partsFullNameInput, "Укажите ФИО.");
    scrollToFirstError();
    return false;
  }

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
    markError(partsPhoneInput, "Укажите телефон или Telegram.");
    scrollToFirstError();
    return false;
  }

  if (!isContactValid(partsPhoneInput.value)) {
    markError(partsPhoneInput, "Укажите корректный телефон или @username.");
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

function formatPhoneRU(value) {
  const raw = String(value || "").trim();

  if (raw.startsWith("@")) {
    return raw;
  }

  let digits = onlyDigits(raw);

  if (!digits) return "";

  if (digits.startsWith("8")) {
    digits = "7" + digits.slice(1);
  }

  if (!digits.startsWith("7")) {
    digits = "7" + digits;
  }

  digits = digits.slice(0, 11);

  let result = "+7";

  if (digits.length > 1) result += " " + digits.slice(1, 4);
  if (digits.length >= 5) result += " " + digits.slice(4, 7);
  if (digits.length >= 8) result += "-" + digits.slice(7, 9);
  if (digits.length >= 10) result += "-" + digits.slice(9, 11);

  return result;
}

function attachPhoneMask(input) {
  if (!input) return;

  input.addEventListener("input", (e) => {
    const value = e.target.value.trim();

    if (value.startsWith("@")) {
      e.target.value = value;
      clearError(input);
      return;
    }

    e.target.value = formatPhoneRU(e.target.value);
    clearError(input);
  });

  input.addEventListener("focus", (e) => {
    const value = e.target.value.trim();
    if (!value) {
      e.target.value = "+7";
    }
  });

  input.addEventListener("blur", (e) => {
    if (e.target.value.trim() === "+7") {
      e.target.value = "";
    }
  });
}

function getTelegramDisplayName(user) {
  if (!user) return "";
  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
}

function getTelegramContactFallback(user) {
  if (!user) return "";
  if (user.username) return `@${user.username}`;
  return "";
}

function autofillFromTelegram() {
  const user = tg?.initDataUnsafe?.user;
  if (!user) return;

  const displayName = getTelegramDisplayName(user);
  const fallbackContact = getTelegramContactFallback(user);

  if (fullNameInput && !fullNameInput.value.trim() && displayName) {
    fullNameInput.value = displayName;
  }

  if (partsFullNameInput && !partsFullNameInput.value.trim() && displayName) {
    partsFullNameInput.value = displayName;
  }

  if (autoPhoneInput && !autoPhoneInput.value.trim() && fallbackContact) {
    autoPhoneInput.value = fallbackContact;
  }

  if (partsPhoneInput && !partsPhoneInput.value.trim() && fallbackContact) {
    partsPhoneInput.value = fallbackContact;
  }
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
  fullNameInput,
  partsFullNameInput,
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

attachPhoneMask(autoPhoneInput);
attachPhoneMask(partsPhoneInput);

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

    autofillFromTelegram();

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

autofillFromTelegram();
