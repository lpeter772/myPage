const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const convasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpped = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let count = 0;

// min, max
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min)); // 0-400
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

// 製作所有的brick, 0 <= x <= 950 , 0 <= y <= 550, 10的倍數
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 550));
}

c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX - 100;
});

function drawCircle() {
  // 確認球是否有打到磚塊
  brickArray.forEach((brick, index) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      // 改變x, y方向速度，並且將brick從brickArray中移除
      // 從下方撞擊
      if (circle_y >= brick.x + brick.height) {
        ySpeed *= -1; // 反向彈回
      }
      // 從上方撞擊
      else if (circle_y <= brick.y) {
        ySpeed *= -1; // 反向彈回
      }
      // 從左方撞擊
      else if (circle_x <= brick.x) {
        xSpped *= -1;
      }
      // 從右方撞擊
      else if (circle_x >= brick.x + brick.width) {
        xSpped *= -1;
      }

      //   brickArray.splice(index, 1);
      if (count == 10) {
        alert("遊戲結束");
        clearInterval(game);
      }
    }
  });

  // 確認球有沒有打到橘色地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }
  // 確認球有沒有打到邊界
  // 確認右邊邊界
  if (circle_x >= convasWidth - radius) {
    xSpped *= -1;
  }
  // 確認左邊邊界
  if (circle_x <= radius) {
    xSpped *= -1;
  }
  // 確認上邊邊界
  if (circle_y <= radius) {
    ySpeed *= -1;
  }
  // 確認下邊邊界
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
  }
  // 更動圓的座標
  circle_x += xSpped;
  circle_y += ySpeed;

  // 畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, convasWidth, canvasHeight);

  // 畫出所有的bricks
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // 畫出可控制的地板
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  // 畫出圓球
  // x, y(圓心座標), radius, startAngle, endAngle
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}
let game = setInterval(drawCircle, 25);
