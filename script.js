document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const birdImage = new Image();
  birdImage.src = 'bird.jpg';
  let birdGravity = 0;
  let birdY = canvas.height / 2;
  let birdHeight = 55;
  let birdWidth = 55;

  let pipeWidth = 50;
  let pipeArray = [];
  let score = 0;
  const drawScore = () => {
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 10, 30);
}

const drawBird = () => {
    ctx.drawImage(birdImage, canvas.width / 2, birdY, birdWidth, birdHeight);
  }

  const drawPipe = (pipe) => {
    ctx.fillStyle = 'green';
    const { topPipeHeight, bottomPipeHeight, x } = pipe;
    ctx.fillRect(x, 0, pipeWidth, topPipeHeight);
    ctx.fillRect(x, canvas.height - bottomPipeHeight, pipeWidth, bottomPipeHeight);
  }

  const createPipes = () => {
    const gapHeight = Math.floor(Math.random() * 100) + 100;
    const topPipeHeight = Math.floor(Math.random() * (canvas.height - gapHeight));
    const bottomPipeHeight = canvas.height - gapHeight - topPipeHeight;
    pipeArray.push({ topPipeHeight, bottomPipeHeight, x: canvas.width });
  }

  const movePipes = () => {
    for (let i = 0; i < pipeArray.length; i++) {
      const pipe = pipeArray[i];
      drawPipe(pipe);

      // If the pipe is completely to the left of the bird, increment score.
      if (pipe.x + pipeWidth < canvas.width / 2) {
        if (!pipe.counted) { // If the pipe has not already been counted.
          score++;
          pipe.counted = true; // Mark the pipe as counted.
        }
      }

      if (pipe.x + pipeWidth < 0) {
        pipeArray.splice(i, 1);
      } else {
        pipe.x -= 2;
      }
    }
  }


  const checkCollision = () => {
    const birdBox = { left: canvas.width / 2, right: canvas.width / 2 + birdWidth, top: birdY, bottom: birdY + birdHeight };
    for (let pipe of pipeArray) {
      const pipeBoxTop = { left: pipe.x, right: pipe.x + pipeWidth, top: 0, bottom: pipe.topPipeHeight };
      const pipeBoxBottom = { left: pipe.x, right: pipe.x + pipeWidth, top: canvas.height - pipe.bottomPipeHeight, bottom: canvas.height };
      if (intersectRect(birdBox, pipeBoxTop) || intersectRect(birdBox, pipeBoxBottom)) {
        return true;
      }
    }
    return false;
  }

  const intersectRect = (r1, r2) => {
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
  }

  const jump = () => birdGravity = -6;

  const gameOver = () => {
    clearInterval(gameInterval);
    alert('Game Over!');
  }
  const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    birdGravity += 0.5;
    birdY += birdGravity;
    drawBird();
    if (birdY < 0) birdY = 0;
    if (birdY > canvas.height - birdHeight || checkCollision()) gameOver();
    movePipes();
    drawScore(); // draw the score
  }


  document.addEventListener('keydown', (event) => event.code === 'Space' && jump());

  const gameInterval = setInterval(gameLoop, 20);
  setInterval(createPipes, 2000);
});
