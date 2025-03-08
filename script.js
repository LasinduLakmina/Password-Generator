document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const copyBtn = document.getElementById('copy-btn');
  const generateBtn = document.getElementById('generate-btn');
  const lengthInput = document.getElementById('length');
  const uppercaseCheckbox = document.getElementById('uppercase');
  const numbersCheckbox = document.getElementById('numbers');
  const symbolsCheckbox = document.getElementById('symbols');
  const themeToggle = document.getElementById('theme-toggle');
  const strengthIndicator = document.getElementById('strength-indicator');
  const savedPasswordsList = document.getElementById('saved-passwords');

  const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NUMBERS = '0123456789';
  const SYMBOLS = '!@#$%^&*()_+[]{}|;:,.<>?';

  // Generate random character using crypto.getRandomValues
  function getRandomCharacter(characters) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % characters.length;
    return characters[randomIndex];
  }

  // Generate password
  function generatePassword() {
    let characters = '';
    let password = '';

    if (uppercaseCheckbox.checked) characters += UPPERCASE;
    if (numbersCheckbox.checked) characters += NUMBERS;
    if (symbolsCheckbox.checked) characters += SYMBOLS;
    characters += LOWERCASE;

    const length = parseInt(lengthInput.value);

    for (let i = 0; i < length; i++) {
      password += getRandomCharacter(characters);
    }

    passwordInput.value = password;
    updateStrengthIndicator();
  }

  // Update strength indicator
  function updateStrengthIndicator() {
    const length = parseInt(lengthInput.value);
    const hasUppercase = uppercaseCheckbox.checked;
    const hasNumbers = numbersCheckbox.checked;
    const hasSymbols = symbolsCheckbox.checked;

    let strength = 'weak';
    if (length >= 8 && (hasUppercase || hasNumbers || hasSymbols)) {
      strength = 'medium';
    }
    if (length >= 12 && hasUppercase && hasNumbers && hasSymbols) {
      strength = 'strong';
    }

    strengthIndicator.textContent = `Strength: ${strength}`;
    strengthIndicator.className = strength;
  }

  // Copy to clipboard
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(passwordInput.value).then(() => {
      alert('Password copied to clipboard!');
    });
  });

  // Save password
  generateBtn.addEventListener('click', () => {
    const password = passwordInput.value;
    if (!password) return;

    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];
    savedPasswords.push(password);
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));

    renderSavedPasswords();
  });

  // Render saved passwords
  function renderSavedPasswords() {
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];
    savedPasswordsList.innerHTML = '';
    savedPasswords.forEach((pw, index) => {
      const li = document.createElement('li');
      li.textContent = pw;

      // Add Edit Button
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.onclick = () => editPassword(index);

      // Add Delete Button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deletePassword(index);

      li.appendChild(editButton);
      li.appendChild(deleteButton);
      savedPasswordsList.appendChild(li);
    });
  }

  // Edit Password
  function editPassword(index) {
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];
    const newPassword = prompt('Enter the new password:');
    if (newPassword) {
      savedPasswords[index] = newPassword;
      localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
      renderSavedPasswords();
    }
  }

  // Delete Password
  function deletePassword(index) {
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords')) || [];
    savedPasswords.splice(index, 1);
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
    renderSavedPasswords();
  }

  // Initial render
  renderSavedPasswords();

  // Theme toggle
  themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light-mode');
  });

  // Event listeners for settings changes
  lengthInput.addEventListener('input', updateStrengthIndicator);
  uppercaseCheckbox.addEventListener('change', updateStrengthIndicator);
  numbersCheckbox.addEventListener('change', updateStrengthIndicator);
  symbolsCheckbox.addEventListener('change', updateStrengthIndicator);

  // Generate button click event
  generateBtn.addEventListener('click', generatePassword);

  // Initial strength update
  updateStrengthIndicator();
});