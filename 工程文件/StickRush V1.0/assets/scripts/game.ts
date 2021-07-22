import { _decorator, Component, Node, Vec3, CCInteger, EventTouch, UITransform, Animation, AudioSource } from 'cc';
import { gameInfo } from './gameinfo'
const { ccclass, property } = _decorator;
@ccclass('Game')
export class Game extends Component {
    //公布一个空节点到属性检查器用来获取玩家节点
    @property(Node)
    playerN: Node = null!;
    start() {
        gameInfo.gameStart = true;
        let playerAnim = <Animation>this.playerN.getComponent(Animation);
        playerAnim.play('run');

    }
}
