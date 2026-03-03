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
    <button id="lesson-button${v.level_no}" onclick="loadAllWords(${v.level_no})" class="all-lesson-button btn btn-outline btn-primary ">
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
      removeButtonActive();
      const lessonsButton = document.getElementById(`lesson-button${id}`);
      lessonsButton.classList.add("active");
      showAllWord(words.data);
    });
};
// removing classlist of button
const removeButtonActive = () => {
  const allLessonButton = document.querySelectorAll(".all-lesson-button");
  allLessonButton.forEach((button) => {
    button.classList.remove("active");
  });
};
const showAllWord = (valueOfWord) => {
  const show = document.getElementById("showWord");
  if (valueOfWord.length > 0) {
    show.classList.remove("hidden");
  }
  let disclaimerSelectLesson = document.getElementById(
    "disclaimer-select-lesson",
  );
  disclaimerSelectLesson.classList.add("hidden");
  // add class list and remove lesson not selected and lesson does not have any word
  if (valueOfWord.length == 0) {
    show.classList.add("hidden");
    const imgAlert = document.getElementById("img-alert");
    imgAlert.classList.remove("hidden");
    disclaimerSelectLesson.classList.remove("hidden");
    const alert2 = document.getElementById("alert2");
    alert2.innerText = "এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।";
    const alert1 = document.getElementById("alert1");
    alert1.innerText = "";
  }

  let html = "";
  valueOfWord.forEach((wordValue) => {
    console.log(wordValue);
    html += `
    <div class="word-card bg-white p-6 rounded-xl shadow flex flex-col">
      <p class="font-bold text-2xl  text-center">${wordValue.word ? wordValue.word : "দুঃখিত,শব্দ পাওয়া যায়নি।"}</p>
      <p class="font-medium text-5 text-gray-700 text-center my-2">Meaning / Pronunciation</p>
      <p class="font-semibold text-gray-700 text-2xl text-center">${wordValue.meaning ? wordValue.meaning : "দুঃখিত,অর্থ পাওয়া যায়নি"} / ${wordValue.pronunciation ? wordValue.pronunciation : "দুঃখিত, উচ্চারণ পাওয়া যায়নি।"}</p>
      <div class="flex flex-row justify-between mt-auto pt-10">                   
        <button onclick="loadWordDetails(${wordValue.id})" class="i-button p-4 rounded-2xl bg-sky-100 hover:bg-green-500 active:bg-green-400 cursor-pointer transition-all duration-200 ease-in-out">
            <img class="w-5" src="assets/i-button.png" alt="">
        </button>  
        <button class="speaker-button p-4 rounded-2xl bg-sky-100 hover:bg-green-500 active:bg-green-400 cursor-pointer transition-all duration-200 ease-in-out">
            <img class="w-5" src="assets/speaker-button.png" alt="">
        </button>
      </div>
    </div>
    `;
    show.innerHTML = html;
  });
};
// load word details in modal
const loadWordDetails = (wordDetailId) => {
  const url = `https://openapi.programming-hero.com/api/word/${wordDetailId}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => showWordDetail(data.data));
};

// show word details in modal
const showWordDetail = (detailId) => {
  console.log(detailId);
  document.getElementById("my_modal").showModal();
  // modal title
  const modalTitle = document.getElementById("title");
  modalTitle.innerText = `${detailId.word}`;
  // modal meaning
  const meaning = document.getElementById("meaning");
  meaning.innerText = `${detailId.meaning}`;
  // modal example
  const example = document.getElementById("example");
  example.innerText = `${detailId.sentence}`;
  let synonym = detailId.synonyms;
  let html = "";
  const synonymsContainer = document.getElementById("synonym-container");
  synonym.forEach((word) => {
    html += `
    <button class="px-5 py-1 rounded-md bg-sky-50 border border-gray-400
    hover:bg-sky-100 cursor-pointer">${word}</button>
    `;
  });
  synonymsContainer.innerHTML = html;
};
