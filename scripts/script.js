const dateInput = document.getElementById("lesson-date");
const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clear-button");
const resultsContainer = document.getElementById("lesson-results");

let lessons = [];

async function loadLessons(){
    try {
        const response = await fetch("lessons.json");

        if(!response.ok) {
            throw new Error(`Could not load lessons.json: ${response.status}`);

        }

        const data = await response.json();

        lessons = data.filter((lesson) => {
            return lesson.date && lesson.title;
        });

        displayMessage("Select a date to find a lesson.");
    } catch (error) {
        console.error(error);

        displayMessage(
            "The lesson information could not be loaded.", true
        );
    }
}

function searchByDate() {
    const selectedDate = dateInput.value;

    if(!selectedDate){
        displayMessage("Please select a date.", true);
        return;
    }

    const matchingLessons = lessons.filter((lesson) => {
        return lesson.date === selectedDate;
    });

    displayLessons(matchingLessons, selectedDate);
}

function displayLessons(matchingLessons, selectedDate) {
    resultsContainer.innerHTML = "";

    if (matchingLessons.length === 0) {
        const formattedDate = formatDate(selectedDate);

        displayMessage(`No lesson was found for ${formattedDate}.`);
        return;
    }

    matchingLessons.forEach((lesson) => {
        const lessonCard = document.createElement("article");
        lessonCard.classList.add("lesson-card");

        const date = document.createElement("p");
        date.classList.add("lesson-date");
        date.textContent = formatDate(lesson.date);

        const title = document.createElement("h2");
        title.textContent = lesson.title;
        lessonCard.append(date, title);

        if (lesson.scripture) {
            const scripture = document.createElement("p");

            const scriptureLabel = document.createElement("strong");
            scriptureLabel.textContent = "Scripture: ";

            scripture.append(scriptureLabel, lesson.scripture);
            lessonCard.appendChild(scripture);
        }

        if (lesson.url) {
            const link = document.createElement("a");

            link.href = cleanUrl(lesson.url);
            link.textContent = "Open lesson";
            link.target = "_blank";
            link.rel = "nooperner noreferrer";

            lessonCard.appendChild(link);
        }

        resultsContainer.appendChild(lessonCard);
    });
}

function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function cleanUrl(url) {
    const markdownUrlMatch = url.match(/^\[.*?\]\((https?:\/\/.+)\)$/);

    if(markdownUrlMatch) {
        return markdownUrlMatch[1];
    }

    return url;
}

function displayMessage(message, isError = false){
    resultsContainer.innerHTML = "";

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    if(isError) {
        paragraph.classList.add("error-message");
    }

    resultsContainer.appendChild(paragraph);
}

function clearSearch() {
    dateInput.value = "";
    displayMessage("Select a date to find a lesson");
}

searchButton.addEventListener("click", searchByDate);

clearButton.addEventListener("click", clearSearch);

dateInput.addEventListener("change", searchByDate);

loadLessons();