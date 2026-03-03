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
  showLoadingIfLate(true);
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
  let disclaimerSelectLesson = document.getElementById(
    "disclaimer-select-lesson",
  );
  disclaimerSelectLesson.classList.add("hidden");
  const show = document.getElementById("showWord");
  if (valueOfWord.length > 0) {
    show.classList.remove("hidden");

    const noWordAvailable = document.getElementById("noWordAvailable");
    noWordAvailable.classList.add("hidden");
  }
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
    const noWordAvailable = document.getElementById("noWordAvailable");
    noWordAvailable.classList.add("hidden");
    showLoadingIfLate(false);
    return;
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
        <button onclick="pronounceWord('${wordValue.word}')" class="speaker-button p-4 rounded-2xl bg-sky-100 hover:bg-green-500 active:bg-green-400 cursor-pointer transition-all duration-200 ease-in-out">
            <img class="w-5" src="assets/speaker-button.png" alt="">
        </button>
      </div>
    </div>
    `;
    show.innerHTML = html;
  });
  showLoadingIfLate(false);
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
  const showModal = document.getElementById("showModal");
  let html = `
      <div>
            <h3  class="text-3xl font-bold mb-4 flex justify-start items-center">
            ${detailId.word}
               ( <img class="w-[30px]" src="assets/mike.png" alt="">  
             : ${detailId.pronunciation})
          </h3>
          <p class="font-semibold text-6">Meaning</p>
          <p id="meaning" class="pb-4">${detailId.meaning}</p>
          <p class="font-semibold text-6">Example</p>
          <p id="example" class="pb-4">${detailId.sentence}</p>
          <p class="font-semibold text-6">সমার্থক শব্দ গুলো</p>
          <div id="synonym-container" class="pt-1 space-x-2 flex flex-wrap">
          </div>
      </div>
  
  `;
  showModal.innerHTML = html;

  // synonym loop
  let renderSynonym = "";
  let synonym = detailId.synonyms;
  const synonymsContainer = document.getElementById("synonym-container");
  synonym.forEach((word) => {
    renderSynonym += `
    <button class="px-5 py-1 rounded-md bg-sky-50 border border-gray-400
    hover:bg-sky-100 cursor-pointer">${word}</button>
    `;
  });
  synonymsContainer.innerHTML = renderSynonym;
};

// pronounceWord
function pronounceWord(word) {
  const synth = window.speechSynthesis;

  // Stop any previous speech so clicks don't overlap
  synth.cancel();

  const text = String(word ?? "").trim();
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);

  // ✅ British English locale
  utterance.lang = "en-GB";

  // ✅ Clarity tweaks (adjust if you want)
  utterance.volume = 1; // 0 to 1
  utterance.rate = 0.92; // slightly slower = clearer
  utterance.pitch = 1; // 0 to 2

  // Choose the most natural-sounding UK voice available
  const pickBestUKVoice = (voices) => {
    const ukVoices = voices.filter((v) =>
      (v.lang || "").toLowerCase().startsWith("en-gb"),
    );

    // Prefer higher quality voices (common naming patterns)
    const preferred = [
      /google.*(uk|british|english)/i,
      /(microsoft|ms).*?(natural|online|neural)/i,
      /natural/i,
      /neural/i,
      /(uk|british)/i,
    ];

    for (const rx of preferred) {
      const match = ukVoices.find((v) => rx.test(v.name));
      if (match) return match;
    }

    // Fallback: any en-GB voice
    if (ukVoices.length) return ukVoices[0];

    // Fallback: any English voice
    return (
      voices.find((v) => (v.lang || "").toLowerCase().startsWith("en")) || null
    );
  };

  const speakWithBestVoice = () => {
    const voices = synth.getVoices();
    const best = pickBestUKVoice(voices);
    if (best) utterance.voice = best;
    synth.speak(utterance);
  };

  // Chrome may load voices asynchronously
  if (synth.getVoices().length === 0) {
    const onVoices = () => {
      synth.removeEventListener("voiceschanged", onVoices);
      speakWithBestVoice();
    };
    synth.addEventListener("voiceschanged", onVoices);
  } else {
    speakWithBestVoice();
  }
}

// loading of words cards

const showLoadingIfLate = (status) => {
  if (status == true) {
    // loading
    const loading = document.getElementById("loading");
    loading.classList.remove("hidden");
    const disclaimerSelectLesson = document.getElementById(
      "disclaimer-select-lesson",
    );
    disclaimerSelectLesson.classList.add("hidden");
    const showWord = document.getElementById("showWord");
    showWord.classList.add("hidden");
    return;
  } else {
    // loading
    const loading = document.getElementById("loading");
    loading.classList.add("hidden");
  }
};
// search vocabularies
document.getElementById("search-button").addEventListener("click", () => {
  const inputValue = document.getElementById("inputValue");
  const searchWord = inputValue.value.trim().toLowerCase();
  if (searchWord) {
    const url = "https://openapi.programming-hero.com/api/words/all";
    fetch(url)
      .then((response) => response.json())
      .then((allWord) => {
        const allWords = allWord.data;
        const matchWord = allWords.filter((word) =>
          word.word.toLowerCase().includes(searchWord),
        );

        showAllWord(matchWord);
        removeButtonActive();
      });
    return;
  } else {
    removeButtonActive();
    const show = document.getElementById("showWord");
    show.classList.add("hidden");
    const noWordAvailable = document.getElementById("noWordAvailable");
    noWordAvailable.classList.remove("hidden");

    let disclaimerSelectLesson = document.getElementById(
      "disclaimer-select-lesson",
    );
    disclaimerSelectLesson.classList.add("hidden");
  }
});
