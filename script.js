import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

/* 🔥 CONFIG DO SEU PROJETO */
const firebaseConfig = {
  apiKey: "SUA_KEY_AQUI",
  authDomain: "mangaka-68a0b.firebaseapp.com",
  projectId: "mangaka-68a0b",
  storageBucket: "mangaka-68a0b.firebasestorage.app",
  messagingSenderId: "541880386644",
  appId: "1:541880386644:web:803a6789e8ccc5938619c1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

/* 🔐 LOGIN */
window.loginGoogle = async function () {
  await signInWithPopup(auth, provider);
};

/* 🚪 LOGOUT */
window.logoutGoogle = async function () {
  await signOut(auth);
};

/* UI LOGIN */
function atualizarUI(user) {
  const area = document.querySelector(".login-area");

  if (user) {
    area.innerHTML = `
      <img src="${user.photoURL}" width="30" style="border-radius:50%">
      <span>${user.displayName}</span>
      <button onclick="logoutGoogle()">Sair</button>
    `;
  } else {
    area.innerHTML = `
      <button onclick="loginGoogle()">Login com Google</button>
    `;
  }
}

/* OBSERVAR LOGIN */
onAuthStateChanged(auth, (user) => {
  atualizarUI(user);

  if (user) {
    salvarUsuario(user);
  }
});

/* SALVAR USUÁRIO */
async function salvarUsuario(user) {
  await setDoc(doc(db, "usuarios", user.uid), {
    nome: user.displayName,
    email: user.email,
    foto: user.photoURL
  }, { merge: true });
}

/* 🔍 BUSCAR ANIME */
window.buscarAnime = async function () {
  const nome = document.getElementById("searchInput").value;

  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${nome}`);
  const data = await res.json();

  mostrarAnimes(data.data);
};

/* 🎴 MOSTRAR */
function mostrarAnimes(animes) {
  const lista = document.getElementById("animeList");
  lista.innerHTML = "";

  animes.forEach(anime => {

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}">
      <h3>${anime.title}</h3>
      <button onclick="favoritar(${anime.mal_id}, '${anime.title}', '${anime.images.jpg.image_url}')">
        ⭐ Favoritar
      </button>
    `;

    lista.appendChild(card);
  });
}

/* ⭐ FAVORITOS */
window.favoritar = async function (id, titulo, imagem) {
  const user = auth.currentUser;

  if (!user) {
    alert("Faça login!");
    return;
  }

  await setDoc(doc(db, "usuarios", user.uid, "favoritos", String(id)), {
    titulo,
    imagem
  });

  alert("Favoritado!");
};