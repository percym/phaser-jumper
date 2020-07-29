import Phaser from '../lib/phaser.js'
import Carrot from '../Carrot.js'

export default class Game extends Phaser.Scene{

    /** @type {Phaser.physics.Arcade.sprite} 
    player
    
    /** @type {Phaser.physics.Arcade.staticGroup}  */
    platforms

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors
    
    /** @type {Phaser.physics.Arcade.Group} */
    carrots

    carrotsCollected =0 

    /** @type {Phaser.GameObjects.Text} */
    carrotsCollectedText
    constructor(){
        super('game')
    }

    preload(){
        this.load.image('background','assets/bg_layer1.png')

        // load the platform image
        this.load.image('platform','assets/ground_grass.png')

        this.load.image('bunny-stand','assets/bunny1_stand.png')

        this.load.image('carrot','assets/carrot.png')

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

         const carrot = new Carrot(this, 240, 320, 'carrot')
         this.add.existing(carrot)

         this.carrots = this.physics.add.group({
             classType:Carrot
         })

         this.carrots.get(240,320,'carrot')
         
         this.physics.add.collider(this.platforms, this.carrots)

         this.physics.add.overlap(
             this.player,
             this.carrots,
             this.handleCollectCarrot,
             undefined,
             this   
         )   

         const style ={ colour: '#000',fontSize:24}
         this.carrotsCollectedText = this.add.text(240, 10 ,'Carrots:0', style)
         .setScrollFactor(0)
         .setOrigin(0.5,0)
    }

    update(t , dt){
        this.platforms.children.iterate(
            child => {
                /** @type {Phaser.physics.Arcade.sprite} */
                const platform = child
                
                const scrollY = this.cameras.main.scrollY
                if(platform.y >= scrollY +700 ){
                    platform.y = scrollY - Phaser.Math.Between(50,100)
                    platform.body.updateFromGameObject()

                    // create a carrot above the platform being reused
                    this.addCarrotAbove(platform)
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

    /**
     * 
     * @param {Phaser.GameObjects.Sprite} sprite 
     */
    horizontalWrap(sprite){
        const halfWidth =sprite.displayWidth * 0.5 
        const gameWidth = this.scale.width

        if(sprite.x < -halfWidth){
            sprite.x = gameWidth + halfWidth

        }else if(sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth;
        }
    }
    /**
     * 
     * @param {Phaser.GameObjects.Sprite} sprite 
     */
    addCarrotAbove(sprite){
        const y = sprite.y -sprite.displayHeight

        /**@type {Phaser.Physics.Arcade.Sprite} */
        const carrot = this.carrots.get(sprite.x , y ,'carrot')
        carrot.setActive(true)
        carrot.setVisible(true)
        this.add.existing(carrot)

        carrot.body.setSize(carrot.width, carrot.height)

        return carrot
    }

    /**
     * 
     * @param {Phaser.Physics.Arcade.Sprite} player 
     * @param {Carrot} carrot 
     */
    handleCollectCarrot(player, carrot){

        //hide carrot
        this.carrots.killAndHide(carrot)

        //disable from physics world
        this.physics.world.disableBody(carrot.body)

        this.carrotsCollected++
        const value = `Carrots: ${this.carrotsCollected}`
        this.carrotsCollectedText.text = value;
    }
}