// Show custom alert
function showAlert(message) {
  document.getElementById("alertMessage").innerText = message;
  document.getElementById("customAlert").style.display = "flex";
}

// Close the alert modal
function closeAlert() {
  document.getElementById("customAlert").style.display = "none";
}

// Save each goat's original wrong text on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery img').forEach(img => {
    if (img.hasAttribute('data-wrongtext')) {
      img.setAttribute('data-original-wrongtext', img.getAttribute('data-wrongtext'));
    }
  });
});

// Goatify function: converts input text to goat-speak and randomizes the correct goat
function goatify() {
  const text = document.getElementById('inputText').value.trim();

  if (!text) {
    showAlert("First write in the text area!");
    return;
  }

  const words = text.split(' ');
  const goatWords = ['baa', 'baaa', 'baaaa', 'baaaaa', 'ba', 'baaaaaa', 'baaaaaaa'];
  const randomGoatText = words
    .map(() => goatWords[Math.floor(Math.random() * goatWords.length)])
    .join(' ');

  document.getElementById('output').innerText = randomGoatText;

  assignRandomGoat();
}

// Randomly assign one goat as correct
function assignRandomGoat() {
  const goats = document.querySelectorAll('.gallery img');
  // Reset all goats: restore original wrong text and mark as false
  goats.forEach(goat => {
    if (goat.hasAttribute('data-original-wrongtext')) {
      goat.setAttribute('data-wrongtext', goat.getAttribute('data-original-wrongtext'));
    }
    goat.setAttribute('data-correct', 'false');
  });
  // Pick one random goat to be the correct one
  const randomIndex = Math.floor(Math.random() * goats.length);
  const correctGoat = goats[randomIndex];
  correctGoat.setAttribute('data-correct', 'true');
  // Remove the wrong text so it doesn't speak a funny message
  correctGoat.removeAttribute('data-wrongtext');
}

// Speak goat-speak with the given pitch and rate
function speakGoat(pitch, rate) {
  const goatText = document.getElementById('output').innerText;
  
  if (!goatText) {
    showAlert("First click Goatify before selecting a goat!");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(goatText);
  utterance.pitch = pitch;
  utterance.rate = rate;
  utterance.volume = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const maleVoice = voices.find(voice => voice.name.includes("Male")) || voices[0];
  if (maleVoice) {
    utterance.voice = maleVoice;
  }
  window.speechSynthesis.speak(utterance);
}

// Speak a funny message for wrong goats
function speakFunnyEnglish(message) {
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.pitch = 1.0;
  utterance.rate = 1.0;
  utterance.volume = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const maleVoice = voices.find(voice => voice.name.includes("Male")) || voices[0];
  if (maleVoice) {
    utterance.voice = maleVoice;
  }
  window.speechSynthesis.speak(utterance);
}

// Add event listeners to all goat images
document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('click', function () {
    const outputText = document.getElementById('output').innerText;

    if (!outputText) {
      showAlert("First click Goatify before selecting a goat!");
      return;
    }

    const isCorrect = this.getAttribute('data-correct') === 'true';
    if (isCorrect) {
      const pitch = parseFloat(this.getAttribute('data-pitch')) || 3.0;
      const rate = parseFloat(this.getAttribute('data-rate')) || 0.5;
      speakGoat(pitch, rate);
    } else {
      const wrongText = this.getAttribute('data-wrongtext') || "Hehe, I'm not the right goat, pick another one!";
      speakFunnyEnglish(wrongText);
    }
  });
});

// Ensure voices are loaded (if supported)
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    console.log('Voices updated:', window.speechSynthesis.getVoices());
  };
} else {
  console.error("Speech Synthesis API not supported in this browser.");
}

