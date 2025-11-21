// script.js
let sentences = { N5: [], N4: [], N3: [] };
let currentLevel = 'N5';
let currentIndex = 0;
let mode = 'en-ja'; // en-ja or ja-en
let score = parseInt(localStorage.getItem('score')||"0");
let streak = parseInt(localStorage.getItem('streak')||"0");

document.getElementById('score').textContent = score;
document.getElementById('streak').textContent = streak;

function setMode(m){
  mode = m;
  document.getElementById('btn-enja').style.opacity = (m==='en-ja')? '1':'0.7';
  document.getElementById('btn-jaen').style.opacity = (m==='ja-en')? '1':'0.7';
  updateSentenceDisplay();
}
function changeLevel(){
  currentLevel = document.getElementById('level').value;
  currentIndex = 0;
  updateSentenceDisplay();
}
function generateOneForLevel(){
  const s = window.generateOne(currentLevel);
  if(!s) return;
  sentences[currentLevel].push(s);
  currentIndex = sentences[currentLevel].length - 1;
  updateSentenceDisplay();
  clearIO();
}
function updateSentenceDisplay(){
  const pool = sentences[currentLevel] || [];
  if(pool.length === 0){
    document.getElementById('sentence').textContent = "No sentence yet — press Next / Generate.";
    return;
  }
  const obj = pool[currentIndex];
  if(mode === 'en-ja'){
    document.getElementById('sentence').textContent = obj.en;
  } else {
    document.getElementById('sentence').innerHTML =
      `<div class="kana"><strong>Kana:</strong> ${obj.ja}</div>
       <div class="kanji"><strong>Kanji:</strong> ${obj.display}</div>`;
    document.getElementById('sentence').dataset.show = 'kanji';
  }
}
function normalizeAnswer(s){
  if(!s) return "";
  return s.replace(/\s+/g,'').replace(/[。、,.!?]/g,'').trim();
}
function checkAnswer(){
  const input = document.getElementById('userInput').value.trim();
  const pool = sentences[currentLevel] || [];
  if(pool.length === 0) return;
  const obj = pool[currentIndex];

  let correct = false;
  if(mode === 'en-ja'){
    const userNorm = normalizeAnswer(input);
    const kanaNorm = normalizeAnswer(obj.ja);
    const disNorm = normalizeAnswer(obj.display);

    if(userNorm === kanaNorm || userNorm === disNorm){
      correct = true;
    } else {
      // small tolerant: if user typed kanji+kana mixed, compare presence of key substrings
      if(userNorm && (kanaNorm.includes(userNorm) || disNorm.includes(userNorm))) correct = true;
    }
  } else {
    correct = (input.toLowerCase() === obj.en.toLowerCase());
  }

  if(correct){
    document.getElementById('feedback').textContent = "✅ Correct!";
    score += 10; streak += 1;
  } else {
    const corr = (mode === 'en-ja') ? obj.ja : obj.en;
    document.getElementById('feedback').textContent = `❌ Wrong! Correct: ${corr}`;
    streak = 0;
  }
  localStorage.setItem('score', score);
  localStorage.setItem('streak', streak);
  document.getElementById('score').textContent = score;
  document.getElementById('streak').textContent = streak;
}
function showHint(){
  const pool = sentences[currentLevel] || [];
  if(pool.length===0) return;
  document.getElementById('hint').textContent = "Hint: " + (pool[currentIndex].hint || '');
}
function toggleKanaKanji(){
  if(mode !== 'ja-en') return;
  const container = document.getElementById('sentence');
  const pool = sentences[currentLevel] || [];
  if(pool.length === 0) return;
  const obj = pool[currentIndex];
  if(container.dataset.show === 'kanji'){
    container.innerHTML = `<div class="kana"><strong>Kana:</strong> ${obj.ja}</div>`;
    container.dataset.show = 'kana';
  } else {
    container.innerHTML = `<div class="kana"><strong>Kana:</strong> ${obj.ja}</div>
                           <div class="kanji"><strong>Kanji:</strong> ${obj.display}</div>`;
    container.dataset.show = 'kanji';
  }
}
function speakInput(){
  const text = document.getElementById('userInput').value.trim();
  if(!text) return;
  if('speechSynthesis' in window){
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = (mode === 'en-ja') ? 'ja-JP' : 'en-US';
    window.speechSynthesis.speak(utter);
  }
}
function clearIO(){
  document.getElementById('userInput').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('hint').textContent = '';
}
window.onload = function(){
  setMode('en-ja');
  // generate initial sentence to show
  if((sentences[currentLevel] || []).length === 0){
    const s = window.generateOne(currentLevel);
    if(s) sentences[currentLevel].push(s);
  }
  updateSentenceDisplay();
};