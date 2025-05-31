const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state variables
let score = 0;
let lives = 3;
let gameOver = false;
let gameRunning = true;

// Player properties
const player = {
  x: 100,
  y: canvas.height - 100,
  width: 40, // Slightly adjusted size
  height: 60, // Taller than wide
  color: '#00DD00', // Greenish color
  eyeColor: 'white',
  pupilColor: 'black',
  dy: 0,
  jumpStrength: 16, // Slightly stronger jump
  gravity: 0.8,
  grounded: true,
  initialX: 100,
  initialY: canvas.height - 60 // Adjusted for new height
};

const gameSpeed = 5;

const keys = {
  space: false,
  enter: false
};

// Floating text for score pop-ups
const floatingTexts = [];

document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    keys.space = true;
  }
  if (e.code === 'Enter') {
    keys.enter = true;
  }
});

document.addEventListener('keyup', function(e) {
  if (e.code === 'Space') {
    keys.space = false;
  }
  if (e.code === 'Enter') {
    keys.enter = false;
  }
});

// Background elements
const backgroundElements = [];
const numBackgroundElements = 10;
const backgroundSpeedFactor = 0.5;

function initBackground() {
  backgroundElements.length = 0;
  for (let i = 0; i < numBackgroundElements; i++) {
    backgroundElements.push({
      x: Math.random() * canvas.width * 2,
      y: Math.random() * (canvas.height - 200),
      width: Math.random() * 60 + 30, // Slightly larger
      height: Math.random() * 40 + 20, // Slightly larger
      color: `rgba(180, 180, 220, ${Math.random() * 0.4 + 0.2})` // Lavender-ish
    });
  }
}

function updateBackground() {
  if (!gameRunning) return;
  backgroundElements.forEach(element => {
    element.x -= gameSpeed * backgroundSpeedFactor;
    if (element.x + element.width < 0) {
      element.x = canvas.width + Math.random() * (canvas.width / 2);
      element.y = Math.random() * (canvas.height - 200);
    }
  });
}

function drawBackground() {
  backgroundElements.forEach(element => {
    ctx.fillStyle = element.color;
    ctx.fillRect(element.x, element.y, element.width, element.height);
  });
}

// Obstacles
const obstacles = [];
const obstacleFrequency = 110; // Slightly more frequent
let obstacleFrameCount = 0;
const obstacleColors = ['#FF6347', '#FF4500', '#CD5C5C']; // Tomato, OrangeRed, IndianRed

function spawnObstacle() {
  const minHeight = 40;
  const maxHeight = 120;
  const height = Math.random() * (maxHeight - minHeight) + minHeight;
  const width = Math.random() * 25 + 20;
  const color = obstacleColors[Math.floor(Math.random() * obstacleColors.length)];
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: width,
    height: height,
    color: color
  });
}

function updateObstacles() {
  if (!gameRunning) return;
  obstacleFrameCount++;
  if (obstacleFrameCount % obstacleFrequency === 0) {
    spawnObstacle();
  }

  obstacles.forEach((obstacle, index) => {
    obstacle.x -= gameSpeed;

    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
    }

    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      obstacles.splice(index, 1);
      lives--;
      console.log('SOUND: Obstacle Hit'); // Sound placeholder
      if (lives <= 0) {
        gameOver = true;
        gameRunning = false;
        console.log('SOUND: Game Over'); // Sound placeholder
      }
    }
  });
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    // Simple detail
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(obstacle.x + obstacle.width * 0.2, obstacle.y + obstacle.height * 0.2, obstacle.width * 0.6, obstacle.height * 0.6);
  });
}

// Collectibles
const collectibles = [];
const collectibleFrequency = 160;
let collectibleFrameCount = 0;
const collectibleSize = 25; // Slightly larger

function spawnCollectible() {
  const collectibleYPosition = Math.random() * (canvas.height - player.height - collectibleSize - 120) + 60;
  collectibles.push({
    x: canvas.width,
    y: collectibleYPosition,
    width: collectibleSize,
    height: collectibleSize,
    color: '#FFD700', // Brighter gold
    points: 10
  });
}

function updateCollectibles() {
  if (!gameRunning) return;
  collectibleFrameCount++;
  if (collectibleFrameCount % collectibleFrequency === 0) {
    spawnCollectible();
  }

  collectibles.forEach((collectible, index) => {
    collectible.x -= gameSpeed;

    if (collectible.x + collectible.width < 0) {
      collectibles.splice(index, 1);
    }

    if (
      player.x < collectible.x + collectible.width &&
      player.x + player.width > collectible.x &&
      player.y < collectible.y + collectible.height &&
      player.y + player.height > collectible.y
    ) {
      score += collectible.points;
      console.log('SOUND: Collectible Pickup'); // Sound placeholder
      // Add floating text for score
      floatingTexts.push({
        text: `+${collectible.points}`,
        x: collectible.x,
        y: collectible.y,
        alpha: 1.0,
        duration: 60 // frames
      });
      collectibles.splice(index, 1);
    }
  });
}

function drawCollectibles() {
  collectibles.forEach(collectible => {
    ctx.fillStyle = collectible.color;
    ctx.beginPath();
    ctx.arc(collectible.x + collectible.width / 2, collectible.y + collectible.height / 2, collectible.width / 2, 0, Math.PI * 2);
    ctx.fill();
    // Shine effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(collectible.x + collectible.width / 2 + 3, collectible.y + collectible.height / 2 - 3, collectible.width / 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Update and draw floating texts
function updateFloatingTexts() {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y -= 0.5; // Move upwards
        ft.alpha -= (1.0 / ft.duration);
        ft.duration--;
        if (ft.alpha <= 0 || ft.duration <=0) {
            floatingTexts.splice(i, 1);
        }
    }
}

function drawFloatingTexts() {
    floatingTexts.forEach(ft => {
        ctx.fillStyle = `rgba(255, 255, 0, ${ft.alpha})`; // Yellow, fading out
        ctx.font = '18px Arial';
        ctx.fillText(ft.text, ft.x, ft.y);
    });
}


function updatePlayer() {
  if (!gameRunning) return;
  if (keys.space && player.grounded) {
    player.dy = -player.jumpStrength;
    player.grounded = false;
    console.log('SOUND: Player Jump'); // Sound placeholder
  }

  player.dy += player.gravity;
  player.y += player.dy;

  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.grounded = true;
  }
  if (player.y < 0) {
    player.y = 0;
    player.dy = 0;
  }
}

function drawPlayer() {
  // Body
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Eye
  const eyeX = player.x + player.width * 0.6;
  const eyeY = player.y + player.height * 0.3;
  const eyeRadius = player.width * 0.15;
  ctx.fillStyle = player.eyeColor;
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Pupil
  const pupilRadius = eyeRadius * 0.5;
  ctx.fillStyle = player.pupilColor;
  ctx.beginPath();
  ctx.arc(eyeX + pupilRadius*0.3, eyeY, pupilRadius, 0, Math.PI * 2); // Slightly looking forward
  ctx.fill();
}

function drawUI() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial'; // Larger font
  ctx.fillText('Score: ' + score, 15, 35);
  ctx.fillText('Lives: ' + lives, canvas.width - 100, 35);

  if (gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '48px Arial Black';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '28px Arial';
    ctx.fillText('Your Score: ' + score, canvas.width / 2, canvas.height / 2 + 10);
    ctx.font = '22px Arial';
    ctx.fillText('Press ENTER to Restart', canvas.width / 2, canvas.height / 2 + 60);
    ctx.textAlign = 'left';
  }
}

function resetGame() {
  score = 0;
  lives = 3;
  gameOver = false;
  gameRunning = true;

  player.x = player.initialX;
  player.y = player.initialY;
  player.dy = 0;
  player.grounded = true;

  obstacles.length = 0;
  collectibles.length = 0;
  floatingTexts.length = 0; // Clear floating texts
  obstacleFrameCount = 0;
  collectibleFrameCount = 0;

  initBackground();
  console.log("Game Reset!");
}

function gameLoop() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameRunning) {
    updateBackground();
    updatePlayer();
    updateObstacles();
    updateCollectibles();
    updateFloatingTexts();
  } else if (gameOver && keys.enter) {
    resetGame();
  }

  drawBackground();
  drawPlayer();
  drawObstacles();
  drawCollectibles();
  drawFloatingTexts();
  drawUI();

  requestAnimationFrame(gameLoop);
}

initBackground();
gameLoop();
