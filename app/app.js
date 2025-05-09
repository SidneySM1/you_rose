// app/app.js

const imagens = [
    { id: "img1", src: "app/images/1.jpg", cor: "#4FC3F7" },
    { id: "img2", src: "app/images/2.jpg", cor: "#A5D6A7" }
];

// Carregar imagens de app/images.json
async function carregarImagens() {
    const imagens = [];

    const tonsAmareloQueimado = [
        "#FFD54F", "#FFCA28", "#FFC107", "#FFB300", "#FFA000", "#FF8F00", "#FF6F00",
        "#FBC02D", "#F9A825", "#F57F17", "#E65100", "#EF6C00", "#F57C00", "#FB8C00",
        "#FFA726", "#FFB74D", "#FFCC80", "#FFE082", "#FFF176", "#FFF59D",
        "#FFECB3", "#FFE0B2", "#FFD180", "#FFB74D", "#FFA726", "#FF9800",
        "#FB8C00", "#F57C00", "#EF6C00", "#E65100", "#FF8A65", "#FF7043",
        "#FF5722", "#F4511E", "#E64A19", "#D84315", "#BF360C", "#E65100"
    ];

    const tonsVerdeMorto = [
        "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32",
        "#1B5E20", "#9CCC65", "#8BC34A", "#7CB342", "#689F38", "#558B2F", "#33691E",
        "#AED581", "#9CCC65", "#8BC34A", "#7CB342", "#689F38", "#558B2F",
        "#33691E", "#DCEDC8", "#C5E1A5", "#B2EBF2", "#A7FFEB", "#76FF03",
        "#64DD17", "#558B2F", "#33691E", "#9E9D24", "#827717", "#AEEA00",
        "#C0CA33", "#AFB42B", "#9E9D24", "#F0F4C3", "#E6EE9C", "#DCE775",
        "#D4E157", "#CDDC39"
    ];

    const tonsAzul = [
        "#4FC3F7", "#29B6F6", "#03A9F4", "#039BE5", "#0288D1", "#0277BD", "#01579B",
        "#81D4FA", "#B3E5FC", "#E1F5FE", "#80DEEA", "#4DD0E1", "#26C6DA", "#00BCD4",
        "#00ACC1", "#0097A7", "#00838F", "#006064", "#B2EBF2", "#B2DFDB",
        "#80CBC4", "#4DB6AC", "#26A69A", "#009688", "#00897B", "#00796B",
        "#00695C", "#004D40", "#84FFFF", "#18FFFF", "#00E5FF", "#00B8D4",
        "#B3E5FC", "#81D4FA"
    ];

    for (let i = 1; i <= 115; i++) {
        let cor = "#CCCCCC"; // padrão

        if (i >= 3 && i <= 40) {
            cor = tonsAmareloQueimado[(i - 3) % tonsAmareloQueimado.length];
        } else if (i >= 41 && i <= 80) {
            cor = tonsVerdeMorto[(i - 41) % tonsVerdeMorto.length];
        } else if (i >= 81 && i <= 115) {
            cor = tonsAzul[(i - 81) % tonsAzul.length];
        } else if (i === 1) {
            cor = "#4FC3F7";
        } else if (i === 2) {
            cor = "#A5D6A7";
        }

        imagens.push({
            id: `img${i}`,
            src: `app/images/${i}.jpg`,
            cor
        });
    }

    // return imagens;
    const selecionadas = imagens.sort(() => 0.5 - Math.random()).slice(0, 3);
    return selecionadas;
}


function mixColors(hexColors) {
    const rgbs = hexColors.map(hexToRgb);
    const total = rgbs.length;
    const avg = {
        r: Math.round(rgbs.reduce((sum, c) => sum + c.r, 0) / total),
        g: Math.round(rgbs.reduce((sum, c) => sum + c.g, 0) / total),
        b: Math.round(rgbs.reduce((sum, c) => sum + c.b, 0) / total)
    };
    return rgbToHex(avg.r, avg.g, avg.b);
}
// Função para converter RGB para hexadecimal
function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

// Função para converter hexadecimal para RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}


// Função para carregar a rosa SVG inicial
function carregarSVGInicial(cor = "#a7a7ae") {
    const rosa = document.getElementById("rosaContainer");
    fetch("https://sidneysm1.github.io/you_rose/app/files/rose.svg")
    .then(res => res.text())
    .then(svg => {
        rosa.innerHTML = svg;
        const gElement = rosa.querySelector("g");
        if (gElement) gElement.setAttribute("fill", cor);
        const svgElement = rosa.querySelector("svg");
        if (svgElement) {
            svgElement.setAttribute("width", "300px");
            svgElement.setAttribute("height", "300px");
        }
    });
}

// Atualiza a cor da rosa com base nas imagens selecionadas
function atualizarCorRosa() {
    const selecionadasArr = Array.from(selecionadas);
    if (selecionadasArr.length === 0) {
        setSVGColor("#a7a7ae");
        return;
    }
    const cores = selecionadasArr.map(id => imagens.find(img => img.id === id).cor);
    const corFinal = mixColors(cores);
    setSVGColor(corFinal);
}

function setSVGColor(cor) {
    const rosa = document.getElementById("rosaContainer");
    const gElement = rosa.querySelector("g");
    if (gElement) gElement.setAttribute("fill", cor);
}

// Função para armazenar e exibir o histórico
function atualizarHistorico() {
    console.log("Atualizando histórico");
    const historico = document.getElementById("historico");
    historico.innerHTML = "<h2>Days:</h2>";
    Object.keys(localStorage).sort().reverse().forEach(data => {
        const reg = JSON.parse(localStorage.getItem(data));
        const dia = document.createElement("div");
        dia.className = "history-day";

        const btn = document.createElement("button");
        btn.className = "show-images";
        btn.textContent = "Images";
        btn.onclick = () => mostrarImagensSelecionadas(dia, reg.imagens);

        const btnDay = document.createElement("button");
        btnDay.className = "show-images";
        btnDay.textContent = "See Day";
        btnDay.onclick = () => mostrarDiaCompleto(reg);

        dia.innerHTML = `
            <div class='color-box' style='background-color:${reg.cor}'></div>
            <div>${data} - ${reg.anotacao}</div>
        `;
        
        // dia.appendChild(btn);
        // dia.appendChild(btnDay);

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "buttons-container";
        buttonsContainer.style.display = "flex";
        buttonsContainer.style.gap = "8px";
        buttonsContainer.appendChild(btn);
        buttonsContainer.appendChild(btnDay);
        historico.appendChild(dia);
        historico.appendChild(buttonsContainer);
    });
}

async function mostrarDiaCompleto(reg) {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    const popup = document.createElement("div");
    popup.className = "popup-dia";

    const fecharX = document.createElement("button");
    fecharX.className = "fechar-x";
    fecharX.innerHTML = "&times;";
    fecharX.onclick = () => overlay.remove();

    const grade = document.createElement("div");
    grade.className = "grade-imagens";

    for (const imgRef of reg.imagens) {
        let imagem = imagens.find(i => i.id === imgRef.id);
        if (!imagem) {
            const arquivo = await recuperarImagemPersonalizada(imgRef.id);
            if (arquivo) {
                const blobURL = URL.createObjectURL(arquivo);
                imagem = {
                    id: imgRef.id,
                    src: blobURL,
                    cor: imgRef.cor || "#FFD700",
                    custom: true
                };
                imagens.push(imagem);
            }
        }

        if (imagem) {
            const img = document.createElement("img");
            img.src = imagem.src;
            grade.appendChild(img);
        }
    }

    const anotacao = document.createElement("p");
    anotacao.className = "anotacao-dia";
    anotacao.textContent = reg.anotacao || "(sem anotação)";

    const fechar = document.createElement("button");
    fechar.textContent = "Close";
    fechar.className = "fechar-popup";
    fechar.onclick = () => overlay.remove();

    popup.appendChild(fecharX);
    popup.appendChild(grade);
    popup.appendChild(anotacao);
    popup.appendChild(fechar);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}




async function mostrarImagensSelecionadas(container, imagensSelecionadas) {
    let div = container.querySelector(".selected-images");
    if (div) {
        div.remove();
        return;
    }

    div = document.createElement("div");
    div.className = "selected-images";

    for (const imgRef of imagensSelecionadas) {
        let imagem = imagens.find(i => i.id === imgRef.id);

        // Se a imagem não estiver na lista em memória, tenta carregar do IndexedDB
        if (!imagem) {
            const arquivo = await recuperarImagemPersonalizada(imgRef.id);
            if (arquivo) {
                const blobURL = URL.createObjectURL(arquivo);
                imagem = {
                    id: imgRef.id,
                    src: blobURL,
                    cor: "#FFD700",
                    custom: true
                };
                imagens.push(imagem); // adiciona à lista em tempo de execução
            }
        }

        // Se a imagem foi encontrada ou carregada, cria o elemento de imagem
        if (imagem) {
            const el = document.createElement("img");
            el.src = imagem.src;

            // Adiciona o evento de clique para abrir a imagem em tela cheia
            el.onclick = () => openModal(el.src);

            div.appendChild(el);
        }
    }

    container.appendChild(div);
}
// Função para abrir o modal em tela cheia
function openModal(imageSrc) {
    const modal = document.getElementById("fullscreenModal");
    const modalImg = document.getElementById("fullscreenImage");
    const captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = imageSrc;
    // captionText.innerHTML = "Imagem de hoje"; // Ou qualquer legenda que você queira

    // Fechar o modal ao clicar no botão de fechar (X)
    const closeBtn = document.getElementById("closeModal");
    closeBtn.onclick = () => {
        modal.style.display = "none";
    };

    // Fechar o modal clicando fora da imagem
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}
async function obterImagemPersonalizada(id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ImagemDB", 1);

        request.onerror = () => reject("Erro ao abrir o IndexedDB");
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction("imagens", "readonly");
            const store = transaction.objectStore("imagens");
            const getRequest = store.get(id);

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject("Erro ao obter imagem");
        };
    });
}


// Função para finalizar a seleção e mostrar o resultado
function finalizarSelecao() {
    const selecionadasArr = Array.from(selecionadas);
    if (selecionadasArr.length === 0) return;

    const cores = selecionadasArr.map(id => imagens.find(img => img.id === id).cor);
    const corFinal = mixColors(cores);
    const anotacao = document.getElementById("anotacao").value.trim();
    const hoje = new Date().toISOString().split("T")[0];

    const registro = {
        imagens: selecionadasArr.map(id => imagens.find(img => img.id === id)),
        cor: corFinal,
        anotacao: anotacao || "No Notes"
    };

    localStorage.setItem(hoje, JSON.stringify(registro));
    mostrarResultado(corFinal, anotacao);
    atualizarHistorico();
}


// Função para mostrar o resultado final
function mostrarResultado(cor, anotacao) {
    const res = document.getElementById("resultado");
    res.style.backgroundColor = cor;
    res.innerHTML = `<h2>Color</h2><p>${cor}</p><p>${anotacao}</p>`;

    // Atualizar rosa
    const rosa = document.getElementById("rosaContainer");
    fetch("https://sidneysm1.github.io/you_rose/app/files/rose.svg")
        .then(res => res.text())
        .then(svg => {
            rosa.innerHTML = svg;
            const gElement = rosa.querySelector("g");
            if (gElement) gElement.setAttribute("fill", cor);
            const svgElement = rosa.querySelector("svg");
            if (svgElement) {
                svgElement.setAttribute("width", "300px");
                svgElement.setAttribute("height", "300px");
            }
        });
}


// Função para verificar o significado da cor
function getMeaning(color) {
    if (color === "#FFA27B") return "Afeto leve, saudade boa";
    if (color === "#B39DDB") return "Pensamentos profundos e carinho";
    return "Um sentimento único para hoje 💖";
}

// Variáveis
const selecionadas = new Set();
const container = document.getElementById("imageContainer");
const rosaContainer = document.getElementById("rosaContainer");

// Carregar imagens
carregarImagens().then(imagens => {
    imagens.forEach(img => {
        const wrapper = document.createElement("div");
        wrapper.className = "image-wrapper";

        const el = document.createElement("img");
        el.src = img.src;
        el.alt = img.id;
        el.className = "image-option";

        wrapper.appendChild(el);
        el.setAttribute("draggable", true);

        // Evento para quando iniciar o arraste da imagem
        el.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", img.id);
        });
        el.addEventListener("touchstart", (e) => {
            console.log("Touchstart");
            e.preventDefault(); // Evita comportamento nativo de rolagem em alguns navegadores
            if (!selecionadas.has(img.id) && selecionadas.size < 3) {
                selecionadas.add(img.id);
                const imgSelecionada = img;
        
                // Criar a imagem dentro da rosa e centralizar
                const imgElement = document.createElement("img");
                imgElement.src = imgSelecionada.src;
                imgElement.className = "image-in-rosa";
                imgElement.setAttribute("data-id", img.id);
        
                rosaContainer.appendChild(imgElement);
                atualizarCorRosa();
            }
        });
        

        container.appendChild(wrapper);
    });

    // Evento para a rosa aceitar o "drop"
    rosaContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    rosaContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");

        // Se a imagem não foi selecionada ainda, adicione à rosa
        if (!selecionadas.has(id) && selecionadas.size < 3) {
            selecionadas.add(id);
            const imgSelecionada = imagens.find(img => img.id === id);

            // Criar a imagem dentro da rosa e centralizar
            const imgElement = document.createElement("img");
            imgElement.src = imgSelecionada.src;
            imgElement.className = "image-in-rosa";
            imgElement.setAttribute("data-id", id);

            // Centralizar a imagem dentro da rosa
            rosaContainer.appendChild(imgElement);

            // Atualiza a cor da rosa
            atualizarCorRosa();
        }
    });

    // Evento para permitir clicar na imagem dentro da rosa e desmarcá-la
    rosaContainer.addEventListener("click", (e) => {
        if (e.target.tagName === "IMG" && e.target.classList.contains("image-in-rosa")) {
            const id = e.target.getAttribute("data-id");

            // Remover a imagem da rosa
            e.target.remove();

            // Remover da seleção
            selecionadas.delete(id);

            // Atualiza a cor da rosa
            atualizarCorRosa();
        }
    });
});

// Atualizar rosa no início
window.onload = async () => {
    carregarSVGInicial();
    atualizarHistorico();

    const finalizarBtn = document.getElementById("finalizarBtn");
    finalizarBtn.addEventListener("click", finalizarSelecao);

    // não recuperar imagens por enquanto
    // const imagensCustom = await recuperarTodasImagensPersonalizadas();
    // imagensCustom.forEach(entry => {
    //     const blobURL = URL.createObjectURL(entry.blob);
    //     const img = {
    //         id: entry.id,
    //         src: blobURL,
    //         cor: "#FFD54F",
    //         custom: true
    //     };
    //     imagens.push(img);
    //     renderImagem(img);
    // });

    document.getElementById("fileInput").addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const id = `custom_${Date.now()}`;
        const blobURL = URL.createObjectURL(file);
    
        await salvarImagemPersonalizada(id, file);
    
        let cor = "#FFD54F";
        let colorPicker = document.getElementById("colorPicker").value;
        if (colorPicker && colorPicker !== "") {
            cor = colorPicker;
        }
    
        const novaImagem = {
            id,
            src: blobURL,
            cor,
            custom: true
        };
    
        imagens.push(novaImagem);
        renderImagem(novaImagem);
    
        // Selecionar automaticamente após upload
        if (selecionadas.size < 3) {
            selecionadas.add(id);
            const imgElement = document.createElement("img");
            imgElement.src = blobURL;
            imgElement.className = "image-in-rosa";
            imgElement.setAttribute("data-id", id);
            rosaContainer.appendChild(imgElement);
            atualizarCorRosa();
        }
    });
    
    
    const colorInput = document.getElementById("colorPicker");
    const colorLabel = document.querySelector(".color-picker-label");

    colorInput.addEventListener("input", () => {
        colorLabel.style.backgroundColor = colorInput.value;
    });

    // Inicializa a cor da bolinha
    colorLabel.style.backgroundColor = colorInput.value;


    document.getElementById("infoButton").addEventListener("click", () => {
        const overlay = document.createElement("div");
        overlay.className = "popup-overlay";
    
        const popup = document.createElement("div");
        popup.className = "popup-dia";
    
        const fecharX = document.createElement("button");
        fecharX.className = "fechar-x";
        fecharX.innerHTML = "&times;";
        fecharX.onclick = () => overlay.remove();
    
        const texto = document.createElement("div");
        texto.innerHTML = `
            <h2>Shidoni, for you.</h2>
            <p>For my girlfriend, Ana-chan, i will write this with my small english vocabulary, and no using Google Translator.</p>
            <p>Each image represents a feeling, a memory, or a moment, transformed into a color that tells a story over time.</p>
            <p>Select or take a photo, the day color are the result of your choices.</p>
            <p>My love, don't have one day if i don't think about you, and us, if i play FIFA, or if i am working XD,"Are you mine?" (you most hated AM song)</p>
            <p>I need you, and i love you, don't forget, i want you have all the happiness in the world.</p>
            <p>Today i can say this, i am happy, because you are with me:<br>
            "when she's not right there beside me, I go crazy 'cause here isn't where I wanna be"</p>
            <p>Before, i dreamed with live in USA, or anothe nice country, but... maybe i dont believed so munch.<br>
            Studing Japanese, make me think about Japan, and i dreamed with live there, but...<br>
            Maybe again, i dont believed so munch.<br>
            Work with programming, make me think about again, and again, and again, i started to believe in my dreams, and i started to believe in me.<br>
            And meeting you, make me believe in so much things, believe me.<p>
            <p>In this moment, don't have any thing if i want more than you believe in this words, to this words make you believe in your dreams.<br>
            cause you make i believe more in this dreams, my love. They are not more dreams, they are now, goals.</p>
            <p>"(Do I wanna know) If this feeling flows both ways?", yeah, maybe are you my obsession? :0</p>
            <p>"...and those dreams<br>
            Weren't as daft as they seem<br>
            Not as daft as they seem</p>
            <p>About this gift, i thought about make so much thins, maybe one little game, maybe a unique gift, i start to think in February...</p>
            <p>But i hope you like this, maybe i can update this in the future? XD</p>
            <p>And i hope you like this, and you can use this to remember me, and our moments, or you days.</p>
            <p>Cause, i love you, only this.</p>
            Shalalalaaaaa
        `;
    
        popup.appendChild(fecharX);
        popup.appendChild(texto);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    });
    
};



function renderImagem(img) {
    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";

    const el = document.createElement("img");
    el.src = img.src;
    el.alt = img.id;
    el.className = "image-option";
    wrapper.appendChild(el);
    el.setAttribute("draggable", true);

    el.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", img.id);
    });

    el.addEventListener("touchstart", (e) => {
        console.log("Touchstart2");
        e.preventDefault();
        if (!selecionadas.has(img.id) && selecionadas.size < 3) {
            selecionadas.add(img.id);
            const imgElement = document.createElement("img");
            imgElement.src = img.src;
            imgElement.className = "image-in-rosa";
            imgElement.setAttribute("data-id", img.id);
            rosaContainer.appendChild(imgElement);
            atualizarCorRosa();
        }
    });

    container.appendChild(wrapper);
}









function abrirDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ImagemDB", 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore("imagens", { keyPath: "id" });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function salvarImagemPersonalizada(id, blob) {
    const db = await abrirDB();
    const tx = db.transaction("imagens", "readwrite");
    const store = tx.objectStore("imagens");
    store.put({ id, blob });
}

async function recuperarImagemPersonalizada(id) {
    const db = await abrirDB();
    return new Promise((resolve) => {
        const tx = db.transaction("imagens", "readonly");
        const store = tx.objectStore("imagens");
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result?.blob || null);
    });
}

async function recuperarTodasImagensPersonalizadas() {
    const db = await abrirDB();
    return new Promise((resolve) => {
        const tx = db.transaction("imagens", "readonly");
        const store = tx.objectStore("imagens");
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
    });
}
