const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;
document.getElementById("game-area").appendChild(canvas);

// Variables globales
let player = { x: 180, y: 500, width: 40, height: 40, color: "blue" };
let lanes = [80, 180, 280]; // Positions des voies
let currentLane = 1; // Index de la voie actuelle
let obstacles = []; // Tableau des obstacles
let speed = 5; // Vitesse du défilement
let score = 0;
let gameOver = false; // Indicateur de Game Over
let restartButton = null; // Bouton "Rejouer"
let paused = false; // Etat de pause
let obstacleColor = 'red'; // Couleur initiale des obstacles
let obstacleShape = 'rectangle'; // Forme initiale
let obstacleInterval;


// Générer des obstacles aléatoires
function generateObstacle() {
    if (!gameOver && !paused) { // ➡️ Ne crée PAS d'obstacles si le jeu est en pause
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      obstacles.push({ 
        x: lane, 
        y: -50, 
        width: 40, 
        height: 40
      });    }
  }

// Dessiner un rectangle
function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}
function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  function drawTriangle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + width/2, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.closePath();
    ctx.fill();
  }
  
  function drawStar(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(
        x + radius * Math.cos((18 + i * 72) * Math.PI / 180),
        y - radius * Math.sin((18 + i * 72) * Math.PI / 180)
      );
      ctx.lineTo(
        x + (radius/2) * Math.cos((54 + i * 72) * Math.PI / 180),
        y - (radius/2) * Math.sin((54 + i * 72) * Math.PI / 180)
      );
    }
    ctx.closePath();
    ctx.fill();
  }
  

// Gérer le Game Over et afficher le bouton "Rejouer"
function handleGameOver() {
    if (gameOver || paused) return; // Évite d'afficher plusieurs fois le bouton
  gameOver = true;

  // Afficher un message Game Over
  alert(`Game Over! Score: ${score}`);

  // Créer le bouton "Rejouer"
  restartButton = document.createElement("button");
  restartButton.innerText = "Rejouer";
  restartButton.style.position = "absolute";
  restartButton.style.top = "50%";
  restartButton.style.left = "50%";
  restartButton.style.transform = "translate(-50%, -50%)";
  restartButton.style.padding = "10px 20px";
  restartButton.style.fontSize = "18px";
  restartButton.style.background = "#FF5733";
  restartButton.style.color = "white";
  restartButton.style.border = "none";
  restartButton.style.cursor = "pointer";

  document.body.appendChild(restartButton);

  // Gérer le clic pour recommencer
  restartButton.addEventListener("click", resetGame);
}

// Réinitialiser le jeu
function resetGame() {
  // Supprimer le bouton "Rejouer"
  if (restartButton) {
    document.body.removeChild(restartButton);
    restartButton = null;
  }
  clearInterval(obstacleInterval);

  // Réinitialiser les variables
  player.x = 180;
  player.y = 500;
  obstacles = [];
  score = 0;
  speed = 5;
  gameOver = false;
  
  startGame();

  // Relancer le jeu
  startButton.addEventListener("click", () => {
    menu.style.display = "none"; // Cacher le menu
    startGame(); // Lancer le jeu
});

}

// Dessiner le jeu
function drawGame() {
  if (gameOver) return; // Arrêter la boucle si le jeu est terminé

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner le joueur
  drawRect(player.x, player.y, player.width, player.height, player.color);

  // Dessiner les obstacles
  obstacles.forEach((obstacle, index) => {
    if (!paused) {
      obstacle.y += speed;
    }

    if (obstacleShape === "rectangle") {
        drawRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacleColor);
    } else if (obstacleShape === "circle") {
        drawCircle(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2, obstacleColor);
    } else if (obstacleShape === "triangle") {
        drawTriangle(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacleColor);
    } else if (obstacleShape === "star") {
        drawStar(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2, obstacleColor);
    }
    
    // Vérifier la collision
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      handleGameOver(); // Gérer le Game Over
    }

    // Supprimer les obstacles hors écran
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
      score += 1; // Augmenter le score
    }
  });

  // Afficher le score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);

  requestAnimationFrame(drawGame); // Boucle d'animation
}

// Gérer le changement de voie
window.addEventListener("keydown", (event) => {
    if (gameOver) return;
  
    // Gestion de la touche Pause
    if (event.key === "p" || event.key === "P") {
      paused = !paused;
      if (!paused) {
        drawGame();
      }
      return;
    }
  
    // Bloquer déplacement si en pause
    if (paused) return;
  
    if (event.key === "ArrowLeft" && currentLane > 0) {
      currentLane -= 1;
      player.x = lanes[currentLane];
    }
    if (event.key === "ArrowRight" && currentLane < lanes.length - 1) {
      currentLane += 1;
      player.x = lanes[currentLane];
    }
  });
  

// Initialiser l'éditeur de code
const editor = document.getElementById("editor");
const menu = document.getElementById("menu");
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", () => {
    menu.style.display = "none"; // ➡️ Cacher le menu
    startGame(); // ➡️ Lancer le jeu
});


editor.value = `
// Modifiez ces paramètres :
player.color = 'green'; // Couleur du joueur
player.width = 50; // Largeur du joueur
player.height = 50; // Hauteur du joueur
speed = 7; // Vitesse du défilement
lanes = [70, 170, 270]; // Positions des voies
obstacleColor = 'red'; // Couleur des obstacles
obstacleShape = 'rectangle'; // Forme : 'rectangle', 'circle', 'triangle', 'star'
`;

// Appliquer les modifications en temps réel
editor.addEventListener("input", () => {
  if (!gameOver) {
    try {
      eval(editor.value); // Exécuter le code de l'utilisateur
    } catch (error) {
      console.error("Erreur dans le code utilisateur :", error);
    }
  }
});

// Lancer le jeu
function startGame() {
    obstacleInterval = setInterval(generateObstacle, 1500);
    drawGame();
  }
  


