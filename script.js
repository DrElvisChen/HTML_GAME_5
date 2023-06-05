document.addEventListener('DOMContentLoaded', function () {
   var gameContainer = document.getElementById('gameContainer');
   var bird = document.getElementById('bird');
   var pipeContainer = document.getElementById('pipeContainer');

   var birdGravity = 0;
   var birdY = 250;
   var birdHeight = 30;
   var birdWidth = 30;

   var pipeWidth = 50;
   var pipeDistance = 500;
   var pipeArray = [];
   var score = 0;
   var scoreDisplay = document.createElement('div');
   
   scoreDisplay.style.position = 'fixed';
   scoreDisplay.style.top = '10px';
   scoreDisplay.style.left = '10px';
   scoreDisplay.style.fontSize = '20px';
   scoreDisplay.style.color = '#000';
   gameContainer.appendChild(scoreDisplay);

   function createPipes() {
      var topPipe = document.createElement('div');
      var bottomPipe = document.createElement('div');

      topPipe.className = 'pipe';
      bottomPipe.className = 'pipe';

      var gapHeight = Math.floor(Math.random() * 100) + 100;
      var topPipeHeight = Math.floor(Math.random() * (gameContainer.offsetHeight - gapHeight));
      var bottomPipeHeight = gameContainer.offsetHeight - gapHeight - topPipeHeight;

      topPipe.style.height = `${topPipeHeight}px`;
      bottomPipe.style.height = `${bottomPipeHeight}px`;

      topPipe.style.top = '0';
      bottomPipe.style.bottom = '0';

      // Position pipes on the right side of the container
      topPipe.style.right = '0px';
      bottomPipe.style.right = '0px';

      pipeContainer.appendChild(topPipe);
      pipeContainer.appendChild(bottomPipe);

      pipeArray.push(topPipe);
      pipeArray.push(bottomPipe);
   }

   function movePipes() {
      for (var i = 0; i < pipeArray.length; i++) {
         var pipe = pipeArray[i];
         var pipeRightPosition = parseInt(pipe.style.right);
         if (pipeRightPosition > gameContainer.offsetWidth) {
            pipeContainer.removeChild(pipe);
            pipeArray.splice(i, 1);

            // Check if the pipe is the upper pipe of a pair (it's at an even index in the array)
            if (i % 2 === 0) {
               // Increment and display the score
               score++;
               scoreDisplay.innerText = 'Score: ' + score;
            }
         } else {
            pipe.style.right = `${pipeRightPosition + 2}px`;
         }
      }
   }

   function jump() {
      birdGravity = -6;
   }

   function checkCollision() {
      var birdBox = bird.getBoundingClientRect();
      for (var i = 0; i < pipeArray.length; i++) {
         var pipeBox = pipeArray[i].getBoundingClientRect();

         if (birdBox.left < pipeBox.right &&
            birdBox.right > pipeBox.left &&
            birdBox.top < pipeBox.bottom &&
            birdBox.bottom > pipeBox.top) {
            return true;
         }
      }
      return false;
   }

   function gameOver() {
      clearInterval(gameInterval);
      alert('Game Over!');
   }

   function gameLoop() {
      birdGravity += 0.5;
      birdY += birdGravity;
      bird.style.top = birdY + "px";

      if (birdY < 0) {
         birdY = 0;
      }

      if (birdY > gameContainer.offsetHeight - birdHeight) {
         gameOver();
      }

      if (checkCollision()) {
         gameOver();
      }

      movePipes();
   }

   document.addEventListener('keydown', function (event) {
      if (event.code === 'Space') {
         jump();
      }
   });

   var gameInterval = setInterval(gameLoop, 20);
   setInterval(createPipes, 2000);
});
