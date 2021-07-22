
import { _decorator, Component, Node, log, CCInteger, UITransform, Vec3, find, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends Component {

    private moveTween: Tween<Node> = null!;

    @property(Number)
    speed: number = null!;

    @property(Number)
    height: number = null!;

    onLoad() {
        let uiTransform = find('画布')?.getComponent(UITransform)!;
        let winSize = uiTransform.contentSize;
        this.node.position = new Vec3(winSize.width + 100, this.height, 0);
        this.move();
    }

    move() {
        let uiTransform = find('画布')?.getComponent(UITransform)!;
        let winSize = uiTransform.contentSize;
        this.moveTween = tween(this.node)
            .by(1 / this.speed, { position: new Vec3(-(winSize.width + 1000), 0, 0) })
            .removeSelf();
        this.moveTween.start();
    }

}
