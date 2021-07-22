
import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('Select')
export class Select extends Component {

    confirmed() {
        director.loadScene("Game");
    }

}
