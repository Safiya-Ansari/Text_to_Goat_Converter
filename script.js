 // Convert input text into goat-speak words
 function goatify() {
    const text = document.getElementById('inputText').value;
    const words = text.split(' ');
    const goatWords = ['baa', 'baaa', 'baaaa', 'baaaaa', 'ba', 'baaaaaa', 'baaaaaaa'];
    const randomGoatText = words
      .map(() => goatWords[Math.floor(Math.random() * goatWords.length)])
      .join(' ');
    document.getElementById('output').innerText = randomGoatText;
  }

  // Try to find a male voice among available voices (prioritize "david")
  function findMaleVoice(voices) {
    const maleVoiceNames = [
      'david', 
      'daniel', 
      'alex', 
      'fred', 
      'google uk english male', 
      'google us english'
    ];
    for (let name of maleVoiceNames) {
      const voice = voices.find(v => v.name.toLowerCase().includes(name));
      if (voice) return voice;
    }
    return voices[0];
  }

  // Speak goat-speak with given pitch and rate
  function speakGoat(pitch, rate) {
    const goatText = document.getElementById('output').innerText;
    const utterance = new SpeechSynthesisUtterance(goatText);
    const voices = window.speechSynthesis.getVoices();
    let goatVoice = findMaleVoice(voices);
    utterance.voice = goatVoice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 1.0;
    speechSynthesis.speak(utterance);
  }

  // Speak a funny English line (for the wrong goats)
  function speakFunnyEnglish(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    const voices = window.speechSynthesis.getVoices();
    let comedicVoice = findMaleVoice(voices);
    utterance.voice = comedicVoice;
    utterance.pitch = 1.0;
    utterance.rate = 1.0;
    utterance.volume = 1.0;
    speechSynthesis.speak(utterance);
  }

  // Add event listeners to gallery images
  document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', function() {
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

  // Ensure voices are loaded
  window.speechSynthesis.onvoiceschanged = () => {
    console.log('Voices updated:', window.speechSynthesis.getVoices());
  };