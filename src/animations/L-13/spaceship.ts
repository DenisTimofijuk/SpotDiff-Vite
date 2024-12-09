import { GameAudio } from "../../AudioBoard";
import Layer from "../../Layer";

export default <AnimationFunction>async function (_: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, __: PinsHandlerClass) {
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const bufferLayer = new Layer(w, h);
    const ship_layer = new Layer(w, h);
    const frame_layer = new Layer(w, h);
    ship_layer.ctx.drawImage(images[2], 0, 0);
    frame_layer.ctx.drawImage(images[3], 0, 0);

    const audio = new GameAudio();
    audio.load('./settings/L-13/audio/alien-spaceship-6321.mp3').then(()=>{
        audio.audio.volume = 0.1;
    }); 

  
    let isAnimationActive = false;
    let ship_x = -w;
    let ship_y = -50;

    function drawAnimation() {
        bufferLayer.ctx.drawImage(ship_layer.canv, ship_x, Math.round(ship_y));
      
        audio.audio.paused && audio.play();

        ship_x+=2;
        ship_y+=0.1;
        if(ship_x < w){
            isAnimationActive = true;
        }else{
            isAnimationActive = false;
            ship_x = -w;
            ship_y = -50;
        }
    }

    return function update(_: number) {
        bufferLayer.clear();

        const time = Math.round(Math.random()*1000);
        if(time <= 1 || isAnimationActive){
            drawAnimation();
        };

        bufferLayer.ctx.drawImage(frame_layer.canv, 0, 0);

        compositor.screeenA.ctx.drawImage(bufferLayer.canv, 0, 0);
        compositor.screeenB.ctx.drawImage(bufferLayer.canv, 0, 0);
    }    
};