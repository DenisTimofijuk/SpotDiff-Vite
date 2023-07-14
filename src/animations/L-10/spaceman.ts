import Layer from "../../Layer";

export default <AnimationFunction>async function (levelData: {
    init: number;
    diffs: number;
}, images: HTMLImageElement[], compositor: GameCompositor, pinsHandler: PinsHandlerClass) {
    const w = compositor.screeenA.canvas.width;
    const h = compositor.screeenA.canvas.height;
    const layer_1 = new Layer(w, h);
    layer_1.ctx.drawImage(images[10], 0, 0);

    const updatediffIndi = new Event('updatediffIndi');
    let finalDiffAdded = false;

    function addFinalDiff() {
        if(finalDiffAdded) return;

        pinsHandler.searchablePins.push(131, 273, 84, 123);
        compositor.screeenA.bufferCtx.drawImage(layer_1.canv, 0, 0);
        window.dispatchEvent(updatediffIndi);
        
        finalDiffAdded = true;
    }
    
    return function update(_: number) {
        if(levelData.diffs == 1){
            addFinalDiff();
        }
    }    
};