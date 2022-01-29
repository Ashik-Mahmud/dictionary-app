// selection 

let contentBody = document.querySelector(".content_body");
let search_term = document.querySelector("#search_term");
let text = document.querySelector(".text p");
let word_p = document.querySelector(".word p");
let word_span = document.querySelector(".word span");
let meaning = document.querySelector(".meaning p");
let example = document.querySelector(".example p");
let synonyms = document.querySelector(".synonyms .list");
let speaker = document.querySelector(".speaker .audio");
let close_search = document.querySelector(".close_search");
let audio;
// Dictionary 
function Dictionary(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {

            if (data.title === 'No Definitions Found') {
                contentBody.classList.remove("active");
                text.innerHTML = "Can't find the meaning of <span style='font-weight:600;'>'" + word + "'</span>. Please, try to search for another word.";
                text.style.color = "#444";

            } else {
                contentBody.classList.add("active");
                // Get result 

                let type = data[0].meanings[0]["partOfSpeech"];
                let meanings = data[0].meanings[0].definitions[0]['definition'];
                let example_tag = data[0].meanings[0].definitions[0]['example'];
                let synonyms_tag = data[0].meanings[0].definitions[0]['synonyms'];
                let audioUrl = data[0].phonetics[0].audio;
                audio = new Audio("https://" + audioUrl);

                if (synonyms_tag[0] === undefined) {
                    synonyms.parentElement.parentElement.style.display = "none";
                } else {
                    synonyms.innerHTML = "";
                    synonyms.parentElement.parentElement.style.display = "block";
                    for (let i = 0; i < 5; i++) {
                        let lists = synonyms_tag[i];
                        let items = `<span onclick=search('${lists}')>${lists},</span>`;
                        synonyms.insertAdjacentHTML("beforeend", items);
                    }
                }

                // show 

                word_p.innerText = data[0]['word'];
                word_span.innerText = type + " / " + data[0].phonetic + " / ";
                meaning.innerText = meanings;
                if (example_tag === undefined) {
                    example.parentElement.parentElement.style.display = "none";
                } else {
                    example.parentElement.parentElement.style.display = "block";
                    example.innerText = example_tag;
                }
                text.innerHTML = "";
            }
        })
}

search_term.onkeypress = (event) => {

    if (event.key === "Enter") {
        if (search_term.value === "") {
            text.innerHTML = "Put text in field";
            text.style.color = "#9a9a9a";

        } else {
            contentBody.classList.remove("active");

            Dictionary(search_term.value);
            text.innerHTML = "Searching the meaning <span style='font-weight:600;'>'" + search_term.value + "'</span>.";
            text.style.color = "#444";
        }



    }

}


// Speker Enabled 
speaker.onclick = () => {
    audio.play();
    speaker.style.color = "#4D59FB";
    setTimeout(() => {
        speaker.style.color = "#999";
    }, 800);
};


// Search synonyms 
function search(word) {
    search_term.value = word;
    search_term.focus();
    Dictionary(word);
}

// close search 
close_search.onclick = () => {
    search_term.value = "";
    search_term.focus();
    contentBody.classList.remove("active");
    text.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
    text.style.color = "#9a9a9a";

}

