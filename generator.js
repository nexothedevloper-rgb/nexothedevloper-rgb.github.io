// generator.js
function _rand(a){ return a[Math.floor(Math.random()*a.length)]; }
function capitalize(s){ if(!s) return s; return s.charAt(0).toUpperCase()+s.slice(1); }

function pickNoun(){ return _rand(LEX.nouns); }
function pickVerb(){ return _rand(LEX.verbs); }
function pickAdjective(){ return _rand(LEX.adjectives); }

function pickPlace(){
  const placeKeys = ["station","library","store","park","restaurant","hotel","school","museum","airport"];
  const places = LEX.nouns.filter(n => placeKeys.includes(n.en));
  return (places.length ? _rand(places) : pickNoun());
}

function pickSubject(){
  const subs = [
    {en:"I", ja:"わたしは", display:"私は"},
    {en:"You", ja:"あなたは", display:"あなたは"},
    {en:"He", ja:"かれは", display:"彼は"},
    {en:"She", ja:"かのじょは", display:"彼女は"},
    {en:"They", ja:"かれらは", display:"彼らは"}
  ];
  return _rand(subs);
}

function fillTemplate(tpl, words){
  let en = tpl.en;
  en = en.replace(/\{S\}/g, words.S.en).replace(/\{O\}/g, words.O.en).replace(/\{V\}/g, words.V.en).replace(/\{P\}/g, words.P ? words.P.en : "").replace(/\{T\}/g, words.T ? words.T.en : "");
  let ja = tpl.ja;
  ja = ja.replace(/\{S\}/g, words.S.ja).replace(/\{O\}/g, words.O.ja).replace(/\{V\}/g, words.V.ja).replace(/\{P\}/g, words.P ? words.P.ja : "").replace(/\{T\}/g, words.T ? words.T.ja : "");
  let display = tpl.ja;
  display = display.replace(/\{S\}/g, words.S.display).replace(/\{O\}/g, words.O.display).replace(/\{V\}/g, words.V.display).replace(/\{P\}/g, words.P ? words.P.display : "").replace(/\{T\}/g, words.T ? words.T.display : "");
  return { en: capitalize(en.trim()), ja: ja.trim(), display: display.trim(), hint: tpl.hint || "auto" };
}

function generateOne(level){
  const tpls = LEX.templates[level];
  const tpl = _rand(tpls);
  const S = pickSubject();
  const V = pickVerb();
  const O = pickNoun();
  const P = pickPlace();
  const T = _rand([{en:"today", ja:"きょう", display:"今日"}, {en:"yesterday", ja:"きのう", display:"昨日"}, {en:"tomorrow", ja:"あした", display:"明日"}]);
  const words = { S, V, O, P, T};
  return fillTemplate(tpl, words);
}

if(typeof window !== "undefined") window.generateOne = generateOne;