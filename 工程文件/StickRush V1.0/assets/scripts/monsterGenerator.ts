
import { _decorator, Component, Node, Prefab, instantiate, JsonAsset, Label,Animation,AudioClip, AudioSource,systemEvent ,SystemEvent,director} from 'cc';

import { gameInfo } from "./gameinfo";
import { Player } from './player';
const { ccclass, property } = _decorator;

type Combo = {
    position: number,
    time: number,
    used: number;
}

@ccclass('MonsterGenerator')
export class MonsterGenerator extends Component {

    @property(Prefab)
    monster1: Prefab = null!;

    @property(Prefab)
    monster2: Prefab = null!;

    @property(JsonAsset)
    comboJsonAsset: JsonAsset = null!;

    @property(Label)
    combo:Label=null!;

    @property(Label)
    miss:Label=null!;

    @property(Label)
    score:Label=null!;

    @property(Node)
    Monster:Node=null!;

    @property(Node)
    result:Node=null!;

    @property(Node)
    player:Node=null!;

    @property(Node)
    canvas:Node=null!;

    combos: Array<Combo> = null!;
    beginTime = 0;
    index = 0;

    private l: number = 0;


    start(): void {
        this.combos = this.comboJsonAsset.json as Array<Combo>;
        this.l=this.combos.length;
        console.log(this.l);
        for (let i = 0, len = this.combos.length; i < len; i++) {
            this.combos[i].time += 1000;
        }
        this.beginTime = new Date().getTime();
    }

    update(): void {
        if (gameInfo.gameStart) {
            if(this.index >= this.l)
            {   
                setTimeout(() => {
                    this.success_result();
                }, 5000);
                this.beginTime = new Date().getTime();
            }
            let currentTime = new Date().getTime();
            let dt = currentTime - this.beginTime;
            if (this.index < this.l && dt > this.combos[this.index].time)
                this.generateMonster(this.combos[this.index++].position);
            //this.index=10000;
        }
    }

    success_result()
    {
        gameInfo.gameStart = false;
        //this.Monster.active = false;
        try {
            this.result.active=true;
            let ani=this.player.getComponent(Animation);
            ani?.pause();
            let au=this.canvas.getComponent(AudioSource);
            au?.stop();
            au?.pause();
            
            this.combo.string=gameInfo.maxCombo.toString();
            this.miss.string=gameInfo.miss.toString();
            this.score.string=gameInfo.points.toString();

            systemEvent.on(SystemEvent.EventType.KEY_DOWN,this.mouse,this);
        } catch (Exception) {
        // pass
        }
    }

    mouse()
    {
        systemEvent.off(SystemEvent.EventType.KEY_DOWN,this.mouse,this);
        this.result.active=false;
        gameInfo.gameStart = true;
        gameInfo.maxCombo=0;
        gameInfo.miss=0;
        gameInfo.points=0;
        director.loadScene("Select");
    }

    generateMonster(position: number): void {
        let monster: Node;
        if (position === 0)
            monster = instantiate(this.monster1);
        else
            monster = instantiate(this.monster2);
        monster.parent = this.node;
    }
}
