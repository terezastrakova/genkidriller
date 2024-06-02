import { vocabulary } from './vocabulary.js';
// Define your vocabulary (English to Japanese)

document.addEventListener('DOMContentLoaded', function () {
    const selectionPage = document.getElementById('selection-page');
    const quizPage = document.getElementById('test-page');
    const toggleAllCategories = document.getElementById('toggle-all');
    const categoryCheckboxes = document.querySelectorAll('.category input[type="checkbox"]');
    const toggleAllLessons = document.getElementById('toggle-all-lessons');
    const lessonCheckboxes = document.querySelectorAll('.lesson input[type="checkbox"]');
    const startButton = document.getElementById('start-quiz');
    const backButton = document.getElementById('go-back');

    // Event listener for the master toggle switch for categories
    toggleAllCategories.addEventListener('change', function () {
        const isChecked = toggleAllCategories.checked;
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });

    // Event listener for the master toggle switch for lessons
    toggleAllLessons.addEventListener('change', function () {
        const isChecked = toggleAllLessons.checked;
        lessonCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });

    // Event listener for the "Start" button
    startButton.addEventListener('click', function () {
        const selectedCategories = [];
        const selectedLessons = [];

        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const categoryName = checkbox.id;
                selectedCategories.push(categoryName);
            }
        });

        lessonCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const lessonName = checkbox.id;
                selectedLessons.push(lessonName);
            }
        });

        if (selectedCategories.length === 0 || selectedLessons.length === 0) {
            alert('Please select at least one category and one lesson.');
        } else {
            // Call the function to start the quiz with the selected categories and lessons
            selectionPage.style.display = 'none';
            quizPage.style.display = '';
            startQuiz(selectedCategories, selectedLessons);
        }
    });

    backButton.addEventListener('click', function () {
        selectionPage.style.display = '';
        quizPage.style.display = 'none';
    });
});


const quiz = document.getElementById("quiz");
const progressBar = document.getElementById("progress-bar");
let totalCards = 0;
let correctCnt = 0;
let currentCardIndex = 0; // Track the current card index


// Function to start the quiz with selected categories
function startQuiz(selectedCategories, selectedLessons) {
    // Filter vocabulary based on selected categories
    const filteredVocabulary = vocabulary.filter(entry =>
        selectedCategories.includes(entry.category) && selectedLessons.includes(entry.lesson)
    );
    totalCards = filteredVocabulary.length;
    console.log(totalCards);

    // Delete last quiz
    quiz.innerHTML = '';
    correctCnt = 0;
    currentCardIndex = 0; // Track the current card index


    // Call the function to generate the test cards with the filtered vocabulary
    generateTestCards(filteredVocabulary);

    quiz.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const card = input.closest('.card'); // Find the closest ancestor card element
                const word = card.querySelector('.card-text span').textContent.trim();
                const translation = input.value.trim();

                evaluateTranslation(card, word, translation);

                if (correctCnt < Object.keys(filteredVocabulary).length) {
                    focusNextCard();
                } else {
                    alert('All words are correct!');
                }
            }
        });
    });
}

function updateProgressBar() {
    const progress = (correctCnt / totalCards) * 100;
    progressBar.style.width = `${progress}%`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateTestCards(filteredVocabulary) {
    // Shuffle the vocabulary array
    shuffleArray(filteredVocabulary);

    console.log("hi");
    filteredVocabulary.forEach(entry => {
        generateCard(entry.kana, entry.kanji, entry.english);
    });

    // Focus the first input field
    const first = quiz.querySelector('input');
    first.focus();
    const card = first.closest('.card');
    card.classList.add('focused-card');

    updateProgressBar(); // Update progress bar after generating cards
}

function createElement(tag_name) {
    const new_element = document.createElement(tag_name);
    return new_element;
}

function generateCard(kana, kanji, english) {
    const card = createElement("label");
    card.setAttribute('class', 'card');

    const card_text = createElement("div");
    card_text.setAttribute('class', 'card-text');

    const span = createElement("span");
    span.innerHTML = english;
    const input_field = createElement("input");
    input_field.setAttribute('type', 'text');
    input_field.setAttribute('class', 'input-field');
    input_field.setAttribute('placeholder', 'Enter translation...');
    card_text.appendChild(span);
    card.appendChild(card_text);
    card.appendChild(input_field);
    wanakana.bind(input_field); // Assuming you have wanakana library for input handling
    quiz.appendChild(card);
}

// // Generate the test cards
// generateTestCards();

function evaluateTranslation(currentCard, word, translation) {
    const entry = vocabulary.find(entry => entry.english === word);
    console.log(entry)
    if (entry && (entry.kana === translation || entry.kanji === translation || entry.english === translation)) {
        currentCard.classList.remove('incorrect');
        currentCard.classList.add('correct');
        correctCnt++;
    } else {
        currentCard.classList.add('incorrect');
        currentCard.querySelector('input').setAttribute('placeholder', translation);
    }
    currentCard.classList.add('attempted'); // Mark card as attempted
    currentCard.classList.remove('focused-card');
    updateProgressBar(); // Update progress bar after each evaluation
}

function focusNextCard() {
    const cards = Array.from(quiz.querySelectorAll('.card'));
    let nextCard = null;

    // Try to find the next card sequentially
    for (let i = currentCardIndex + 1; i < cards.length; i++) {
        if (!cards[i].classList.contains('correct')) {
            nextCard = cards[i];
            currentCardIndex = i;
            break;
        }
    }

    // If no next card found, loop back to the first incorrect card
    if (!nextCard) {
        for (let i = 0; i < cards.length; i++) {
            if (!cards[i].classList.contains('correct')) {
                nextCard = cards[i];
                currentCardIndex = i;
                break;
            }
        }
    }

    if (nextCard) {
        const nextInput = nextCard.querySelector('input');
        focusCard(nextCard, nextInput);
    }
}

function focusCard(card, inputField) {
    inputField.focus();
    inputField.value = '';
    card.classList.remove('incorrect');
    card.classList.add('focused-card');
}
