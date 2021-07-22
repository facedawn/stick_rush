import { _decorator, Component, Node, CCInteger, Vec3, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { gameInfo } from './gameinfo';
@ccclass('Scroll')
export class Scroll extends Component {

    //公布一个空节点到属性检查器获取参与滚动的第一个节点
    @property(Node)
    node1: Node = null!;
    //公布一个空节点到属性检查器获取参与滚动的第二个节点
    @property(Node)
    node2: Node = null!;
    //公布一个number型变量到属性检查器用来设置滚动的速度
    @property(CCInteger)
    speed: number = 0;
    //用来接收两个滚动节点的UITransform组件
    private uiTransform1: UITransform = null!;
    private uiTransform2: UITransform = null!;

    onLoad() {
        //获取两个滚动节点的UITransform组件
        this.uiTransform1 = <UITransform>this.node1.getComponent(UITransform);
        this.uiTransform2 = <UITransform>this.node2.getComponent(UITransform)
    }

    update(deltaTime: number) {
        //判断游戏是否开始
        if (!gameInfo.gameStart) {
            return;
        }
        //控制两个节点的移动
        //移动后的位置 = 移动前的位置 + 位移变化量（速度 * 时间）
        let x1: number = this.node1.position.x + this.speed * deltaTime;
        this.node1.position = new Vec3(x1, 0, 0);
        let x2: number = this.node2.position.x + this.speed * deltaTime;
        this.node2.position = new Vec3(x2, 0, 0);

        //判断两个节点是否出界
        if (this.node1.position.x <= -this.uiTransform1.width) {
            //第一个节点出界后接到第二个节点后面
            let x1: number = this.node2.position.x + this.uiTransform2.width;
            this.node1.position = new Vec3(x1, 0, 0);
        }
        if (this.node2.position.x <= -this.uiTransform2.width) {
            //第二个节点出界后接到第一个节点后面
            let x2: number = this.node1.position.x + this.uiTransform1.width;
            this.node2.position = new Vec3(x2, 0, 0);
        }
    }
}
