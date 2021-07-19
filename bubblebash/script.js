var game;
var gameOptions = {
  bounceHeight: 260,
  ballGravity: 1200,
  ballPosition: 0.2,
  platformSpeed: 600,
  platformDistanceRange: [240, 450],
  platformHeightRange: [-50, 100],
  platformLengthRange: [30, 100],
  localStorageName: "bestballscore3"
}
window.onload = () => {
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor:"#ffc0cb",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 600,
      height: 450
    },
    physics: {
      default: "arcade"
    },
    scene: playGame
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
class playGame extends Phaser.Scene{
  constructor(){
    super("PlayGame");
  }
  preload(){
    this.load.image("ground", "ground.png");
    this.load.image("ball", "ball3.png");
  }
  create(){
    this.platformGroup = this.physics.add.group();
    this.ball = this.physics.add.sprite(game.config.width * gameOptions.ballPosition, game.config.height / 4 * 3 - gameOptions.bounceHeight, "ball");
    this.ball.body.gravity.y = gameOptions.ballGravity;
    this.ball.setBounce(1);
    this.ball.body.checkCollision.down = true;
    this.ball.body.checkCollision.up = false;
    this.ball.body.checkCollision.left = false;
    this.ball.body.checkCollision.right = false;
    this.ball.setSize(20, 40, true)
    let platformX = this.ball.x;
    for(let i = 0; i < 10; i++){
      let platform = this.platformGroup.create(platformX, game.config.height / 4 * 3 + Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]), "ground");
      platform.setOrigin(0.25, 2);
      platform.setImmovable(true);
      platform.displayWidth = Phaser.Math.Between(gameOptions.platformLengthRange[0], gameOptions.platformLengthRange[1]);
      platformX += Phaser.Math.Between(gameOptions.platformDistanceRange[0], gameOptions.platformDistanceRange[1]);
      }
    this.input.on("pointerdown", this.movePlatforms, this);
    this.input.on("pointerup", this.stopPlatforms, this);
    this.score = 0;
    this.topScore = localStorage.getItem(gameOptions.localStorageName) == null ? 0 : localStorage.getItem(gameOptions.localStorageName);
    this.scoreText = this.add.text(10, 10, "");
    this.updateScore(this.score);
    }
    updateScore(inc){
      this.score += inc;
      this.scoreText.text = "SCORE: " + this.score + "\nBEST: " + this.topScore;
    }
    movePlatforms(){
      this.platformGroup.setVelocityX(-gameOptions.platformSpeed);
    }
    stopPlatforms(){
      this.platformGroup.setVelocityX(0);
    }
    getRightmostPlatform(){
      let rightmostPlatform = 0;
      this.platformGroup.getChildren().forEach((platform) => {
        rightmostPlatform = Math.max(rightmostPlatform, platform.x);
      });
      return rightmostPlatform;
    }

    update(){
      this.physics.world.collide(this.platformGroup, this.ball);
      this.platformGroup.getChildren().forEach((platform) => {
        if(platform.getBounds().right < 0){
          this.updateScore(10);
          platform.x = this.getRightmostPlatform() + Phaser.Math.Between(gameOptions.platformDistanceRange[0], gameOptions.platformDistanceRange[1]);
          platform.displayWidth = Phaser.Math.Between(gameOptions.platformLengthRange[0], gameOptions.platformLengthRange[1]);
        }
      }, this);
      if(this.ball.y > game.config.height){
        localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));
        this.scene.start("PlayGame");
      }
    }
}