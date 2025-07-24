let timeEl = document.getElementById('time');
let startBtn = document.getElementById('startBtn');
let resetBtn = document.getElementById('resetBtn');
let seconds = 60, interval;

startBtn.onclick = () => {
  clearInterval(interval);
  interval = setInterval(() => {
    seconds--;
    let m = String(Math.floor(seconds / 60)).padStart(2, '0');
    let s = String(seconds % 60).padStart(2, '0');
    timeEl.textContent = `${m}:${s}`;
    if (seconds <= 0) clearInterval(interval);
  }, 1000);
};

resetBtn.onclick = () => {
  clearInterval(interval);
  seconds = 60;
  timeEl.textContent = "01:00";
};

let recordBtn = document.getElementById('recordBtn');
let playBtn = document.getElementById('playBtn');
let waveform = document.getElementById('waveform');
let transcript = document.getElementById('transcript');
let mediaRecorder, audioChunks = [], audioBlob;

recordBtn.onclick = async () => {
  if (recordBtn.textContent === '🎤 Record') {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.start();
    recordBtn.textContent = '⏹️ Stop';
  } else {
    mediaRecorder.stop();
    recordBtn.textContent = '🎤 Record';
    mediaRecorder.onstop = async () => {
      audioBlob = new Blob(audioChunks);
      playBtn.disabled = false;
      waveform.textContent = '📊 Simulated Waveform Display';
      const form = new FormData();
      form.append('file', audioBlob, 'audio.wav');
      const res = await fetch('http://127.0.0.1:5000/voice', { method: 'POST', body: form });
      const data = await res.json();
      transcript.textContent = "📝 Transcript: " + data.text;
    };
  }
};

playBtn.onclick = () => {
  new Audio(URL.createObjectURL(audioBlob)).play();
};

document.getElementById('setQuestion').onclick = async () => {
  const question = prompt("Enter your question:");
  if (question) {
    await fetch('save_question.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    alert("✅ Question saved to database!");
  }
};

document.getElementById('setTimer').onclick = async () => {
  let mins = parseInt(prompt("Minutes?") || "0");
  let secs = parseInt(prompt("Seconds?") || "0");
  seconds = mins * 60 + secs;
  timeEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  await fetch('save_question.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration_sec: seconds })
  });
  alert("⏱️ Timer saved.");
};
