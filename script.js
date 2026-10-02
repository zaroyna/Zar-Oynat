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

// 3D Zar HTML elementini oluşturan fonksiyon
function createDiceElement(value, isInteractive) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('dice-wrapper');

    const dice = document.createElement('div');
    dice.classList.add('dice-3d');
    if (isInteractive) dice.classList.add('interactive');
    dice.setAttribute('data-value', value);

    // 3x3 grid noktaları (9 adet)
    for (let i = 0; i < 9; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dice.appendChild(dot);
    }

    wrapper.appendChild(dice);
    return { wrapper, dice };
}

// Zarları Oluşturma Fonksiyonu (Başlangıçta hepsi 1 yazar)
function buildDiceDeck() {
    const count = parseInt(diceCountSelect.value);
    diceContainer.innerHTML = '';
    diceValues = new Array(count).fill(1);
    diceElements = [];

    containerTitle.textContent = "Zarları Sırayla Belirleyin";
    totalScoreEl.textContent = count;
    battleResult.textContent = '';
    rollBtn.disabled = false;

    for (let i = 0; i < count; i++) {
        const { wrapper, dice } = createDiceElement(1, true);

        const tag = document.createElement('span');
        tag.classList.add('dice-label-tag');
        tag.textContent = `${i + 1}. Zar`;
        wrapper.insertBefore(tag, dice);

        // Kullanıcı tıkladıkça 1-6 arası değer değiştirir
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

// "Zarları Oluştur" butonuna tıklandığında
initBtn.addEventListener('click', buildDiceDeck);

// Sayfa açıldığında otomatik 1 deste kur
buildDiceDeck();

// "Mücadeleyi Başlat" butonuna tıklandığında
rollBtn.addEventListener('click', () => {
    const count = parseInt(diceCountSelect.value);
    const userInitialTotal = diceValues.reduce((a, b) => a + b, 0);

    // Başlıkları güncelle (Seçilen ve Kazanan)
    containerTitle.textContent = "Seçilen ve Kazanan Zarlar";

    // Zarlara sallanma (atılma) efekti ver
    diceElements.forEach(dice => dice.classList.add('shake'));
    battleResult.textContent = 'Zarlar atılıyor...';
    rollBtn.disabled = true;

    setTimeout(() => {
        let winningValues = [];
        let winningTotal = 0;

        // Gizli Kural: Kazanan zarların toplamı, kullanıcının seçtiği toplamdan az olamaz
        while (winningTotal < userInitialTotal) {
            winningValues = [];
            for (let i = 0; i < count; i++) {
                winningValues.push(Math.floor(Math.random() * 6) + 1);
            }
            winningTotal = winningValues.reduce((a, b) => a + b, 0);
        }

        // Sonuçları zarlara işle ve sallantıyı kaldır
        for (let i = 0; i < count; i++) {
            diceElements[i].setAttribute('data-value', winningValues[i]);
            diceElements[i].classList.remove('shake');
        }

        totalScoreEl.textContent = winningTotal;

        let msg = `🎉 Mücadele Tamamlandı! Toplam Puan: ${winningTotal}`;
        battleResult.textContent = msg;

        // Geçmişe ekle
        const li = document.createElement('li');
        li.textContent = `${count} Zar | Seçilen/Başlangıç Toplam: ${userInitialTotal} -> Kazanan Toplam: ${winningTotal}`;
        historyList.prepend(li);

        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
    }, 600);
});
