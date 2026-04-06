// ===== LINK DO JOGO =====
let linkJogo = "https://play.google.com/store/apps/details?id=com.farlightgames.samo.gp";

function abrirJogo() {
    window.open(linkJogo, "_blank");
}

// ===== TROCAR PÁGINA =====
function trocarPagina(id) {

    // troca conteúdo
    document.querySelectorAll(".pagina").forEach(p => p.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");

    // menu ativo
    document.querySelectorAll(".menu a").forEach(a => a.classList.remove("ativo"));
    event.target.classList.add("ativo");

    // SOCIAL aparece só no início
    const social = document.querySelector(".social-box");
    social.style.display = (id === "inicio") ? "block" : "none";
}

// ===== LOGIN =====
function login() {
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    if (user === "admin" && pass === "1234") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("painel").style.display = "block";

        carregarDados();
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

// ===== CARREGAR DADOS =====
function carregarDados() {

    let dados = localStorage.getItem("hierarquia");

    if (!dados) {
        dados = JSON.stringify({
            lider: "Nome do líder",
            erudito: "Nome do jogador",
            guerra: "Nome do jogador",
            emissario: "Nome do jogador",
            feras: "Nome do jogador"
        }, null, 2);
    }

    document.getElementById("dadosRanking").value = dados;
}

// ===== SALVAR =====
function salvarRanking() {
    const texto = document.getElementById("dadosRanking").value;

    try {
        const novo = JSON.parse(texto);

        localStorage.setItem("hierarquia", texto);

        aplicarDados(novo);

        alert("Atualizado com sucesso!");
        location.reload(); // recarrega e fecha admin

    } catch (e) {
        alert("Erro! JSON inválido.");
    }
}

// ===== APLICAR DADOS NA TELA =====
function aplicarDados(dados) {

    document.querySelectorAll(".cargo")[1].querySelector(".nome").innerText = dados.lider;
    document.querySelectorAll(".cargo")[0].querySelector(".nome").innerText = dados.erudito;
    document.querySelectorAll(".cargo")[2].querySelector(".nome").innerText = dados.guerra;
    document.querySelectorAll(".cargo")[3].querySelector(".nome").innerText = dados.emissario;
    document.querySelectorAll(".cargo")[4].querySelector(".nome").innerText = dados.feras;
}

// ===== INICIAR =====
window.onload = function() {

    // reset admin sempre
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("painel").style.display = "none";

    const social = document.querySelector(".social-box");
    social.style.display = "block";

    let dados = localStorage.getItem("hierarquia");

    if (dados) {
        aplicarDados(JSON.parse(dados));
    }
};