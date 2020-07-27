import Phaser from '../lib/phaser.js'
export default class Game extends Phaser.Scene{

    /** @type {Phaser.physics.Arcade.sprite} 
    player
    /** @type {Phaser.physics.Arcade.staticGroup}  */
    platforms

    constructor(){
        super('game')
    }

    preload(){
        this.load.image('background','assets/bg_layer1.png')

        // load the platform image
        this.load.image('platform','assets/ground_grass.png')

        this.load.image('bunny-stand','assets/bunny1_stand.png')
    }

    create(){
        this.add.image(240,320, 'background').setScale(0.5)
        
        // this.add.image(240,320,'platform')

        // this.physics.add.image(240,320, 'platform').setScale(0.5) 
      
        this.platforms = this.physics.add.staticGroup();

        for (let i= 0; i < 5 ; i++){
            
            const x = Phaser.Math.Between(80,400)
            const y  = i * 150;

            const platform = this.platforms.create(x,y, 'platform')
            platform.setScale(0.5)

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
        const scrollY = this.cameras.main.scrollY;

        const touchingDown = this.player.body.touching.down

        if(touchingDown)(
            this.player.setVelocity(-300)
        )


    }
}