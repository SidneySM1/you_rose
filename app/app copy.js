// app/app.js

const imagens = [
    { id: "img1", src: "app/images/1.jpg", cor: "#4FC3F7" },
    { id: "img2", src: "app/images/2.jpg", cor: "#A5D6A7" }
];

// Carregar imagens de app/images.json
async function carregarImagens() {
    // const imagens = await fetch("app/images.json").then(res => res.json());
    const imagens = [
        { id: "img1", src: "app/images/1.jpg", cor: "#4FC3F7" },
        { id: "img2", src: "app/images/2.jpg", cor: "#A5D6A7" }
    ];
    return imagens;
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
    fetch("App/files/rose.svg")
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
    historico.innerHTML = "<h2>Histórico</h2>";
    Object.keys(localStorage).sort().reverse().forEach(data => {
        const reg = JSON.parse(localStorage.getItem(data));
        const dia = document.createElement("div");
        dia.className = "history-day";

        const btn = document.createElement("button");
        btn.className = "show-images";
        btn.textContent = "Ver imagens";
        btn.onclick = () => mostrarImagensSelecionadas(dia, reg.imagens);

        dia.innerHTML = `
            <div class='color-box' style='background-color:${reg.cor}'></div>
            <div>${data} - ${reg.anotacao}</div>
        `;        
        dia.appendChild(btn);
        historico.appendChild(dia);
    });
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
            const arquivo = await obterImagemPersonalizada(imgRef.id);
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
    captionText.innerHTML = "Imagem de hoje"; // Ou qualquer legenda que você queira

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
    res.innerHTML = `<h2>Cor de hoje</h2><p>${cor}</p><p>${anotacao}</p>`;

    // Atualizar rosa
    const rosa = document.getElementById("rosaContainer");
    fetch("App/files/rose.svg")
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
