import words from "./words.json" with { type: "json" };

const textarea = document.getElementById('user-input');
const mistakesContainer = document.getElementById('misspelled');

const storedWords = JSON.parse(localStorage.getItem('basicWords'));
const initialWords = storedWords || [];
const basicWords = new Set([...initialWords, ...words]);


const checkSpelling = (userInput) => {
    const correctedWords = userInput.replace(/[,.?!":%£;$*(){},@~#/|]/g, ' ');
    const allWordsEntered = correctedWords.split(/\s+/);

    return allWordsEntered.map(word => {
        if (!word) return null;

        const originalWord = userInput.split(/\s+/).find(w => w.toLowerCase() === word);

        if (word[0] === word[0].toUpperCase() && word[1] === word[1].toLowerCase() ) return null;

        if (word.includes('-')) {
            const parts = word.split('-');
            return parts.some(part => !basicWords.has(part.toLowerCase())) ? word : null;
        }

        return basicWords.has(word.toLowerCase()) ? null : word;
    }).filter(word => word);
};

const displayMistakes = () => {
    const userInput = textarea.value;

    const mistakes = checkSpelling(userInput);
    const noMistakeparag = document.createElement('p');
    noMistakeparag.innerHTML = 'No spelling mistakes detected';
    noMistakeparag.classList.add('correct');



    if (mistakes.length > 0) {
        mistakesContainer.innerHTML = '';
        const p = document.createElement('p');
        const addBtn = document.createElement('button');
        const span = document.createElement('span');
        addBtn.innerHTML = mistakes.length === 1 ? 'Add word' : 'Add Words';
        p.classList.add('misspelled');
        span.innerHTML = mistakes.join(', ');
        span.classList.add('incorrect');
        p.appendChild(span);
        p.innerHTML = `Spelling mistakes: <span class='incorrect'>${mistakes.join(', ')}</span>`;
        mistakesContainer.appendChild(p);
        mistakesContainer.appendChild(addBtn);
        
        addBtn.addEventListener('click', ()=> {

            mistakes.forEach(word => {
                basicWords.add(word.toLowerCase());
                localStorage.setItem('basicWords', JSON.stringify([...basicWords]));
            });
            mistakesContainer.innerHTML = ' ';
            mistakesContainer.appendChild(noMistakeparag);
        });

    }
    else {
        mistakesContainer.innerHTML = '';
        mistakesContainer.appendChild(noMistakeparag);
    }

}

export const setupApp = () => {    
    const checkBtn = document.getElementById('check-btn');

    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            displayMistakes();
        });
    }
};


setupApp();

export { checkSpelling }