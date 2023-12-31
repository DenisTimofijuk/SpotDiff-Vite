import Layer from "../../Layer";

export default <AnimationFunction>async function (_: {
    init: number;
    diffs: number;
}, __: HTMLImageElement[], compositor: GameCompositor, ___: PinsHandlerClass) {
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const buffer = new Layer(w, h);

    buffer.ctx.drawImage(compositor.screeenA.buffer, 464,250,36,19, 464,250-19,36,19);

    let period = randomDellay();

    return function update(_: number) {
        period--;
        if(period > 0 && period < 60){
            compositor.screeenA.ctx.drawImage(buffer.canv, 0, 0);
            compositor.screeenB.ctx.drawImage(buffer.canv, 0, 0);
        }else{
            period = randomDellay();
        }        
    }
}

function randomDellay() {
    return Math.floor(Math.random() * 100 )
}