const diceCountSelect = document.getElementById('diceCount');
const initBtn = document.getElementById('initBtn');
const rollBtn = document.getElementById('rollBtn');
const userDiceContainer = document.getElementById('userDiceContainer');
const rivalDiceContainer = document.getElementById('rivalDiceContainer');
const userScoreEl = document.getElementById('userScore');
const rivalScoreEl = document.getElementById('rivalScore');
const battleResult = document.getElementById('battleResult');
const historyList = document.getElementById('historyList');

let userDiceValues = [];

// 1. Adım: Zarları Oluştur ve Kullanıcının Seçmesine İzin Ver
initBtn.addEventListener('click', () => {
    const count = parseInt(diceCountSelect.value);
    userDiceContainer.innerHTML = '';
    rivalDiceContainer.innerHTML = '';
    userDiceValues = new Array(count).fill(1); // Başlangıçta hepsi 1
    
    userScoreEl.textContent = count;
    rivalScoreEl.textContent = '0';
    battleResult.textContent = '';
    rollBtn.disabled = false;

    // Kullanıcı için tıklandıkça 1-6 arası değişen interaktif zar butonları üret
    for (let i = 0; i < count; i++) {
        const btn = document.createElement('button');
        btn.classList.add('dice-select');
        btn.textContent = '1';
        
        btn.addEventListener('click', () => {
            // Tıklandıkça 1 artır, 6'dan sonra tekrar 1 yap
            userDiceValues[i] = userDiceValues[i] % 6 + 1;
            btn.textContent = userDiceValues[i];
            
            // Toplam skoru anlık güncelle
            const currentTotal = userDiceValues.reduce((a, b) => a + b, 0);
            userScoreEl.textContent = currentTotal;
        });
        
        userDiceContainer.appendChild(btn);
    }

    // Rakip kutucuklarına başlangıç yer tutucuları koy
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.classList.add('dice-static');
        div.textContent = '?';
        rivalDiceContainer.appendChild(div);
    }
});

// Sayfa ilk açıldığında otomatik bir kez oluştursun
initBtn.click();

// 2. Adım: Mücadeleyi Başlat ve Rakip Zarlarını Kurala Göre Hesapla
rollBtn.addEventListener('click', () => {
    const count = parseInt(diceCountSelect.value);
    const userTotal = userDiceValues.reduce((a, b) => a + b, 0);

    // Rakip zarları için sallanma efekti
    rivalDiceContainer.innerHTML = '';
    const rivalElements = [];
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.classList.add('dice-static', 'shake');
        div.textContent = '...';
        rivalDiceContainer.appendChild(div);
        rivalElements.push(div);
    }
    battleResult.textContent = 'Hesaplanıyor...';

    setTimeout(() => {
        let rivalValues = [];
        let rivalTotal = 0;

        // Kural: 2. seçilen (rakip) zarların toplamı, kullanıcının toplamından az olamaz (2. hep kazanır/berabere kalır)
        while (rivalTotal < userTotal) {
            rivalValues = [];
            for (let i = 0; i < count; i++) {
                rivalValues.push(Math.floor(Math.random() * 6) + 1);
            }
            rivalTotal = rivalValues.reduce((a, b) => a + b, 0);
        }

        // Rakip zarlarını ekrana yansıt
        for (let i = 0; i < count; i++) {
            rivalElements[i].textContent = rivalValues[i];
            rivalElements[i].classList.remove('shake');
        }

        rivalScoreEl.textContent = rivalTotal;

        // Sonuç mesajı
        let msg = "";
        if (rivalTotal > userTotal) {
            msg = "🏆 2. Seçim (Rakip) Kazandı!";
        } else {
            msg = "🤝 Berabere!";
        }
        battleResult.textContent = msg;

        // Geçmişe ekle
        const li = document.createElement('li');
        li.textContent = `${count} Zar | Sizin Seçim: ${userTotal} - Rakip: ${rivalTotal} -> ${msg.replace('🏆 ', '')}`;
        historyList.prepend(li);

        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
    }, 500);
});
