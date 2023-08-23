import { GameAudio } from '../../AudioBoard';
import Layer from '../../Layer';
import { initiateAnimationDuration } from '../../helpers';

export default <AnimationFunction>async function (
    levelData: {
        init: number;
        diffs: number;
    },
    images: HTMLImageElement[],
    compositor: GameCompositor,
    pinsHandler: PinsHandlerClass
) {
    const audio = new GameAudio();
    audio.load('/settings/L-14/audio/snail.mp3').then(()=>{
        audio.audio.volume = 0.5;
    }); 
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const bufferLayer = new Layer(w, h);
    const snailLayers = [new Layer(w, h), new Layer(w, h)];
    const lastDiffLayer = new Layer(w, h);

    snailLayers[0].ctx.drawImage(images[8], 0, 0);
    snailLayers[1].ctx.drawImage(images[9], 0, 0);
    lastDiffLayer.ctx.drawImage(images[5], 0, 0);

    const shouldDrawAnimation = [
        initiateAnimationDuration({
            init: 0,
            diffs: 0.5,
            duration: 1,
            delay: 0,
        }),
        initiateAnimationDuration({
            init: 0,
            diffs: 0.5,
            duration: 1,
            delay: 0.5,
        }),
    ];

    const updatediffIndi = new Event('updatediffIndi');
    let finalDiffAdded = false;
    const snailSpeed = 1.5;
    const snailDellay = 0;
    let snail_x = compositor.screeenA.canvas.width + snailDellay;

    function drawSnail(deltaTime: number) {
        if (snail_x < 0 - compositor.screeenA.canvas.width) {
            return;
        }

        if(audio.audio.paused){
            audio.play();
        }

        for (let i = 0; i < snailLayers.length; i++) {
            if (shouldDrawAnimation[i](deltaTime)) {
                bufferLayer.ctx.drawImage(snailLayers[i].canv, snail_x, 0);
            }
        }

        if(snail_x < 165){
            addLastDiff(); 
        }

        snail_x-=snailSpeed;
    }

    function addLastDiff() {
        if(finalDiffAdded) return;

        pinsHandler.searchablePins.push(444,318,150,102);
        compositor.screeenA.bufferCtx.drawImage(lastDiffLayer.canv, 0, 0);
        window.dispatchEvent(updatediffIndi);
        
        finalDiffAdded = true;
    }

    return function update(deltaTime: number) {
        bufferLayer.clear();

        if (levelData.diffs === 1) {
            drawSnail(deltaTime);
        }

        compositor.screeenA.ctx.drawImage(bufferLayer.canv, 0, 0);
        compositor.screeenB.ctx.drawImage(bufferLayer.canv, 0, 0);
    };
};