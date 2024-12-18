import './styles/main.css';
import './styles/checkbox.css';
import { loadAudioBoard, GameAudio } from './AudioBoard';
import Compositor from './Compositor';
import LoaderIndicator from './LoaderIndicator';
import PinsHandler, { acceptRatio } from './PinsHandler';
import Timer from './Timer';
import Vortex from './Vortex';
import { isFullScreen, requestFullScreen, exitFullScreen } from './fullscreen';
import { handleIntroScreen } from './game-intro';
import TotalIndicator from './indicator';
import inspector from './inspector';
import { loadJSON, loadAllIamgeFiles } from './loaders';
import Penelty from './penelty';
import UserHelper from './userHelper';



(async () => {
    const animationModules = import.meta.glob('./animations/*/*.ts', {import:'default', eager: true}) as Record<string, AnimationFunction>;

    handleIntroScreen();

    const DEBUGG = /localhost/.test(window.location.href);
    const difficulty = document.getElementById('difficulty') as HTMLSelectElement;
    difficulty.value = "Normal"; //Disabling level selection.

    const bgmusicInput = document.getElementById('bg-music-enabled') as HTMLInputElement;
    const AudioContext = window.AudioContext;
    const audioContext = new AudioContext();
    const timer = new Timer();
    const compositor = new Compositor();
    const laodingScreen = new LoaderIndicator(compositor);
    const penelty = new Penelty(compositor);
    const helpUser = new UserHelper(compositor);
    const indicateTotal = new TotalIndicator(compositor);
    const themeConfigData = await loadJSON<ThemeJSON>('./theme/config.json');
    const audioBoard = await loadAudioBoard(themeConfigData.piano, audioContext);
    const vortex = new Vortex(compositor);
    await indicateTotal.initBuffer(themeConfigData.numbers);
    await vortex.initBuffer(themeConfigData.vortex);
    const animations: UpdateAnimation[] = [];
    const loadNextLevel = new Event('nextlevel');
    let currentProgress = 0;
    let difficultyKey: DifficultyName;

    timer.update = function update(deltaTime: number) {
        penelty.update();
        compositor.draw();
        indicateTotal.draw();
        animations.forEach((update) => update(deltaTime));
        helpUser.update();
        vortex.update();
    };

    compositor.screeenA.canvas.addEventListener('contextmenu', contextMenuHandler);
    compositor.screeenB.canvas.addEventListener('contextmenu', contextMenuHandler);

    const updateInspector = DEBUGG ? inspector(compositor) : () => {};

    function clickEventManager() {
        return function hanlder(_: MouseEvent) {
            console.error('Unhandled.');
        };
    }

    function loadNextEventManager() {
        return function handler() {
            console.error('Unhandled.');
        };
    }

    function updateDiffIndicator() {
        return function handler() {
            console.error('Unhandled.');
        };
    }

    let clickHandler = clickEventManager();
    let loadHanlder = loadNextEventManager();
    let updatediffFromAnimations = updateDiffIndicator();

    const diffHandler = {
        set init(total: number) {
            this.diffs = total;
        },
        diffs: 0,
    };

    function initNextLevelLoading() {
        window.setTimeout(() => window.dispatchEvent(loadNextLevel), 2000);
    }

    async function loadLevel(url: string) {
        laodingScreen.init();
        currentProgress++;
        animations.push(updateInspector);
        compositor.screeenA.canvas.removeEventListener('click', clickHandler);
        compositor.screeenB.canvas.removeEventListener('click', clickHandler);
        window.removeEventListener('nextlevel', loadHanlder);
        window.removeEventListener('updatediffIndi', updatediffFromAnimations);

        laodingScreen.showProgress('Loading Configurations...');
        const levelConfigData = await loadJSON<Level_Config_JSON>(url);
        laodingScreen.showProgress('Configurations - Ok.');

        let backgroundMusic: GameAudio[] = [];
        if (bgmusicInput.checked) {
            for (let element of levelConfigData['background-audio']) {
                laodingScreen.showProgress('Loading background music...');
                const music = new GameAudio();
                backgroundMusic.push(music);
                await music.load(element.url);
                music.audio.loop = true;
                music.setVolume(element.volume);
                laodingScreen.showProgress('background music - Ok.');
            }
        }

        laodingScreen.showProgress('Loading images...');
        const images = await loadAllIamgeFiles(levelConfigData.images);
        laodingScreen.showProgress('images - Ok.');

        let pinsHandler: PinsHandler = new PinsHandler(levelConfigData.pins);
        let audioName = 0;
        diffHandler.init = levelConfigData.totalDiffs;
        compositor.initBuffers(images);
        indicateTotal.setup(levelConfigData.indication);
        indicateTotal.update(levelConfigData.totalDiffs);

        const levelIndexReg = new RegExp(`/${levelConfigData['level-index']}/`);
        for (const path in animationModules) {
            if( levelIndexReg.test(path) ){
                laodingScreen.showProgress('Adding animation...');
                await addAnimation(animationModules[path]);
                laodingScreen.showProgress('animation - Ok.');
            }    
        }

        clickHandler = function (ev: MouseEvent) {
            ev.preventDefault();

            if (penelty.active) {
                return;
            }

            const x = acceptRatio(compositor, ev.offsetX);
            const y = acceptRatio(compositor, ev.offsetY);
            const pins = pinsHandler.find(x, y);

            if (pins.length === 0) {
                penelty.trigger();
                return;
            }

            audioName++;
            if (audioName === levelConfigData.totalDiffs) {
                audioName = audioBoard.buffers.size - 1;
            }

            audioBoard.playAudio(audioName + '');
            diffHandler.diffs--;
            pinsHandler!.searchablePins = pinsHandler!.bufferPins;
            compositor.redrawSegment(pins);
            indicateTotal.update(diffHandler.diffs);
            vortex.set(pins);
            helpUser.set(pinsHandler!.getPins(0));

            if (diffHandler.diffs === 0) {
                initNextLevelLoading();
            }
        };

        loadHanlder = function () {
            if (themeConfigData.difficulty[difficultyKey].levels[currentProgress]) {
                backgroundMusic.forEach((music) => music.stop());
                penelty.reset();
                timer.stop();
                // @ts-ignore
                pinsHandler = null;
                animations.length = 0;
                loadLevel(themeConfigData.difficulty[difficultyKey].levels[currentProgress]);
            } else {
                console.log('Resetting game.');
                currentProgress = 0;
                loadHanlder();
            }
        };

        updatediffFromAnimations = function () {
            if (isNaN(helpUser.pos.x)) {
                helpUser.set(pinsHandler!.getPins(0));
            }
        };

        compositor.screeenA.canvas.addEventListener('click', clickHandler);
        compositor.screeenB.canvas.addEventListener('click', clickHandler);
        window.addEventListener('nextlevel', loadHanlder);
        window.addEventListener('updatediffIndi', updatediffFromAnimations);

        document.getElementById('level-name')!.innerHTML = levelConfigData.name;
        document.getElementById(
            'players-progress'
        )!.innerHTML = `${currentProgress} / ${themeConfigData.difficulty[difficultyKey].levels.length}`;
        laodingScreen.showProgress('All done.');

        helpUser.set(pinsHandler!.getPins(0));
        helpUser.initOnLevel();
        window.setTimeout(() => {
            penelty.reset();
            timer.start();
            backgroundMusic.forEach((music) => music.play());
        }, 500);

        async function addAnimation(animation: AnimationFunction) {
            const update = await animation(diffHandler, images, compositor, pinsHandler!);
            animations.push(update);
        }
    }

    const startButton = document.getElementById('start-game')! as HTMLInputElement;
    startButton.value = 'Start';
    startButton.classList.remove('redButton');
    startButton.classList.add('greenButton');

    startButton.addEventListener('click', () => {
        document.getElementById('gameScreen')!.classList.remove('visible-no');
        document.getElementById('level-info')!.classList.remove('visible-no');
        document.getElementById('enter-full-screen')!.classList.remove('visible-no');
        document.getElementById('settings-screen')!.classList.add('visible-no');

        difficultyKey = difficulty.value as DifficultyName;
        helpUser.initOnGame(
            themeConfigData.difficulty[difficultyKey]['init-helps'],
            themeConfigData.difficulty[difficultyKey]['max-available-helps']
        );
        loadLevel(themeConfigData.difficulty[difficultyKey].levels[currentProgress]);
    });

    toggleFulscreen();

    function contextMenuHandler(e: MouseEvent) {
        e.preventDefault();
    }

    function toggleFulscreen() {
        const screenElement = document.getElementById('game-screen-wrapper')! as HTMLDivElement; //gameScreen
        const button = document.getElementById('enter-full-screen')!;
        button.addEventListener('click', handler);

        function handler() {
            if (!isFullScreen()) {
                requestFullScreen(screenElement);
            } else {
                exitFullScreen(document);
            }
        }
    }

    handleDisclamer();
    function handleDisclamer() {
        const element = document.querySelector('div.disclaimer');
        if (!element) return;
        const heigtht = element!.clientHeight;
        const footer = document.getElementsByTagName('footer')[0];
        footer.style.marginBottom = 10 + heigtht + 'px';
    }
})();
