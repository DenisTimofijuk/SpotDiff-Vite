import { GameAudio } from "../../AudioBoard";
import Layer from "../../Layer";

export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const bufferLayer_a = new Layer(w, h);
    const bufferLayer_b = new Layer(w, h);
    const car_layer = new Layer(w, h);
    const frame_layer = new Layer(w, h);
    const alien_layer = new Layer(w, h);
    car_layer.ctx.drawImage(images[2], 0, 0);
    frame_layer.ctx.drawImage(images[4], 0, 0);
    alien_layer.ctx.drawImage(images[3], 0, 0);
    let audioFlag = true;

    const audio = new GameAudio();
    audio.load('./settings/L-12/audio/107195.ogg').then(()=>{
        audio.audio.volume = 0.5;
    }); 
    
    const updatediffIndi = new Event('updatediffIndi');
    let timer = 0;
    let alien_x = w;
    let finalDiffAdded = false;

    function addLastDiff() {
        if(finalDiffAdded) return;

        pinsHandler.searchablePins.push(449,272,79,72);
        compositor.screeenA.bufferCtx.drawImage(car_layer.canv, 0, 0);
        window.dispatchEvent(updatediffIndi);
        
        finalDiffAdded = true;
    }

    function drawAlien() {
        if(alien_x < w * (-1)){
            return;
        }

        if(alien_x < (w-300)){
            addLastDiff();
        }

        audioFlag && audio.play();
        audioFlag = false;

        const y =  Math.trunc(Math.sin(timer / 10) * 10);

        bufferLayer_a.ctx.drawImage(alien_layer.canv, Math.round(alien_x) , y);

        bufferLayer_b.ctx.save();
        bufferLayer_b.ctx.scale(-1, 1);
        bufferLayer_b.ctx.drawImage(alien_layer.canv, Math.round(alien_x)-w , y);
        bufferLayer_b.ctx.restore();

        alien_x-=3.3;
    }

    return function update(_: number) {
        bufferLayer_a.clear();
        bufferLayer_b.clear();

        if(levelData.diffs === 1){
            drawAlien();
        };

        bufferLayer_a.ctx.drawImage(frame_layer.canv, 0, 0);
        bufferLayer_b.ctx.drawImage(frame_layer.canv, 0, 0);

        compositor.screeenA.ctx.drawImage(bufferLayer_a.canv, 0, 0);
        compositor.screeenB.ctx.drawImage(bufferLayer_b.canv, 0, 0);
        
        timer++;
    }    
};