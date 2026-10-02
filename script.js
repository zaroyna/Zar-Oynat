const rollBtn = document.getElementById('rollBtn');
const gameModeSelect = document.getElementById('gameMode');
const player1Dice = document.getElementById('player1Dice');
const player2Dice = document.getElementById('player2Dice');
const winnerText = document.getElementById('winnerText');
const historyList = document.getElementById('historyList');

rollBtn.addEventListener('click', () => {
    const isRigged = gameModeSelect.value === 'rigged';
    
    // Sallanma efekti başlat
    player1Dice.classList.add('shake');
    player2Dice.classList.add('shake');
    player1Dice.textContent = '...';
    player2Dice.textContent = '...';
    winnerText.textContent = '';

    setTimeout(() => {
        // 1. Oyuncu için 1 ile 6 arasında rastgele zar
        const val1 = Math.floor(Math.random() * 6) + 1;
        
        let val2;
        if (isRigged) {
            // İkinci oyuncu modu açıksa: 1. oyuncunun değerinden 6'ya kadar rastgele seç
            val2 = Math.floor(Math.random() * (7 - val1)) + val1;
        } else {
            // Normal mod: Tamamen bağımsız rastgele
            val2 = Math.floor(Math.random() * 6) + 1;
        }

        // Değerleri ekrana yansıt
        player1Dice.textContent = val1;
        player2Dice.textContent = val2;
        
        player1Dice.classList.remove('shake');
        player2Dice.classList.remove('shake');

        // Kazananı belirle
        let resultMsg = "";
        if (val2 > val1) {
            resultMsg = "🏆 2. Oyuncu Kazandı!";
        } else if (val1 > val2) {
            resultMsg = "🏆 1. Oyuncu Kazandı!";
        } else {
            resultMsg = "🤝 Berabere!";
        }
        winnerText.textContent = resultMsg;

        // Geçmişe ekle
        const li = document.createElement('li');
        li.textContent = `P1: ${val1} | P2: ${val2} -> ${resultMsg.replace('🏆 ', '')}`;
        historyList.prepend(li);
        
        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
    }, 500);
});
