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

const CAR_DATA = {
  "Audi": {
    "A3": ["A3 35 TFSI", "A3 40 TFSI", "A3 Sportback 35 TFSI"],
    "A4": ["A4 35 TFSI", "A4 40 TFSI", "A4 45 TFSI quattro"],
    "A5": ["A5 40 TFSI", "A5 45 TFSI quattro"],
    "A6": ["A6 40 TDI", "A6 45 TFSI", "A6 50 TDI quattro"],
    "A7": ["A7 45 TFSI", "A7 50 TDI quattro"],
    "A8": ["A8 50 TDI", "A8 55 TFSI", "A8 L 60 TFSI"],
    "Q3": ["Q3 35 TFSI", "Q3 40 TFSI quattro"],
    "Q5": ["Q5 40 TDI", "Q5 45 TFSI quattro"],
    "Q7": ["Q7 45 TDI", "Q7 50 TDI", "Q7 55 TFSI"],
    "Q8": ["Q8 50 TDI", "Q8 55 TFSI"],
    "e-tron": ["e-tron 50 quattro", "e-tron 55 quattro"]
  },
  "BMW": {
    "1 Series": ["118i", "120i", "120d"],
    "2 Series": ["218i", "220i", "220d", "M240i"],
    "3 Series": ["320i", "320d", "330i", "330e", "M340i"],
    "4 Series": ["420i", "420d", "430i", "M440i"],
    "5 Series": ["520i", "520d", "530i", "530e", "540i"],
    "7 Series": ["730d", "740i", "750e", "760i"],
    "X1": ["18i", "20i", "18d", "20d"],
    "X3": ["20i", "20d", "30e", "M40i"],
    "X4": ["20i", "20d", "M40i"],
    "X5": ["30d", "40i", "45e", "50e", "M50i"],
    "X6": ["30d", "40i", "M50i"],
    "X7": ["30d", "40i", "M60i"],
    "i4": ["eDrive35", "eDrive40", "M50"],
    "i5": ["eDrive40", "M60"],
    "iX": ["xDrive40", "xDrive50", "M60"]
  },
  "Genesis": {
    "G70": ["2.0T", "2.2 Diesel", "3.3T Sport"],
    "G80": ["2.5T", "3.5T AWD", "2.2 Diesel"],
    "G90": ["3.5T", "3.5T e-SC AWD", "5.0 AWD"],
    "GV60": ["Standard", "Performance AWD"],
    "GV70": ["2.5T", "3.5T Sport", "2.2 Diesel", "Electrified GV70"],
    "GV80": ["2.5T", "3.5T AWD", "3.0 Diesel"]
  },
  "Hyundai": {
    "Accent": ["1.4 MPI", "1.6 MPI"],
    "Avante": ["1.6 Smartstream", "1.6 Hybrid", "2.0 N Line"],
    "Azera": ["2.5", "3.0 LPG"],
    "Grandeur": ["2.5 GDi", "3.5 GDi", "1.6 Turbo Hybrid", "3.5 LPG"],
    "Ioniq 5": ["Standard Range", "Long Range AWD"],
    "Ioniq 6": ["Standard Range", "Long Range AWD"],
    "Kona": ["1.6 Turbo", "2.0 MPI", "Electric"],
    "Palisade": ["2.2 Diesel", "3.8 GDi"],
    "Santa Fe": ["2.2 Diesel", "2.5 Turbo", "1.6 Turbo Hybrid"],
    "Sonata": ["1.6 Turbo", "2.0 LPG", "2.5 GDi"],
    "Staria": ["2.2 Diesel", "3.5 LPG"],
    "Tucson": ["1.6 Turbo", "2.0 Diesel", "1.6 Hybrid", "2.5 GDi"]
  },
  "Kia": {
    "Carnival": ["2.2 Diesel Prestige", "2.2 Diesel Signature", "3.5 Gasoline Signature"],
    "EV6": ["Standard Range", "Long Range AWD", "GT-Line", "GT"],
    "K5": ["1.6 Turbo", "2.0 LPG", "2.0 Hybrid", "2.5 GT"],
    "K7": ["2.5 GDi", "3.0 LPG", "3.3 GDi"],
    "K8": ["2.5 GDi", "3.5 GDi", "1.6 Turbo Hybrid", "3.5 LPG"],
    "K9": ["3.3 Turbo", "3.8 GDi", "5.0 AWD"],
    "Mohave": ["3.0 Diesel Master", "3.0 Diesel Gravity"],
    "Morning": ["1.0 MPI", "1.0 Turbo GT-Line"],
    "Niro": ["1.6 Hybrid", "1.6 Plug-in Hybrid", "EV"],
    "Ray": ["1.0 MPI", "EV"],
    "Seltos": ["1.6 Turbo", "2.0 MPI", "1.6 Diesel"],
    "Sorento": ["2.2 Diesel", "2.5 Turbo", "1.6 Hybrid", "3.5 Gasoline"],
    "Soul": ["1.6 MPI", "2.0 MPI", "EV"],
    "Sportage": ["1.6 Turbo", "2.0 Diesel", "1.6 Hybrid", "2.5 Gasoline"],
    "Stinger": ["2.0 Turbo", "2.2 Diesel", "3.3 Turbo GT"]
  },
  "Lexus": {
    "ES": ["250", "300h", "350"],
    "GX": ["460"],
    "IS": ["300", "350"],
    "LS": ["500", "500h"],
    "LX": ["500d", "600"],
    "NX": ["250", "350", "350h", "450h+"],
    "RX": ["350", "350h", "500h"],
    "UX": ["200", "250h"]
  },
  "Mercedes-Benz": {
    "A-Class": ["A 200", "A 220", "A 250 4MATIC"],
    "C-Class": ["C 200", "C 220d", "C 300", "C 43 AMG"],
    "CLA": ["CLA 200", "CLA 250 4MATIC", "CLA 45 AMG"],
    "CLS": ["CLS 300d", "CLS 450 4MATIC", "CLS 53 AMG"],
    "E-Class": ["E 220d", "E 300", "E 450 4MATIC", "E 53 AMG"],
    "EQE": ["EQE 300", "EQE 350+", "EQE 500 4MATIC"],
    "EQS": ["EQS 450+", "EQS 580 4MATIC"],
    "G-Class": ["G 350d", "G 400d", "G 500", "G 63 AMG"],
    "GLA": ["GLA 200", "GLA 220", "GLA 250 4MATIC", "GLA 35 AMG"],
    "GLB": ["GLB 200", "GLB 220d", "GLB 250 4MATIC", "GLB 35 AMG"],
    "GLC": ["GLC 220d", "GLC 300", "GLC 300e", "GLC 43 AMG"],
    "GLE": ["GLE 300d", "GLE 400d", "GLE 450 4MATIC", "GLE 450 AMG Line", "GLE 53 AMG", "GLE 63 AMG"],
    "GLS": ["GLS 350d", "GLS 400d", "GLS 450", "GLS 580", "GLS 63 AMG"],
    "S-Class": ["S 350d", "S 400d", "S 450 4MATIC", "S 580 4MATIC", "S 63 AMG"]
  },
  "Mini": {
    "Clubman": ["Cooper", "Cooper S", "John Cooper Works"],
    "Convertible": ["Cooper", "Cooper S"],
    "Cooper": ["1.5 Turbo", "Cooper S 2.0", "John Cooper Works"],
    "Countryman": ["Cooper", "Cooper S", "John Cooper Works"]
  },
  "Porsche": {
    "718 Boxster": ["2.0", "2.5 S", "4.0 GTS"],
    "718 Cayman": ["2.0", "2.5 S", "4.0 GTS", "GT4"],
    "Cayenne": ["3.0", "E-Hybrid", "S", "Turbo GT"],
    "Macan": ["2.0", "S", "GTS"],
    "Panamera": ["2.9 4", "4S", "Turbo S", "E-Hybrid"],
    "Taycan": ["RWD", "4S", "Turbo", "Turbo S"]
  },
  "Tesla": {
    "Model 3": ["RWD", "Long Range AWD", "Performance"],
    "Model S": ["Long Range", "Plaid"],
    "Model X": ["Long Range", "Plaid"],
    "Model Y": ["RWD", "Long Range AWD", "Performance"]
  },
  "Toyota": {
    "Alphard": ["2.5 Hybrid", "3.5 Executive Lounge"],
    "Camry": ["2.0", "2.5", "2.5 Hybrid", "3.5 V6"],
    "Corolla": ["1.6", "1.8 Hybrid", "2.0"],
    "Highlander": ["2.4 Turbo", "2.5 Hybrid", "3.5 V6"],
    "Land Cruiser": ["3.3 Diesel", "3.5 Twin Turbo", "4.0"],
    "RAV4": ["2.0", "2.5", "2.5 Hybrid"],
    "Sienna": ["2.5 Hybrid", "3.5 V6"]
  },
  "Volkswagen": {
    "Arteon": ["2.0 TSI"],
    "Golf": ["1.4 TSI", "2.0 TDI", "GTI", "R"],
    "Jetta": ["1.4 TSI", "1.5 TSI", "2.0 TSI"],
    "Passat": ["1.4 TSI", "2.0 TDI", "2.0 TSI"],
    "Tiguan": ["1.4 TSI", "2.0 TDI", "2.0 TSI"],
    "Touareg": ["2.0 TSI", "3.0 TDI", "3.0 TSI"]
  },
  "Volvo": {
    "S60": ["B4", "B5", "T8 Recharge"],
    "S90": ["B5", "T8 Recharge"],
    "XC40": ["B3", "B4", "Recharge"],
    "XC60": ["B5", "B6", "T8 Recharge"],
    "XC90": ["B5", "B6", "T8 Recharge"]
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

function fillModificationSelect(selectEl, brand, model, placeholder = "Сначала выберите модель") {
  if (!selectEl) return;
  selectEl.innerHTML = "";

  if (!brand || !model || !CAR_DATA[brand] || !CAR_DATA[brand][model]) {
    selectEl.innerHTML = `<option value="">${placeholder}</option>`;
    return;
  }

  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = "Выберите модификацию";
  selectEl.appendChild(firstOption);

  CAR_DATA[brand][model].forEach((modification) => {
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
