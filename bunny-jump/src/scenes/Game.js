import Phaser from '../lib/phaser.js'
export default class Game extends Phaser.Scene{

    /** @type {Phaser.physics.Arcade.sprite} 
    player
    /** @type {Phaser.physics.Arcade.staticGroup}  */
    platforms

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors
    constructor(){
        super('game')
    }

    preload(){
        this.load.image('background','assets/bg_layer1.png')

        // load the platform image
        this.load.image('platform','assets/ground_grass.png')

        this.load.image('bunny-stand','assets/bunny1_stand.png')

        this.cursors= this.input.keyboard.createCursorKeys()

    }
   

    create(){
        this.add.image(240,320, 'background').setScrollFactor(1,0)
        
        // this.add.image(240,320,'platform')

        // this.physics.add.image(240,320, 'platform').setScale(0.5) 
      
        this.platforms = this.physics.add.staticGroup();

        for (let i= 0; i < 5 ; i++){
            
            const x = Phaser.Math.Between(80,400)
            const y  = i * 150;

            const platform = this.platforms.create(x,y, 'platform')
            platform.scale=(0.5)

            const body = platform.body
            body.updateFromGameObject()
        }
      
        //note sprite
         this.player = this.physics.add.sprite(240, 320,'bunny-stand').setScale(0.5)

         this.physics.add.collider(this.platforms, this.player);

         this.player.body.checkCollision.up =false
         this.player.body.checkCollision.left =false
         this.player.body.checkCollision.right =false

         this.cameras.main.startFollow(this.player);

         this.cameras.main.setDeadzone(this.scale.width * 1.5)
    }

    update(){
        this.platforms.children.iterate(
            child => {
                /** @type {Phaser.physics.Arcade.sprite} */
                const platform = child
                
                const scrollY = this.cameras.main.scrollY
                if(platform.y >= scrollY +700 ){
                    platform.y = scrollY - Phaser.Math.Between(50,100)
                    platform.body.updateFromGameObject()
                }
            }
        )

        const touchingDown = this.player.body.touching.down

        if(touchingDown)(
            this.player.setVelocity(-300)
        )
         
        if(this.cursors.left.isDown && !touchingDown){
            this.player.setVelocityX(-200)
        }
        else if(this.cursors.right.isDown && !touchingDown){
            this.player.setVelocityX(200)
        }else{
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)
    }

    horizontalWrap(sprite){
        const halfWidth =sprite.displayWidth * 0.5 
        const gameWidth = this.scale.width

        if(sprite.x < -halfWidth){
            sprite.x = gameWidth + halfWidth

        }else if(sprite.x > gameWidth+ halfWidth) {
            sprite.x = -halfWidth;
        }
    }
}