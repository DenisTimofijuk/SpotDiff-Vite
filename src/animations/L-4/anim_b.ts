import Layer from "../../Layer";
import { getRandomArbitrary } from "../../helpers";

export default <AnimationFunction>async function (_: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, __: PinsHandlerClass) {
    const canvases:HTMLCanvasElement[]= [];
    const windowImages = images.slice(5, images.length - 1);
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;

    windowImages.forEach((image) => {    
        const buffer = new Layer(w, h);
        buffer.ctx.drawImage(image, 0, 0);
        canvases.push(buffer.canv);
    })

    const dellay = 35;
    let counter = 0;
    let index = getRandomArbitrary(0, canvases.length);

    return function update(_: number) {
        counter++;
        if( counter > dellay ){
            counter = 0;
            index = getRandomArbitrary(0, canvases.length);
        }
        compositor.screeenA.ctx.drawImage(canvases[index], 0, 0);
        compositor.screeenB.ctx.drawImage(canvases[index], 0, 0);
    }
}