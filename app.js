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
const partsBrandSelect = document.getElementById("partsBrand");
const partsModelSelect = document.getElementById("partsModel");

const yearFromSelect = document.getElementById("yearFrom");
const partsYearSelect = document.getElementById("partsYear");
const engineVolumeSelect = document.getElementById("engineVolume");

const mileageInput = document.getElementById("mileage");
const mileageValue = document.getElementById("mileageValue");

const budgetInput = document.getElementById("budget");

/**
 * Марки → модели → доступные объёмы двигателя
 * Можно дальше расширять без изменения логики.
 */
const CAR_DATA = {
  "Audi": {
    "A3": ["1.4 л", "1.5 л", "1.8 л", "2.0 л"],
    "A4": ["2.0 л", "3.0 л"],
    "A5": ["2.0 л", "3.0 л"],
    "A6": ["2.0 л", "3.0 л"],
    "A7": ["3.0 л"],
    "A8": ["3.0 л", "4.0 л"],
    "Q3": ["1.4 л", "2.0 л"],
    "Q5": ["2.0 л", "3.0 л"],
    "Q7": ["2.0 л", "3.0 л", "4.0 л"],
    "Q8": ["3.0 л", "4.0 л"],
    "e-tron": ["EV"]
  },
  "BMW": {
    "1 Series": ["1.5 л", "2.0 л"],
    "2 Series": ["1.5 л", "2.0 л", "3.0 л"],
    "3 Series": ["2.0 л", "3.0 л"],
    "4 Series": ["2.0 л", "3.0 л"],
    "5 Series": ["2.0 л", "3.0 л", "4.4 л"],
    "7 Series": ["3.0 л", "4.4 л", "6.6 л"],
    "X1": ["1.5 л", "2.0 л"],
    "X3": ["2.0 л", "3.0 л"],
    "X4": ["2.0 л", "3.0 л"],
    "X5": ["2.0 л", "3.0 л", "4.4 л"],
    "X6": ["3.0 л", "4.4 л"],
    "X7": ["3.0 л", "4.4 л"],
    "i4": ["EV"],
    "i5": ["EV"],
    "iX": ["EV"]
  },
  "Bentley": {
    "Bentayga": ["3.0 л", "4.0 л", "6.0 л"],
    "Continental GT": ["4.0 л", "6.0 л"],
    "Flying Spur": ["2.9 л", "4.0 л", "6.0 л"]
  },
  "Cadillac": {
    "CT4": ["2.0 л", "2.7 л", "3.6 л"],
    "CT5": ["2.0 л", "3.0 л", "6.2 л"],
    "Escalade": ["6.2 л"],
    "XT4": ["2.0 л"],
    "XT5": ["2.0 л", "3.6 л"],
    "XT6": ["2.0 л", "3.6 л"]
  },
  "Chevrolet": {
    "Camaro": ["2.0 л", "3.6 л", "6.2 л"],
    "Colorado": ["2.5 л", "2.8 л", "3.6 л"],
    "Equinox": ["1.5 л", "2.0 л"],
    "Malibu": ["1.5 л", "2.0 л"],
    "Tahoe": ["5.3 л", "6.2 л"],
    "Traverse": ["3.6 л"],
    "Trax": ["1.2 л", "1.4 л"]
  },
  "Chrysler": {
    "300": ["3.6 л", "5.7 л", "6.4 л"],
    "Pacifica": ["3.6 л"]
  },
  "Ford": {
    "Escape": ["1.5 л", "2.0 л", "2.5 л"],
    "Explorer": ["2.3 л", "3.0 л"],
    "Expedition": ["3.5 л"],
    "F-150": ["2.7 л", "3.5 л", "5.0 л"],
    "Mustang": ["2.3 л", "5.0 л"]
  },
  "Genesis": {
    "G70": ["2.0 л", "2.2 л", "3.3 л"],
    "G80": ["2.5 л", "3.5 л", "2.2 л"],
    "G90": ["3.5 л", "3.5 л Turbo", "5.0 л"],
    "GV60": ["EV"],
    "GV70": ["2.5 л", "3.5 л", "2.2 л", "EV"],
    "GV80": ["2.5 л", "3.5 л", "3.0 л"]
  },
  "GMC": {
    "Acadia": ["2.0 л", "2.5 л", "3.6 л"],
    "Sierra": ["2.7 л", "3.0 л", "5.3 л", "6.2 л"],
    "Terrain": ["1.5 л", "2.0 л"],
    "Yukon": ["5.3 л", "6.2 л"]
  },
  "Honda": {
    "Accord": ["1.5 л", "2.0 л"],
    "CR-V": ["1.5 л", "2.0 л", "2.4 л"],
    "Civic": ["1.5 л", "2.0 л"],
    "Odyssey": ["3.5 л"],
    "Pilot": ["3.5 л"]
  },
  "Hyundai": {
    "Accent": ["1.4 л", "1.6 л"],
    "Avante": ["1.6 л", "2.0 л"],
    "Azera": ["2.5 л", "3.0 л"],
    "Grandeur": ["2.5 л", "3.5 л", "3.0 л", "1.6 л"],
    "Ioniq 5": ["EV"],
    "Ioniq 6": ["EV"],
    "Kona": ["1.6 л", "2.0 л", "EV"],
    "Palisade": ["2.2 л", "3.8 л"],
    "Santa Fe": ["2.2 л", "2.5 л", "1.6 л"],
    "Sonata": ["1.6 л", "2.0 л", "2.5 л"],
    "Staria": ["2.2 л", "3.5 л"],
    "Tucson": ["1.6 л", "2.0 л", "2.5 л"]
  },
  "Infiniti": {
    "Q50": ["2.0 л", "3.0 л"],
    "Q60": ["2.0 л", "3.0 л"],
    "QX50": ["2.0 л"],
    "QX60": ["3.5 л"],
    "QX80": ["5.6 л"]
  },
  "Jaguar": {
    "E-Pace": ["2.0 л"],
    "F-Pace": ["2.0 л", "3.0 л", "5.0 л"],
    "XF": ["2.0 л", "3.0 л"]
  },
  "Jeep": {
    "Cherokee": ["2.0 л", "2.4 л", "3.2 л"],
    "Compass": ["1.3 л", "2.0 л", "2.4 л"],
    "Grand Cherokee": ["2.0 л", "3.6 л", "5.7 л", "6.4 л"],
    "Wrangler": ["2.0 л", "3.6 л"]
  },
  "Kia": {
    "Carnival": ["2.2 л", "3.5 л"],
    "EV6": ["EV"],
    "K5": ["1.6 л", "2.0 л", "2.5 л"],
    "K7": ["2.5 л", "3.0 л", "3.3 л"],
    "K8": ["2.5 л", "3.5 л"],
    "K9": ["3.3 л", "3.8 л", "5.0 л"],
    "Mohave": ["3.0 л"],
    "Morning": ["1.0 л"],
    "Niro": ["1.6 л", "EV"],
    "Ray": ["1.0 л", "EV"],
    "Seltos": ["1.6 л", "2.0 л"],
    "Sorento": ["2.2 л", "2.5 л", "1.6 л", "3.5 л"],
    "Soul": ["1.6 л", "2.0 л", "EV"],
    "Sportage": ["1.6 л", "2.0 л", "2.5 л"],
    "Stinger": ["2.0 л", "2.2 л", "3.3 л"]
  },
  "Land Rover": {
    "Defender": ["2.0 л", "3.0 л", "5.0 л"],
    "Discovery": ["2.0 л", "3.0 л"],
    "Discovery Sport": ["2.0 л"],
    "Range Rover": ["3.0 л", "4.4 л", "5.0 л"],
    "Range Rover Sport": ["3.0 л", "4.4 л", "5.0 л"],
    "Range Rover Velar": ["2.0 л", "3.0 л"]
  },
  "Lexus": {
    "ES": ["2.0 л", "2.5 л", "3.5 л"],
    "GX": ["4.6 л"],
    "IS": ["2.0 л", "2.5 л", "3.5 л"],
    "LS": ["3.5 л"],
    "LX": ["3.5 л", "5.7 л"],
    "NX": ["2.0 л", "2.5 л"],
    "RX": ["2.0 л", "2.5 л", "3.5 л"],
    "UX": ["2.0 л"]
  },
  "Lincoln": {
    "Aviator": ["3.0 л"],
    "Corsair": ["2.0 л", "2.3 л"],
    "Navigator": ["3.5 л"]
  },
  "Maserati": {
    "Ghibli": ["2.0 л", "3.0 л", "3.8 л"],
    "Levante": ["2.0 л", "3.0 л", "3.8 л"],
    "Quattroporte": ["3.0 л", "3.8 л"]
  },
  "Mazda": {
    "CX-30": ["2.0 л", "2.5 л"],
    "CX-5": ["2.0 л", "2.5 л"],
    "CX-9": ["2.5 л"],
    "Mazda3": ["1.5 л", "2.0 л"],
    "Mazda6": ["2.0 л", "2.5 л"]
  },
  "Mercedes-Benz": {
    "A-Class": ["1.3 л", "2.0 л"],
    "C-Class": ["1.5 л", "2.0 л", "3.0 л"],
    "CLA": ["1.3 л", "2.0 л"],
    "CLS": ["2.0 л", "3.0 л"],
    "E-Class": ["2.0 л", "3.0 л"],
    "EQE": ["EV"],
    "EQS": ["EV"],
    "G-Class": ["3.0 л", "4.0 л"],
    "GLA": ["1.3 л", "2.0 л"],
    "GLB": ["1.3 л", "2.0 л"],
    "GLC": ["2.0 л", "3.0 л"],
    "GLE": ["2.0 л", "3.0 л", "4.0 л"],
    "GLS": ["3.0 л", "4.0 л"],
    "S-Class": ["3.0 л", "4.0 л"]
  },
  "Mini": {
    "Clubman": ["1.5 л", "2.0 л"],
    "Convertible": ["1.5 л", "2.0 л"],
    "Cooper": ["1.5 л", "2.0 л"],
    "Countryman": ["1.5 л", "2.0 л"]
  },
  "Mitsubishi": {
    "Outlander": ["2.0 л", "2.4 л", "2.5 л"],
    "Pajero Sport": ["2.4 л", "3.0 л"]
  },
  "Nissan": {
    "Altima": ["2.0 л", "2.5 л"],
    "Kicks": ["1.6 л"],
    "Murano": ["2.5 л", "3.5 л"],
    "Pathfinder": ["3.5 л"],
    "Rogue": ["1.5 л", "2.0 л", "2.5 л"],
    "Sentra": ["1.6 л", "2.0 л"]
  },
  "Porsche": {
    "718 Boxster": ["2.0 л", "2.5 л", "4.0 л"],
    "718 Cayman": ["2.0 л", "2.5 л", "4.0 л"],
    "Cayenne": ["3.0 л", "4.0 л"],
    "Macan": ["2.0 л", "2.9 л", "3.0 л"],
    "Panamera": ["2.9 л", "3.0 л", "4.0 л"],
    "Taycan": ["EV"]
  },
  "Renault": {
    "Arkana": ["1.3 л", "1.6 л"],
    "Koleos": ["2.0 л", "2.5 л"],
    "QM6": ["2.0 л", "2.5 л"],
    "SM6": ["1.3 л", "2.0 л"]
  },
  "Rolls-Royce": {
    "Cullinan": ["6.75 л"],
    "Ghost": ["6.75 л"],
    "Phantom": ["6.75 л"]
  },
  "SsangYong": {
    "Korando": ["1.5 л", "1.6 л"],
    "Rexton": ["2.2 л"],
    "Torres": ["1.5 л"]
  },
  "Subaru": {
    "Forester": ["2.0 л", "2.5 л"],
    "Outback": ["2.5 л"],
    "XV": ["2.0 л"]
  },
  "Tesla": {
    "Model 3": ["EV"],
    "Model S": ["EV"],
    "Model X": ["EV"],
    "Model Y": ["EV"]
  },
  "Toyota": {
    "Alphard": ["2.5 л", "3.5 л"],
    "Camry": ["2.0 л", "2.5 л", "3.5 л"],
    "Corolla": ["1.6 л", "1.8 л", "2.0 л"],
    "Highlander": ["2.4 л", "2.5 л", "3.5 л"],
    "Land Cruiser": ["3.3 л", "3.5 л", "4.0 л", "4.5 л"],
    "RAV4": ["2.0 л", "2.5 л"],
    "Sienna": ["2.5 л", "3.5 л"]
  },
  "Volkswagen": {
    "Arteon": ["2.0 л"],
    "Golf": ["1.4 л", "1.5 л", "2.0 л"],
    "Jetta": ["1.4 л", "1.5 л", "2.0 л"],
    "Passat": ["1.4 л", "1.8 л", "2.0 л"],
    "Tiguan": ["1.4 л", "2.0 л"],
    "Touareg": ["2.0 л", "3.0 л"]
  },
  "Volvo": {
    "S60": ["2.0 л"],
    "S90": ["2.0 л"],
    "XC40": ["1.5 л", "2.0 л", "EV"],
    "XC60": ["2.0 л"],
    "XC90": ["2.0 л"]
  }
};

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

  Object.keys(CAR_DATA)
    .sort((a, b) => a.localeCompare(b))
    .forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      selectEl.appendChild(option);
    });
}

function fillModelSelect(selectEl, brand, placeholder = "Сначала выберите марку") {
  if (!selectEl) return;
  selectEl.innerHTML = "";

  if (!brand || !CAR_DATA[brand]) {
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    return;
  }

  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = "Выберите модель";
  selectEl.appendChild(firstOption);

  Object.keys(CAR_DATA[brand]).forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    selectEl.appendChild(option);
  });
}

function fillEngineSelectByModel(selectEl, brand, model, placeholder = "Сначала выберите модель") {
  if (!selectEl) return;
  selectEl.innerHTML = "";

  if (!brand || !model || !CAR_DATA[brand] || !CAR_DATA[brand][model]) {
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    return;
  }

  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = "Выберите объём";
  selectEl.appendChild(firstOption);

  CAR_DATA[brand][model].forEach((engine) => {
    const option = document.createElement("option");
    option.value = engine;
    option.textContent = engine;
    selectEl.appendChild(option);
  });
}

fillBrandSelect(brandSelect, "Выберите марку");
fillBrandSelect(partsBrandSelect, "Выберите марку");

fillModelSelect(modelSelect, "");
fillModelSelect(partsModelSelect, "");

fillEngineSelectByModel(engineVolumeSelect, "", "");

fillYearSelect(yearFromSelect, "Выберите год");
fillYearSelect(partsYearSelect, "Выберите год");

updateRangeValue(mileageInput, mileageValue);

brandSelect.addEventListener("change", () => {
  fillModelSelect(modelSelect, brandSelect.value);
  fillEngineSelectByModel(engineVolumeSelect, "", "");
});

modelSelect.addEventListener("change", () => {
  fillEngineSelectByModel(engineVolumeSelect, brandSelect.value, modelSelect.value);
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
    fillEngineSelectByModel(engineVolumeSelect, "", "");

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
