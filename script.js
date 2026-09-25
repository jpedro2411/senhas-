const passwordInput = document.getElementById("password");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");

const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");
const message = document.getElementById("message");

const CHARACTERS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

// Usa a API criptográfica do navegador para gerar valores aleatórios.
function secureRandom(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function generatePassword() {
  const length = Number(lengthInput.value);

  let selectedCharacters = "";
  const requiredCharacters = [];

  if (uppercase.checked) {
    selectedCharacters += CHARACTERS.uppercase;
    requiredCharacters.push(
      CHARACTERS.uppercase[secureRandom(CHARACTERS.uppercase.length)]
    );
  }

  if (lowercase.checked) {
    selectedCharacters += CHARACTERS.lowercase;
    requiredCharacters.push(
      CHARACTERS.lowercase[secureRandom(CHARACTERS.lowercase.length)]
    );
  }

  if (numbers.checked) {
    selectedCharacters += CHARACTERS.numbers;
    requiredCharacters.push(
      CHARACTERS.numbers[secureRandom(CHARACTERS.numbers.length)]
    );
  }

  if (symbols.checked) {
    selectedCharacters += CHARACTERS.symbols;
    requiredCharacters.push(
      CHARACTERS.symbols[secureRandom(CHARACTERS.symbols.length)]
    );
  }

  if (selectedCharacters.length === 0) {
    passwordInput.value = "";
    strengthText.textContent = "-";
    strengthFill.style.width = "0%";
    message.textContent = "Selecione pelo menos uma opção.";
    message.style.color = "#f87171";
    return;
  }

  if (requiredCharacters.length > length) {
    passwordInput.value = "";
    message.textContent = "Aumente o tamanho da senha.";
    message.style.color = "#f87171";
    return;
  }

  let passwordCharacters = [...requiredCharacters];

  while (passwordCharacters.length < length) {
    passwordCharacters.push(
      selectedCharacters[secureRandom(selectedCharacters.length)]
    );
  }

  // Embaralha os caracteres.
  for (let i = passwordCharacters.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [passwordCharacters[i], passwordCharacters[j]] =
      [passwordCharacters[j], passwordCharacters[i]];
  }

  const password = passwordCharacters.join("");

  passwordInput.value = password;
  message.textContent = "Senha gerada!";
  message.style.color = "#4ade80";

  updateStrength(password);
}

function updateStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    strengthText.textContent = "Fraca";
    strengthText.style.color = "#f87171";
    strengthFill.style.background = "#ef4444";
    strengthFill.style.width = "30%";
  } else if (score <= 4) {
    strengthText.textContent = "Média";
    strengthText.style.color = "#fbbf24";
    strengthFill.style.background = "#f59e0b";
    strengthFill.style.width = "60%";
  } else {
    strengthText.textContent = "Forte";
    strengthText.style.color = "#4ade80";
    strengthFill.style.background = "#22c55e";
    strengthFill.style.width = "100%";
  }
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
});

generateButton.addEventListener("click", generatePassword);

copyButton.addEventListener("click", async () => {
  if (!passwordInput.value) {
    message.textContent = "Gere uma senha primeiro.";
    message.style.color = "#f87171";
    return;
  }

  try {
    await navigator.clipboard.writeText(passwordInput.value);
    message.textContent = "Senha copiada!";
    message.style.color = "#4ade80";
  } catch {
    message.textContent = "Não foi possível copiar.";
    message.style.color = "#f87171";
  }
