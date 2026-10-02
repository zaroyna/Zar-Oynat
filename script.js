const diceCountSelect = document.getElementById('diceCount');
const initBtn = document.getElementById('initBtn');
const rollBtn = document.getElementById('rollBtn');
const diceContainer = document.getElementById('diceContainer');
const containerTitle = document.getElementById('containerTitle');
const totalScoreEl = document.getElementById('totalScore');
const battleResult = document.getElementById('battleResult');
const historyList = document.getElementById('historyList');

let diceValues = [];
let diceElements = [];

function createDiceElement(value, isInteractive) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('dice-wrapper');

    const dice = document.createElement('div');
    dice.classList.add('dice-3d');
    if (isInteractive) dice.classList.add('interactive');
    dice.setAttribute('data-value', value);

    for (let i = 0; i < 9; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dice.appendChild(dot);
    }

    wrapper.appendChild(dice);
    return { wrapper, dice };
}

function buildDiceDeck() {
    const count = parseInt(diceCountSelect.value);
    diceContainer.innerHTML = '';
    diceValues = new Array(count).fill(1);
    diceElements = [];

    containerTitle.textContent = "Seçilen Zarlar";
    totalScoreEl.textContent = count;
    battleResult.textContent = '';
    rollBtn.disabled = false;

    for (let i = 0; i < count; i++) {
        const { wrapper, dice } = createDiceElement(1, true);

        const tag = document.createElement('span');
        tag.classList.add('dice-label-tag');
        tag.textContent = `${i + 1}. Zar`;
        wrapper.insertBefore(tag, dice);

        dice.addEventListener('click', () => {
            diceValues[i] = diceValues[i] % 6 + 1;
            dice.setAttribute('data-value', diceValues[i]);
            
            const currentTotal = diceValues.reduce((a, b) => a + b, 0);
            totalScoreEl.textContent = currentTotal;
        });

        diceContainer.appendChild(wrapper);
        diceElements.push(dice);
    }
}

initBtn.addEventListener('click', buildDiceDeck);
buildDiceDeck();

rollBtn.addEventListener('click', () => {
    const count = parseInt(diceCountSelect.value);
    const userInitialTotal = diceValues.reduce((a, b) => a + b, 0);

    containerTitle.textContent = "Kazanan Zarlar";

    diceElements.forEach(dice => dice.classList.add('shake'));
    battleResult.textContent = 'Zarlar atılıyor...';
    rollBtn.disabled = true;

    setTimeout(() => {
        let winningValues = [];
        let winningTotal = 0;

        while (winningTotal < userInitialTotal) {
            winningValues = [];
            for (let i = 0; i < count; i++) {
                winningValues.push(Math.floor(Math.random() * 6) + 1);
            }
            winningTotal = winningValues.reduce((a, b) => a + b, 0);
        }

        for (let i = 0; i < count; i++) {
            diceElements[i].setAttribute('data-value', winningValues[i]);
            diceElements[i].classList.remove('shake');
        }

        totalScoreEl.textContent = winningTotal;

        let msg = `🏆 Kazanan Toplam Puan: ${winningTotal}`;
        battleResult.textContent = msg;

        const li = document.createElement('li');
        li.textContent = `${count} Zar | Seçilen: ${userInitialTotal} ➔ Kazanan: ${winningTotal}`;
        historyList.prepend(li);

        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
    }, 600);
});
