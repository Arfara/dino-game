import React, { useEffect, useRef } from 'react';

const DinoGame = () => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const dino = useRef({ x: 50, y: 300, width: 100, height: 100, isJumping: false, velocity: 0 });
  const obstacle = useRef({ x: 1000, y: 200, width: 250, height: 300 });
  const gravity = 0.6;
  const jumpSpeed = 20;
  const dinoImage = useRef(new Image());
  const obstacleImage = useRef(new Image());

  const handleKeyDown = (e) => {
    if (e.key === ' ' && !dino.current.isJumping) {
      dino.current.isJumping = true;
      dino.current.velocity = jumpSpeed;
    }
  };

  const update = () => {
    // Update dino
    if (dino.current.isJumping) {
      dino.current.velocity -= gravity;
      dino.current.y -= dino.current.velocity;
      if (dino.current.y >= 300) {
        dino.current.y = 300;
        dino.current.isJumping = false;
        dino.current.velocity = 0;
      }
    }

    // Update obstacle
    obstacle.current.x -= 10;
    if (obstacle.current.x < -obstacle.current.width) {
      obstacle.current.x = canvasRef.current.width;
    }

    // Check for collision
    if (
      dino.current.x < obstacle.current.x + obstacle.current.width &&
      dino.current.x + dino.current.width > obstacle.current.x &&
      dino.current.y < obstacle.current.y + obstacle.current.height &&
      dino.current.y + dino.current.height > obstacle.current.y
    ) {
      // Reset game on collision
      dino.current.y = 300;
      obstacle.current.x = canvasRef.current.width;
    }
  };

  const draw = (ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw dino
    ctx.drawImage(dinoImage.current, dino.current.x, dino.current.y, dino.current.width, dino.current.height);

    // Draw obstacle
    ctx.drawImage(obstacleImage.current, obstacle.current.x, obstacle.current.y, obstacle.current.width, obstacle.current.height);
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    update();
    draw(ctx);

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    dinoImage.current.src = process.env.PUBLIC_URL + '/Dino.png'; // Load Dino image
    obstacleImage.current.src = process.env.PUBLIC_URL + '/arfara.png'; // Load obstacle image
    dinoImage.current.onload = () => {
      requestRef.current = requestAnimationFrame(gameLoop);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <canvas ref={canvasRef} width="1000" height="400" style={{ border: '1px solid black' }} />
    </div>
  );
};

export default DinoGame;
