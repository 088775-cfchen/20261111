let idleSheet; // 儲存角色 1 的站立動畫精靈圖。
let runSheet; // 儲存角色 1 的跑步動畫精靈圖。
let backgroundImage; // 儲存填滿畫布的背景圖片。
let character2StopSheet; // 儲存角色 2 的站立動畫精靈圖。
let character2CorrectSheet; // 儲存角色 2 答對時的動畫精靈圖。
let character2IncorrectSheet; // 儲存角色 2 答錯時的動畫精靈圖。
let playerX; // 儲存角色 1 的水平中心位置。
let facing = 1; // 記錄角色 1 的朝向，1 代表右方，-1 代表左方。
let wasRunning = false; // 記錄角色 1 上一個畫面是否正在跑步。
let runStartFrame = 0; // 記錄角色 1 本次跑步動畫開始的畫面編號。
let questionActive = false; // 記錄目前是否正在顯示選擇題。
let hasAnswered = false; // 記錄角色 1 靠近後是否已經回答問題。
let answerCorrect = false; // 記錄目前這次作答是否正確。
let quizFirstNumber = 0; // 儲存隨機加法題的第一個數字。
let quizSecondNumber = 0; // 儲存隨機加法題的第二個數字。
let quizOptions = []; // 儲存選擇題的四個答案選項。
const playerSpeed = 4; // 設定角色 1 每一影格的移動速度。
const idleFrameCount = 14; // 設定角色 1 站立動畫的影格總數。
const runFrameCount = 12; // 設定角色 1 跑步動畫的影格總數。
const playerScale = 2; // 設定角色 1 的原圖寬度與高度放大倍率。
const character2Scale = 5; // 設定角色 2 的原圖寬度與高度放大倍率。
const character2StopFrameCount = 5; // 設定角色 2 站立動畫的影格總數。
const character2CorrectFrameCount = 12; // 設定角色 2 答對動畫的影格總數。
const character2IncorrectFrameCount = 6; // 設定角色 2 答錯動畫的影格總數。
const interactionGap = 40; // 設定兩個角色外緣相隔多少像素時觸發互動。

function preload() { // 在畫布啟動前載入所有角色與背景圖片。
  idleSheet = loadImage("1/stop/stop.png"); // 載入角色 1 的 14 格站立動畫。
  runSheet = loadImage("1/run/run.png"); // 載入角色 1 的 12 格跑步動畫。
  backgroundImage = loadImage("bg/bg2.png"); // 載入 bg 資料夾中的 bg2.png 背景圖片。
  character2StopSheet = loadImage("2/stop/stop.png"); // 載入角色 2 的 5 格站立動畫。
  character2CorrectSheet = loadImage("2/correct/correct.png"); // 載入角色 2 的 12 格答對動畫。
  character2IncorrectSheet = loadImage("2/incorrect/incorrect.png"); // 載入角色 2 的 6 格答錯動畫。
} // 結束圖片載入函式。

function setup() { // 建立全螢幕畫布並設定角色初始位置。
  createCanvas(windowWidth, windowHeight); // 建立符合視窗尺寸的畫布。
  playerX = width * 2 / 3; // 將角色 1 初始放在畫布寬度的三分之二位置。
  imageMode(CORNER); // 使用圖片左上角作為繪圖定位基準。
  frameRate(60); // 將動畫更新速率設定為每秒 60 張。
} // 結束畫布初始化函式。

function draw() { // 每一影格更新角色、互動狀態與畫面。
  image(backgroundImage, 0, 0, width, height); // 將背景圖片拉伸至填滿整個畫布。

  let isRunning = false; // 預設角色 1 目前沒有移動。
  if (!questionActive && keyIsDown(RIGHT_ARROW)) { // 題目未顯示且按住右方向鍵時執行右移。
    playerX += playerSpeed; // 讓角色 1 向右移動。
    facing = 1; // 讓角色 1 面向右方。
    isRunning = true; // 切換角色 1 至跑步動畫。
  } else if (!questionActive && keyIsDown(LEFT_ARROW)) { // 題目未顯示且按住左方向鍵時執行左移。
    playerX -= playerSpeed; // 讓角色 1 向左移動。
    facing = -1; // 讓角色 1 面向左方。
    isRunning = true; // 切換角色 1 至跑步動畫。
  } // 結束角色 1 的方向鍵判斷。

  if (isRunning && !wasRunning) { // 偵測角色 1 剛開始跑步的時刻。
    runStartFrame = frameCount; // 記下跑步動畫起始影格，讓動畫從第一格開始。
  } // 結束跑步動畫起始判斷。
  wasRunning = isRunning; // 記錄目前移動狀態，供下一影格判斷跑步是否重新開始。

  let playerSheet = isRunning ? runSheet : idleSheet; // 根據角色 1 的移動狀態選擇精靈圖。
  let playerFrameCount = isRunning ? runFrameCount : idleFrameCount; // 取得角色 1 目前動畫的影格數。
  let playerFrameWidth = playerSheet.width / playerFrameCount; // 計算角色 1 單一動畫影格的寬度。
  let playerFrameIndex = getPlayerFrameIndex(isRunning); // 取得角色 1 目前要顯示的動畫影格。
  let playerDisplayWidth = playerFrameWidth * playerScale; // 將角色 1 單一影格的原始寬度放大兩倍。
  let playerDisplayHeight = playerSheet.height * playerScale; // 將角色 1 單一影格的原始高度放大兩倍。
  playerX = constrain(playerX, min(playerDisplayWidth / 2, width / 2), max(width - playerDisplayWidth / 2, width / 2)); // 限制角色 1 在畫布範圍內移動。

  let character2X = width / 3; // 將角色 2 的中心位置固定在畫布寬度的三分之一。
  let playerMaxWidth = max(idleSheet.width / idleFrameCount, runSheet.width / runFrameCount) * playerScale; // 依角色 1 最寬的動畫影格計算放大後寬度。
  let character2MaxWidth = max(character2StopSheet.width / character2StopFrameCount, character2CorrectSheet.width / character2CorrectFrameCount, character2IncorrectSheet.width / character2IncorrectFrameCount) * character2Scale; // 依角色 2 最寬的動畫影格計算放大後寬度。
  let interactionDistance = (playerMaxWidth + character2MaxWidth) / 2 + interactionGap; // 依兩個角色的顯示寬度與外緣間距計算互動距離。
  let isNear = abs(playerX - character2X) <= interactionDistance; // 角色外緣接近設定間距時觸發互動。
  if (!isNear) { // 角色 1 離開角色 2 附近時重設本次互動狀態。
    questionActive = false; // 關閉可能仍顯示的題目。
    hasAnswered = false; // 清除已作答狀態，讓下次靠近能重新出題。
    answerCorrect = false; // 清除上次作答結果。
  } else if (!questionActive && !hasAnswered) { // 角色 1 靠近且本次互動尚未出題時建立新題目。
    createQuizQuestion(); // 產生隨機加法選擇題。
    questionActive = true; // 顯示題目並暫停角色 1 移動。
  } // 結束角色靠近與題目狀態判斷。

  drawCharacter2(character2X, isNear); // 依互動狀態繪製角色 2 的相應動畫。
  drawCharacter1(playerSheet, playerFrameIndex, playerFrameWidth, playerDisplayWidth, playerDisplayHeight); // 繪製角色 1 目前的動畫影格。
  if (questionActive) { // 題目啟用時在畫面上繪製選擇題方框。
    drawQuizQuestion(); // 繪製黃色半透明題目框與四個答案按鈕。
  } // 結束題目繪製判斷。
} // 結束每影格繪製函式。

function getPlayerFrameIndex(isRunning) { // 根據角色 1 狀態計算動畫影格索引。
  if (isRunning) { // 跑步時先播放完整動畫，再循環播放後段影格。
    let elapsedRunFrames = floor((frameCount - runStartFrame) / 6); // 每六個畫面切換一次跑步動畫影格。
    return elapsedRunFrames < runFrameCount ? elapsedRunFrames : 5 + ((elapsedRunFrames - runFrameCount) % 7); // 先播放第 1 至 12 張，再循環播放第 6 至 12 張。
  } // 結束跑步動畫影格判斷。
  return floor(frameCount / 6) % idleFrameCount; // 站立時每六個畫面切換影格並循環播放。
} // 結束角色 1 影格計算函式。

function drawCharacter1(sheet, frameIndex, frameWidth, displayWidth, displayHeight) { // 擷取並繪製角色 1 的目前動畫影格。
  push(); // 暫存繪圖狀態，避免翻轉影響其他畫面元素。
  translate(playerX, height - displayHeight / 2); // 將角色 1 的中心定位在畫面底部上方。
  scale(facing, 1); // 依角色面向水平翻轉角色 1 的動畫。
  image(sheet, -displayWidth / 2, -displayHeight / 2, displayWidth, displayHeight, frameIndex * frameWidth, 0, frameWidth, sheet.height); // 將角色 1 的目前影格寬高各放大兩倍後繪製。
  pop(); // 還原繪圖狀態，結束角色 1 的水平翻轉效果。
} // 結束角色 1 繪製函式。

function drawCharacter2(centerX, isNear) { // 根據互動結果以原始尺寸六倍繪製角色 2。
  let sheet = character2StopSheet; // 預設使用角色 2 的站立精靈圖。
  let frameCountForSheet = character2StopFrameCount; // 預設使用角色 2 站立動畫影格數。
  if (isNear && hasAnswered && answerCorrect) { // 靠近且答對時選用答對動畫。
    sheet = character2CorrectSheet; // 使用角色 2 的答對動畫精靈圖。
    frameCountForSheet = character2CorrectFrameCount; // 使用答對動畫的 12 個影格。
  } else if (isNear && hasAnswered && !answerCorrect) { // 靠近且答錯時選用答錯動畫。
    sheet = character2IncorrectSheet; // 使用角色 2 的答錯動畫精靈圖。
    frameCountForSheet = character2IncorrectFrameCount; // 使用答錯動畫的 6 個影格。
  } // 結束角色 2 動畫選擇。
  let frameWidth = sheet.width / frameCountForSheet; // 依精靈圖寬度計算單一影格寬度。
  let frameIndex = floor(frameCount / 8) % frameCountForSheet; // 每八個畫面切換影格並循環播放。
  let displayWidth = frameWidth * character2Scale; // 將角色 2 單一影格的原始寬度放大六倍。
  let displayHeight = sheet.height * character2Scale; // 將角色 2 單一影格的原始高度放大六倍。
  image(sheet, centerX - displayWidth / 2, height - displayHeight, displayWidth, displayHeight, frameIndex * frameWidth, 0, frameWidth, sheet.height); // 將角色 2 放大六倍並站在畫面底部。
} // 結束角色 2 繪製函式。

function createQuizQuestion() { // 隨機建立一題有四個答案的簡易加法選擇題。
  quizFirstNumber = floor(random(2, 11)); // 隨機產生第一個介於 2 至 10 的整數。
  quizSecondNumber = floor(random(2, 11)); // 隨機產生第二個介於 2 至 10 的整數。
  let correctAnswer = quizFirstNumber + quizSecondNumber; // 計算這一題的正確答案。
  let optionSet = new Set([correctAnswer]); // 將正確答案放入選項集合以避免重複。
  while (optionSet.size < 4) { // 持續產生干擾答案直到共有四個不同選項。
    optionSet.add(max(0, correctAnswer + floor(random(-5, 6)))); // 加入與正確答案相近且不小於零的數字。
  } // 結束選項產生迴圈。
  quizOptions = Array.from(optionSet); // 將選項集合轉成可排序的陣列。
  for (let index = quizOptions.length - 1; index > 0; index--) { // 使用 Fisher-Yates 方法打亂答案選項順序。
    let swapIndex = floor(random(index + 1)); // 隨機選取目前索引之前的一個位置。
    [quizOptions[index], quizOptions[swapIndex]] = [quizOptions[swapIndex], quizOptions[index]]; // 交換兩個選項的位置。
  } // 結束選項排序迴圈。
} // 結束出題函式。

function getQuizPanel() { // 計算選擇題方框在畫布中的位置與尺寸。
  return { x: width * 3 / 8, y: height * 0.06, w: width / 4, h: height / 4 }; // 回傳位於畫布上方中央且寬高各為畫布四分之一的方框。
} // 結束題目方框尺寸計算函式。

function getOptionBounds(index, panel) { // 計算指定答案按鈕的位置與尺寸。
  let margin = panel.w * 0.06; // 設定按鈕與題目方框左右邊緣的間距。
  let gap = panel.w * 0.04; // 設定左右兩欄答案按鈕之間的間距。
  let buttonWidth = (panel.w - margin * 2 - gap) / 2; // 計算每個答案按鈕的寬度。
  let buttonHeight = panel.h * 0.19; // 計算每個答案按鈕的高度。
  let column = index % 2; // 取得答案按鈕所在的欄位。
  let row = floor(index / 2); // 取得答案按鈕所在的列。
  return { x: panel.x + margin + column * (buttonWidth + gap), y: panel.y + panel.h * 0.53 + row * panel.h * 0.23, w: buttonWidth, h: buttonHeight }; // 回傳答案按鈕的邊界。
} // 結束答案按鈕位置計算函式。

function drawQuizQuestion() { // 繪製半透明黃色選擇題面板與答案按鈕。
  let panel = getQuizPanel(); // 取得題目面板的畫面位置與尺寸。
  push(); // 暫存文字、填色與對齊設定。
  rectMode(CORNER); // 使用方框左上角作為繪圖定位基準。
  textAlign(CENTER, CENTER); // 將題目與答案文字置中對齊。
  fill(255, 255, 0, 80); // 設定題目面板為透明度 80 的黃色。
  stroke(120, 100, 0); // 設定題目面板的邊框顏色。
  rect(panel.x, panel.y, panel.w, panel.h, 12); // 繪製寬高各為畫布四分之一的黃色題目面板。
  noStroke(); // 移除答案按鈕文字與底色的邊框。
  fill(30); // 設定題目文字為深色。
  textSize(min(24, max(12, panel.w * 0.07))); // 依面板大小調整題目文字尺寸。
  text("請選出正確答案", panel.x + panel.w / 2, panel.y + panel.h * 0.18); // 顯示選擇題提示文字。
  textSize(min(28, max(14, panel.w * 0.09))); // 依面板大小調整加法題目文字尺寸。
  text(quizFirstNumber + " + " + quizSecondNumber + " = ?", panel.x + panel.w / 2, panel.y + panel.h * 0.39); // 顯示隨機產生的加法題目。
  for (let index = 0; index < quizOptions.length; index++) { // 逐一繪製四個答案選項。
    let option = getOptionBounds(index, panel); // 計算目前答案按鈕的位置與尺寸。
    fill(255, 255, 255, 225); // 設定答案按鈕為近乎不透明的白色。
    rect(option.x, option.y, option.w, option.h, 6); // 繪製目前答案的圓角按鈕。
    fill(30); // 設定答案數字為深色。
    textSize(min(22, max(12, option.h * 0.55))); // 依答案按鈕大小調整數字尺寸。
    text((index + 1) + ". " + quizOptions[index], option.x + option.w / 2, option.y + option.h / 2); // 在按鈕中顯示答案編號與數值。
  } // 結束答案選項繪製迴圈。
  pop(); // 還原繪圖狀態與文字設定。
} // 結束選擇題面板繪製函式。

function mousePressed() { // 處理使用者以滑鼠點選答案的作答行為。
  if (!questionActive) { // 題目未顯示時不處理滑鼠作答。
    return; // 結束本次滑鼠事件。
  } // 結束題目顯示狀態判斷。
  let panel = getQuizPanel(); // 取得目前題目方框的位置與尺寸。
  for (let index = 0; index < quizOptions.length; index++) { // 逐一檢查滑鼠是否點中答案按鈕。
    let option = getOptionBounds(index, panel); // 取得目前答案按鈕的邊界。
    if (mouseX >= option.x && mouseX <= option.x + option.w && mouseY >= option.y && mouseY <= option.y + option.h) { // 判斷滑鼠座標是否位於答案按鈕內。
      answerCorrect = quizOptions[index] === quizFirstNumber + quizSecondNumber; // 比對所選答案與正確答案。
      hasAnswered = true; // 記錄角色 1 已完成這次作答。
      questionActive = false; // 隱藏題目方框。
      return; // 完成作答後結束滑鼠事件處理。
    } // 結束答案按鈕命中判斷。
  } // 結束答案按鈕檢查迴圈。
} // 結束滑鼠作答函式。

function windowResized() { // 當瀏覽器視窗尺寸改變時重新調整畫布。
  resizeCanvas(windowWidth, windowHeight); // 將畫布調整為新的全視窗尺寸。
  playerX = constrain(playerX, 0, width); // 保持角色 1 的水平位置在新畫布範圍內。
} // 結束視窗尺寸調整函式。
