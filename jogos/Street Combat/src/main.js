import { Start } from './scenes/Start.js';
import { Tutorial } from "./scenes/Tutorial.js";
import { Jogo } from "./scenes/Jogo.js";
import { Rua } from "./scenes/Rua.js";
import { Lugar } from "./scenes/Lugar.js";
import { Prisao } from "./scenes/Prisao.js";
import { Pausa} from "./scenes/Pausa.js";
import { Boss_1 } from "./scenes/Boss_1.js";
import { Boss_2 } from "./scenes/Boss_2.js";
import { Boss_3 } from "./scenes/Boss_3.js";

//funcoes online

import {Rua_online } from "./scenes/Rua_online.js";
import { Boss_1_online } from "./scenes/Boss_1_online.js";


const config = {
    type: Phaser.AUTO,
    title: 'Overlord Rising',
    description: '',
    parent: 'game-container',
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    input: {
        gamepad: true
    },
    pixelArt: false,
    scene: [
        Start,
        Tutorial,
        Jogo,
        Rua,
        Lugar,
        Prisao,
        Pausa,
        Boss_1,
        Boss_2,
        Boss_3,

        //online
        Rua_online,
        Boss_1_online
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            