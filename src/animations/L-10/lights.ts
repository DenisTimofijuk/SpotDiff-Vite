import Layer from "../../Layer";

export default <AnimationFunction>async function (_: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, __: PinsHandlerClass) {
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const bufferLayer = new Layer(w, h);
    const layer_a_1 = new Layer(w, h);
    const layer_a_2 = new Layer(w, h);
    const layer_a_3 = new Layer(w, h);
    layer_a_1.ctx.drawImage(images[2], 0, 0);
    layer_a_2.ctx.drawImage(images[3], 0, 0);
    layer_a_3.ctx.drawImage(images[4], 0, 0);

    const layer_b_1 = new Layer(w, h);
    const layer_b_2 = new Layer(w, h);
    const layer_b_3 = new Layer(w, h);
    layer_b_1.ctx.drawImage(images[5], 0, 0);
    layer_b_2.ctx.drawImage(images[6], 0, 0);
    layer_b_3.ctx.drawImage(images[7], 0, 0);

    const layer_c_1 = new Layer(w, h);
    const layer_c_2 = new Layer(w, h);
    layer_c_1.ctx.drawImage(images[8], 0, 0);
    layer_c_2.ctx.drawImage(images[9], 0, 0);

    let timer = 0;

    return function update(_: number) {
        bufferLayer.clear();

        const time =  Math.trunc(Math.sin(timer / 100) * 10);

        if(time > 8) bufferLayer.ctx.drawImage(layer_a_1.canv, 0, 0);
        else if(time > 7) bufferLayer.ctx.drawImage(layer_a_2.canv, 0, 0);
        else if( time > 6) bufferLayer.ctx.drawImage(layer_a_3.canv, 0, 0);

        if(time > 4) bufferLayer.ctx.drawImage(layer_b_1.canv, 0, 0);
        else if(time > 3) bufferLayer.ctx.drawImage(layer_b_2.canv, 0, 0);
        else if( time > 2) bufferLayer.ctx.drawImage(layer_b_3.canv, 0, 0);

        if (time % 3) bufferLayer.ctx.drawImage(layer_c_1.canv, 0, 0)
        else bufferLayer.ctx.drawImage(layer_c_2.canv, 0, 0)
        

        compositor.screeenA.ctx.drawImage(bufferLayer.canv, 0, 0);
        compositor.screeenB.ctx.drawImage(bufferLayer.canv, 0, 0);
        
        timer++;
    }    
};