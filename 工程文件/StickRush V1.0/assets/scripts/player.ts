import { _decorator, Component, Node, Animation, Collider2D, SystemEvent, Contact2DType, EPhysics2DDrawFlags, PhysicsSystem2D, EventTouch, systemEvent, SystemEventType, EventKeyboard, macro, AudioClip, ProgressBar, director, Label, Widget } from 'cc';
const { ccclass, property } = _decorator;
import { gameInfo } from "./gameinfo";

export type PlayerState = 'run' | 'jump' | 'down' | 'attack' | 'attackdown' | 'death';

@ccclass('Player')
export class Player extends Component {

    @property(Node)
    Monster: Node = null!;

    @property(Node)
    Hitin: Node = null!;

    @property(AudioClip)
    HitClip: AudioClip = null!;

    @property(ProgressBar)
    HP: ProgressBar = null!;

    @property(Label)
    comboLabel: Label = null!;

    @property(Node)
    result:Node=null!;

    //定义一个变量用来记录动画组件
    private animation: Animation | null = null;
    //记录之前状态
    private state: string = 'run';

    //碰撞判定范围
    wind_size = 150;
    //碰撞点位置
    Hit_x = -370;


    _combo = 0;
    get combo(): number {
        return this._combo;
    }
    set combo(x: number) {
        this._combo = x;
        gameInfo.maxCombo = Math.max(gameInfo.maxCombo, x);
        if (x === 0) gameInfo.miss++;
        this.comboLabel.string = x.toString();
        console.log(this.comboLabel.getComponent(Widget));
        this.comboLabel.getComponent(Widget)?.updateAlignment();
    }

    onLoad() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        //获取动画组件
        this.animation = this.node.getComponent(Animation);
        this.Hitin.active = false;
    }
    update() {
        let self = this;
        let idx = -1;
        let cnt = self.Monster.children.length;
        for (let i = 0; i < cnt; i++) {
            let pos = self.Monster.children[i].getPosition();
            //判断是否在区域内
            if (pos.x + self.wind_size + 100 < self.Hit_x) {
                this.HP.progress -= 0.1
                if (this.HP.progress <= 0.05) {

                    gameInfo.gameStart = false;
                    director.loadScene("GGWP");
                }
                this.combo = 0;
                self.Monster.children[i].destroy();
            }
        }
    }
    changeState(state: PlayerState) {
        //取消击中动画的显示
        this.Hitin.active = false;
        //判断要切换的状态是否为之前的状态
        if (this.state === state) {
            return;
        }
        //记录即将切换的状态
        this.state = state;
        //根据状态播放相应动画
        if (state === 'run') {
            if (this.animation) {
                this.animation.play('run');
            }
        }
        else if (state === 'jump') {
            if (this.animation) {
                this.animation.play('jump');
            }
        }
        else if (state === 'down') {
            if (this.animation) {
                this.animation.play('down');
            }
        }
        else if (state == 'attack') {
            if (this.animation) {
                this.animation.play('attack');
            }
        }
        else if (state == 'attackdown') {
            if (this.animation) {
                this.animation.play('attackdown');
            }
        }
    }

    /*onTouchStart(event:MouseEvent){

if(!gameInfo.gameStart){            
    return;
}
//切换跳跃状态
this.changeState('jump');
let au:AudioClips=<AudioClips>this.getComponent('AudioClips');
//au.playAudioByName('jump');

    }*/

    onKeyDown(event: any)//D--68    J--74
    {
        console.log(event.keyCode);
        switch (event.keyCode) {
            case macro.KEY.d:
                this.changeState('jump');
                {
                    //音乐，起！
                    this.HitClip.play();
                    //遍历所有怪物节点
                    let self = this;
                    let idx = -1;
                    let cnt = self.Monster.children.length;
                    for (let i = 0; i < cnt; i++) {
                        let pos = self.Monster.children[i].getPosition();
                        //判断是否是上方的怪物
                        if (pos.y <= 0) continue;
                        //还没进入判定区域
                        else if (pos.x - self.wind_size > self.Hit_x) {
                            continue;
                        }
                        //打到啦！
                        else {
                            gameInfo.points += 200 + 2 * this.combo;
                            this.combo++;
                            if (idx == -1 || pos.x < self.Monster.children[idx].position.x) {
                                idx = i;
                            }
                        }
                    }
                    if (idx != -1) {
                        this.Hitin.setPosition(self.Monster.children[idx].position);
                        self.Monster.children[idx].destroy();
                        this.Hitin.active = true;
                    }
                }

                break;
            case macro.KEY.j:
                if (this.node.position.y <= -150)
                    this.changeState('attack');
                else {
                    this.changeState('attackdown');
                    this.node.setPosition(-450, -150);
                }
                {
                    //音乐，起！
                    this.HitClip.play();
                    //遍历所有怪物节点
                    let self = this;
                    let idx = -1;
                    let cnt = self.Monster.children.length;
                    for (let i = 0; i < cnt; i++) {
                        let pos = self.Monster.children[i].getPosition();
                        //判断是否是下方的怪物
                        if (pos.y >= 0) continue;
                        //还没进入判定区域
                        else if (pos.x - self.wind_size > self.Hit_x) {
                            continue;
                        }
                        //打到啦！
                        else {
                            this.combo++;
                            if (idx == -1 || pos.x < self.Monster.children[idx].position.x) {
                                idx = i;
                            }
                        }
                    }
                    if (idx != -1) {
                        this.Hitin.setPosition(self.Monster.children[idx].position);
                        self.Monster.children[idx].destroy();
                        this.Hitin.active = true;
                    }
                }

                break;
        }
    }

    onKeyUp() {
        console.log('up');
    }
}