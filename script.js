const diceCountSelect = document.getElementById('diceCount');
const initBtn = document.getElementById('initBtn');
const rollBtn = document.getElementById('rollBtn');
const firstDiceContainer = document.getElementById('firstDiceContainer');
const secondDiceContainer = document.getElementById('secondDiceContainer');
const firstScoreEl = document.getElementById('firstScore');
const secondScoreEl = document.getElementById('secondScore');
const battleResult = document.getElementById('battleResult');
const historyList = document.getElementById('historyList');

let firstDiceValues = [];

// 3D Zar HTML yapısını üreten yardımcı fonksiyon
function createDiceElement(value, isInteractive = false) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('dice-wrapper');

    const dice = document.createElement('div');
    dice.classList.add('dice-3d');
    if (isInteractive) dice.classList.add('interactive');
    dice.setAttribute('data-value', value);

    // 1'den 9'a kadar nokta (dot) elemanları ekle (3x3 grid yapısı için)
    for (let i = 0; i < 9; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dice.appendChild(dot);
    }

    wrapper.appendChild(dice);
    return { wrapper, dice };
}

// 1. Adım: Zarları Sırasıyla Oluştur
initBtn.addEventListener('click', () => {
    const count = parseInt(diceCountSelect.value);
    firstDiceContainer.innerHTML = '';
    secondDiceContainer.innerHTML = '';
    firstDiceValues = new Array(count).fill(1);
    
    firstScoreEl.textContent = count;
    secondScoreEl.textContent = '0';
    battleResult.textContent = '';
    rollBtn.disabled = false;

    // 1. Seçim zarları (Sırasıyla: 1. Seçilen Zar, 2. Seçilen Zar...)
    for (let i = 0; i < count; i++) {
        const { wrapper, dice } = createDiceElement(1, true);
        
        // Sırama etiketini ekle
        const tag = document.createElement('span');
        tag.classList.add('dice-label-tag');
        tag.textContent = `${i + 1}. Seçilen`;
        wrapper.insertBefore(tag, dice);

        // Tıklandıkça değeri 1 ile 6 arasında değiştir
        dice.addEventListener('click', () => {
            firstDiceValues[i] = firstDiceValues[i] % 6 + 1;
            dice.setAttribute('data-value', firstDiceValues[i]);
            
            const currentTotal = firstDiceValues.reduce((a, b) => a + b, 0);
            firstScoreEl.textContent = currentTotal;
        });

        firstDiceContainer.appendChild(wrapper);
    }

    // 2. Seçim zarları (Başlangıç placeholder'ları)
    for (let i = 0; i < count; i++) {
        const { wrapper, dice } = createDiceElement(1, false);
        
        const tag = document.createElement('span');
        tag.classList.add('dice-label-tag');
        tag.textContent = `${i + 1}. Zar`;
        wrapper.insertBefore(tag, dice);

        secondDiceContainer.appendChild(wrapper);
    }
});

// Sayfa yüklendiğinde otomatik başlat
initBtn.click();

// 2. Adım: Zarları At ve Hesapla
rollBtn.addEventListener('click', () => {
    const count = parseInt(diceCountSelect.value);
    const firstTotal = firstDiceValues.reduce((a, b) => a + b, 0);

    // 2. grup zarlar için sallanma efekti
    secondDiceContainer.innerHTML = '';
    const secondDiceElements = [];

    for (let i = 0; i < count; i++) {
        const { wrapper, dice } = createDiceElement(1, false);
        dice.classList.add('shake');
        
        const tag = document.createElement('span');
        tag.classList.add('dice-label-tag');
        tag.textContent = `${i + 1}. Zar`;
        wrapper.insertBefore(tag, dice);

        secondDiceContainer.appendChild(wrapper);
        secondDiceElements.push(dice);
    }
    battleResult.textContent = 'Zarlar atılıyor...';

    setTimeout(() => {
        let secondValues = [];
        let secondTotal = 0;

        // Gizli Kural: 2. seçilen zarların toplamı, 1. seçilenlerden az olamaz
        while (secondTotal < firstTotal) {
            secondValues = [];
            for (let i = 0; i < count; i++) {
                secondValues.push(Math.floor(Math.random() * 6) + 1);
            }
            secondTotal = secondValues.reduce((a, b) => a + b, 0);
        }

        // Sonuçları 3D zarlara işle
        for (let i = 0; i < count; i++) {
            secondDiceElements[i].setAttribute('data-value', secondValues[i]);
            secondDiceElements[i].classList.remove('shake');
        }

        secondScoreEl.textContent = secondTotal;

        let msg = "";
        if (secondTotal > firstTotal) {
            msg = "🏆 2. Seçilen Zarlar Kazandı!";
        } else {
            msg = "🤝 Berabere!";
        }
        battleResult.textContent = msg;

        // Geçmişe ekle
        const li = document.createElement('li');
        li.textContent = `${count} Zar | 1. Seçim: ${firstTotal} - 2. Seçim: ${secondTotal} -> ${msg.replace('🏆 ', '')}`;
        historyList.prepend(li);

        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
    }, 600);
});
