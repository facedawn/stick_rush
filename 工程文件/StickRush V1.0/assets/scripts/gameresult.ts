
import { _decorator, Component, Node, Label, tween, Widget } from 'cc';
import { gameInfo } from './gameinfo';
const { ccclass, property } = _decorator;

@ccclass('GameResult')
export class GameResult extends Component {

    @property(Label)
    maxComboLabel: Label = null!;

    @property(Label)
    missLabel: Label = null!;

    @property(Label)
    pointsLabel: Label = null!;

    startPointsAnimation(): void {
        this.playNumberAnimation(0, gameInfo.maxCombo, this.maxComboLabel);
        this.playNumberAnimation(0, gameInfo.miss, this.missLabel);
        this.playNumberAnimation(0, gameInfo.points, this.pointsLabel);
    }

    playNumberAnimation(ori: number, tar: number, label: Label): void {
        let obj = { num: ori };
        label.string = ori.toString();
        tween(obj).to(1, { num: tar }, {
            progress: (start, end, current, t) => {
                label.string = Math.ceil(start + (end - start) * t).toString();
                (label.getComponent(Widget) as Widget).updateAlignment();
                return start + (end - start) * t;
            }
        }).start();
    }

}
