import Layer from '../../Layer';
import { initiateAnimationDuration } from '../../helpers';

export default <AnimationFunction>async function (
    _: {
        init: number;
        diffs: number;
    },
    images: HTMLImageElement[],
    compositor: GameCompositor,
    __: PinsHandlerClass
) {
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const bufferLayer = new Layer(w, h);
    const busLayers = [new Layer(w, h), new Layer(w, h), new Layer(w, h)];

    busLayers[0].ctx.drawImage(images[2], 0, 0);
    busLayers[1].ctx.drawImage(images[3], 0, 0);
    busLayers[2].ctx.drawImage(images[4], 0, 0);

    const shouldDrawAnimation = [
        initiateAnimationDuration({
            init: 0,
            diffs: 0.5,
            duration: 2,
            delay: 0.2,
        }),
        initiateAnimationDuration({
            init: 0,
            diffs: 0.5,
            duration: 2,
            delay: 1,
        }),
        initiateAnimationDuration({
            init: 0,
            diffs: 0.5,
            duration: 2,
            delay: 0.5,
        }),
    ];

    return function update(deltaTime: number) {
        bufferLayer.clear();

        for (let i = 0; i < busLayers.length; i++) {
            if (shouldDrawAnimation[i](deltaTime)) {
                bufferLayer.ctx.drawImage(busLayers[i].canv, 0, 0);
            }
        }

        compositor.screeenA.ctx.drawImage(bufferLayer.canv, 0, 0);
        compositor.screeenB.ctx.drawImage(bufferLayer.canv, 0, 0);
    };
};
