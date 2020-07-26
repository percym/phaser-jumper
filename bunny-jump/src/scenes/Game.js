import Phaser from '../lib/phaser.js'
export default class Game extends Phaser.Scene{

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
        //note sprite
       

        const platforms = this.physics.add.staticGroup();

        for (let i= 0; i < 5 ; i++){
            
            const x = Phaser.Math.Between(80,400)
            const y  = i * 150;

            const platform = platforms.create(x,y, 'platform')
            platform.setScale(0.5)

            const body = platform.body;
            body.updateFromGameObject()

        }
        
        this.physics.add.sprite(240, 320,'bunny-stand').setScale(0.5)
    }
}