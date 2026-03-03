const loadAllLevels = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((response) => response.json())
    .then((data) => showLesson(data.data));
};
loadAllLevels();
const showLesson = (value) => {
  const lessons = document.getElementById("lesson-container");

  html = "";
  value.forEach((v) => {
    html += `
    <button onclick="loadAllWords(${v.level_no})" class="btn btn-outline btn-primary">
        <i class="fa-solid fa-book"></i>
        Lessons -${v.level_no}
     </button>
    `;
  });
  lessons.innerHTML = html;
};
const loadAllWords = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((response) => response.json())
    .then((words) => {
      console.log(words.data);
      showAllWord(words.data);
    });
};
const showAllWord = (valueOfWord) => {
  const show = document.getElementById("showWord");

  let html = "";
  valueOfWord.forEach((wordValue) => {
    console.log(wordValue.word);
    html += `
    <div class="word-card bg-white p-6 rounded-xl shadow flex flex-col">
        <p class="font-bold text-2xl  text-center">${wordValue.word}</p>
        <p class="font-medium text-5 text-gray-700 text-center my-2">Meaning / Pronunciation</p>
        <p class="font-semibold text-gray-700 text-2xl text-center">${wordValue.meaning} / ${wordValue.pronunciation}</p>
        <div class="flex flex-row justify-between mt-auto pt-10">                   
            <button class="i-button p-4 rounded-2xl bg-sky-100 hover:bg-sky-200">
                <img class="w-5" src="assets/i-button.png" alt="">
            </button>  
            <button class="speaker-button p-4 rounded-2xl bg-sky-100 hover:bg-sky-200">
                <img class="w-5" src="assets/speaker-button.png" alt="">
            </button>
        </div>
    </div>
    `;
    show.innerHTML = html;
  });
};
