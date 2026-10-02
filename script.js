const rollBtn = document.getElementById('rollBtn');
const diceCountSelect = document.getElementById('diceCount');
const gameModeSelect = document.getElementById('gameMode');
const p1Container = document.getElementById('player1DiceContainer');
const p2Container = document.getElementById('player2DiceContainer');
const p1ScoreEl = document.getElementById('p1Score');
const p2ScoreEl = document.getElementById('p2Score');
const winnerText = document.getElementById('winnerText');
const historyList = document.getElementById('historyList');

rollBtn.addEventListener('click', () => {
    const count = parseInt(diceCountSelect.value);
    const isRigged = gameModeSelect.value === 'rigged';

    // Alanları temizle ve sallanma efekti koy
    p1Container.innerHTML = '';
    p2Container.innerHTML = '';
    p1ScoreEl.textContent = '...';
    p2ScoreEl.textContent = '...';
    winnerText.textContent = '';

    const p1DiceElements = [];
    const p2DiceElements = [];

    for (let i = 0; i < count; i++) {
        const d1 = document.createElement('div');
        d1.classList.add('dice', 'shake');
        d1.textContent = '...';
        p1Container.appendChild(d1);
        p1DiceElements.push(d1);

        const d2 = document.createElement('div');
        d2.classList.add('dice', 'shake');
        d2.textContent = '...';
        p2Container.appendChild(d2);
        p2DiceElements.push(d2);
    }

    setTimeout(() => {
        let p1Values = [];
        let p2Values = [];

        // 1. Oyuncu için zarları at
        for (let i = 0; i < count; i++) {
            p1Values.push(Math.floor(Math.random() * 6) + 1);
        }

        if (isRigged) {
            // Hileli Mod: 2. oyuncunun toplamı 1. oyuncudan az olamaz
            const p1Total = p1Values.reduce((a, b) => a + b, 0);
            let p2Total = 0;
            
            while (p2Total < p1Total) {
                p2Values = [];
                for (let i = 0; i < count; i++) {
                    p2Values.push(Math.floor(Math.random() * 6) + 1);
                }
                p2Total = p2Values.reduce((a, b) => a + b, 0);
            }
        } else {
            // Normal Mod: Tamamen bağımsız
            for (let i = 0; i < count; i++) {
                p2Values.push(Math.floor(Math.random() * 6) + 1);
            }
        }

        // Değerleri HTML'e aktar ve sınıfları kaldır
        for (let i = 0; i < count; i++) {
            p1DiceElements[i].textContent = p1Values[i];
            p1DiceElements[i].classList.remove('shake');

            p2DiceElements[i].textContent = p2Values[i];
            p2DiceElements[i].classList.remove('shake');
        }

        const finalP1Total = p1Values.reduce((a, b) => a + b, 0);
        const finalP2Total = p2Values.reduce((a, b) => a + b, 0);

        p1ScoreEl.textContent = finalP1Total;
        p2ScoreEl.textContent = finalP2Total;

        let resultMsg = "";
        if (finalP2Total > finalP1Total) {
            resultMsg = "🏆 2. Oyuncu Kazandı!";
        } else if (finalP1Total > finalP2Total) {
            resultMsg = "🏆 1. Oyuncu Kazandı!";
        } else {
            resultMsg = "🤝 Berabere!";
        }
        winnerText.textContent = resultMsg;

        // Geçmişe ekle
        const li = document.createElement('li');
        li.textContent = `${count} Zar | P1: ${finalP1Total} - P2: ${finalP2Total} -> ${resultMsg.replace('🏆 ', '')}`;
        historyList.prepend(li);
        
        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
    }, 500);
});
