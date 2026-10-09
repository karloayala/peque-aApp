import './plain.css';

const API_URL = '/api/conversiones';
const unitsByCategory = {
  longitud: [
    { id: 'm', label: 'Metros', symbol: 'm' },
    { id: 'km', label: 'Kilómetros', symbol: 'km' },
    { id: 'cm', label: 'Centímetros', symbol: 'cm' },
    { id: 'mi', label: 'Millas', symbol: 'mi' },
    { id: 'ft', label: 'Pies', symbol: 'ft' },
  ],
  masa: [
    { id: 'kg', label: 'Kilogramos', symbol: 'kg' },
    { id: 'g', label: 'Gramos', symbol: 'g' },
    { id: 'lb', label: 'Libras', symbol: 'lb' },
    { id: 'oz', label: 'Onzas', symbol: 'oz' },
  ],
  temperatura: [
    { id: 'c', label: 'Celsius', symbol: '°C' },
    { id: 'f', label: 'Fahrenheit', symbol: '°F' },
    { id: 'k', label: 'Kelvin', symbol: 'K' },
  ],
};

const form = document.querySelector('#conversion-form');
const amountInput = document.querySelector('#amount');
const fromSelect = document.querySelector('#from-unit');
const toSelect = document.querySelector('#to-unit');
const resultOutput = document.querySelector('#result');
const formMessage = document.querySelector('#form-message');
const convertButton = document.querySelector('#convert-button');
const categoryButtons = [...document.querySelectorAll('.category-button')];
let category = 'longitud';

function fillUnitOptions(selectedFrom, selectedTo) {
  const units = unitsByCategory[category];
  for (const [select, selected] of [[fromSelect, selectedFrom], [toSelect, selectedTo]]) {
    select.replaceChildren(...units.map((unit) => {
      const option = document.createElement('option');
      option.value = unit.id;
      option.textContent = unit.label;
      option.selected = unit.id === selected;
      return option;
    }));
  }
  updateUnitSymbols();
}

function updateUnitSymbols() {
  const units = unitsByCategory[category];
  document.querySelector('#from-symbol').textContent = units.find((unit) => unit.id === fromSelect.value)?.symbol ?? '';
  document.querySelector('#to-symbol').textContent = units.find((unit) => unit.id === toSelect.value)?.symbol ?? '';
}

function formatResult(value) {
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 6 }).format(value);
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    category = button.dataset.category;
    categoryButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const units = unitsByCategory[category];
    fillUnitOptions(units[0].id, units[1].id);
    resultOutput.textContent = '—';
    formMessage.textContent = 'Selecciona las unidades y convierte.';
  });
});

fromSelect.addEventListener('change', updateUnitSymbols);
toSelect.addEventListener('change', updateUnitSymbols);

document.querySelector('#swap-button').addEventListener('click', () => {
  const from = fromSelect.value;
  const to = toSelect.value;
  fromSelect.value = to;
  toSelect.value = from;
  updateUnitSymbols();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = Number(amountInput.value);
  if (!Number.isFinite(value)) {
    formMessage.textContent = 'Escribe una cantidad válida.';
    return;
  }

  formMessage.textContent = 'Enviando petición al backend…';
  convertButton.disabled = true;
  convertButton.querySelector('span:first-child').textContent = 'Calculando';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, from: fromSelect.value, to: toSelect.value, value }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message ?? 'No se pudo completar la conversión.');
    }
    resultOutput.textContent = formatResult(data.result);
    formMessage.textContent = `${formatResult(value)} ${document.querySelector('#from-symbol').textContent} equivalen a ${formatResult(data.result)} ${document.querySelector('#to-symbol').textContent}.`;
  } catch (error) {
    formMessage.textContent = error instanceof TypeError
      ? 'No se pudo conectar con la API. Comprueba que el backend esté iniciado.'
      : error.message;
  } finally {
    convertButton.disabled = false;
    convertButton.querySelector('span:first-child').textContent = 'Convertir';
  }
});

fillUnitOptions('km', 'm');
