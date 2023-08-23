export function getRandomArbitrary(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function initiateAnimationDuration({
    init,
    diffs,
    duration,
    delay,
}: {
    init: number;
    diffs: number;
    duration: number;
    delay: number;
}) {
    let elapsedTime = 0;

    return function update(deltaTime: number) {
        elapsedTime += deltaTime;

        if (elapsedTime < delay) {
            return false;
        }

        const normalizedTime = (elapsedTime - delay) / duration;
        const animationProgress = normalizedTime % 1;
        const sineValue = Math.sin(animationProgress * Math.PI * 2);
        const threshold = init + sineValue * diffs;
        const shouldReturnTrue = animationProgress <= 1 && sineValue >= -1 && threshold > 0;

        return shouldReturnTrue;
    };
}