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
    const rainLayers = [new Layer(w, h), new Layer(w, h)];

    rainLayers[0].ctx.drawImage(images[6], 0, 0);
    rainLayers[1].ctx.drawImage(images[7], 0, 0);

    const shouldDrawAnimation = [
        initiateAnimationDuration({
            init: 0,
            diffs: 0.5,
            duration: 0.5,
            delay: 0,
        }),
        initiateAnimationDuration({
            init: 0,
            diffs: 0.5,
            duration: 0.5,
            delay: 0.25,
        })
    ];

    return function update(deltaTime: number) {
        bufferLayer.clear();
        bufferLayer.ctx.globalAlpha = 0.3;
        bufferLayer.ctx.globalCompositeOperation = 'screen';

        for (let i = 0; i < rainLayers.length; i++) {
            if (shouldDrawAnimation[i](deltaTime)) {
                bufferLayer.ctx.drawImage(rainLayers[i].canv, 0, 0);
            }
        }

        compositor.screeenA.ctx.drawImage(bufferLayer.canv, 0, 0);
        compositor.screeenB.ctx.drawImage(bufferLayer.canv, 0, 0);
    };
};
