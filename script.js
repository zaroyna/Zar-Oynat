const rollBtn = document.getElementById('rollBtn');
const diceCountSelect = document.getElementById('diceCount');
const firstContainer = document.getElementById('firstDiceContainer');
const secondContainer = document.getElementById('secondDiceContainer');
const firstScoreEl = document.getElementById('firstScore');
const secondScoreEl = document.getElementById('secondScore');
const winnerText = document.getElementById('winnerText');
const historyList = document.getElementById('historyList');

rollBtn.addEventListener('click', () => {
    const count = parseInt(diceCountSelect.value);

    firstContainer.innerHTML = '';
    secondContainer.innerHTML = '';
    firstScoreEl.textContent = '...';
    secondScoreEl.textContent = '...';
    winnerText.textContent = '';

    const firstDiceElements = [];
    const secondDiceElements = [];

    for (let i = 0; i < count; i++) {
        const d1 = document.createElement('div');
        d1.classList.add('dice', 'shake');
        d1.textContent = '...';
        firstContainer.appendChild(d1);
        firstDiceElements.push(d1);

        const d2 = document.createElement('div');
        d2.classList.add('dice', 'shake');
        d2.textContent = '...';
        secondContainer.appendChild(d2);
        secondDiceElements.push(d2);
    }

    setTimeout(() => {
        let firstValues = [];
        let secondValues = [];

        for (let i = 0; i < count; i++) {
            firstValues.push(Math.floor(Math.random() * 6) + 1);
        }

        const firstTotal = firstValues.reduce((a, b) => a + b, 0);
        let secondTotal = 0;

        while (secondTotal < firstTotal) {
            secondValues = [];
            for (let i = 0; i < count; i++) {
                secondValues.push(Math.floor(Math.random() * 6) + 1);
            }
            secondTotal = secondValues.reduce((a, b) => a + b, 0);
        }

        for (let i = 0; i < count; i++) {
            firstDiceElements[i].textContent = firstValues[i];
            firstDiceElements[i].classList.remove('shake');

            secondDiceElements[i].textContent = secondValues[i];
            secondDiceElements[i].classList.remove('shake');
        }

        firstScoreEl.textContent = firstTotal;
        secondScoreEl.textContent = secondTotal;

        let resultMsg = "";
        if (secondTotal > firstTotal) {
            resultMsg = "🏆 2. Seçilen Zar Kazandı!";
        } else {
            resultMsg = "🤝 Berabere!";
        }
        winnerText.textContent = resultMsg;

        const li = document.createElement('li');
        li.textContent = `${count} Zar | 1. Seçim: ${firstTotal} - 2. Seçim: ${secondTotal} -> ${resultMsg.replace('🏆 ', '')}`;
        historyList.prepend(li);
        
        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
    }, 500);
});
