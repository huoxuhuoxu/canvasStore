/**
 * Created by zhen on 2016/1/29.
 */
// canvas grunt store

// 形状/贝塞尔 父类 : 样式 类
class CanvasStyle {
    protected shape: string;
    protected fc: string;
    protected sc: string;

    protected t: number;                                        // 由 最终类 中方法 判别 标识 独立性

    constructor (recognition: number,shape: string){          // 初始化 创建 时 默认不允许连缀
        this.shape = shape;
        this.t = recognition;
    }
    setStyle ({fc,sc}): any{
        this.fc = fc? fc : this.fc;
        this.sc = sc? sc : this.sc;
        return this;
    }
}

// 各独立类 接口      返回定义 可以直接定义为 某个接口 或者 是 某个实体类
interface CanvasOptionInterface {
    //  如果使用 接口可选属性 方案 但是 对比我这是不确定传入的参数，所以不适用
    //  返回值为 void 的接口 可以 重定义为 其他类型 的返回值 / 接口中的返回值可以被重定义
    setOption(obj: any): any;

    //  判别 是否追加 set/get option 方式 ？ setOption可以连缀 / set/get 用 = 不能连缀

    appendShow(obj: any): boolean;                    // 每个独立类自己实现 创建   反向传入 舞台实例

}
// 文字 类
class CanvasText extends CanvasStyle implements CanvasOptionInterface {
    private text;
    private x;
    private y;

    constructor (recognition: number,shape: string = "text"){
        super(recognition,shape);
    }

    setOption ({text,x,y}){
        this.text = text? text : this.text;
        this.x = x? x : this.x;
        this.y = y? y : this.y;
        return this;
    }
    appendShow (stage): boolean{
        stage.stage.font="30px Verdana";
        var a = this.text;
        var b = Math.ceil(a.length * 30 / 3);
        stage.fillStyle = this.fc;
        stage.fillText(this.text,this.x - b,this.y + 30/2);
        return true;
    }

}
// 贝塞尔曲线 类
class CanvasBezier extends CanvasStyle implements CanvasOptionInterface {
    private ix;
    private iy;                                                         // moveTo 的 初始点位
    private cp1x;
    private cp1y;
    private cp2x;
    private cp2y;                                                       // 控制点位
    private x;
    private y;                                                          // 结束点位
    private close: boolean = false;                                             // 默认绘制完成后关闭

    // quadratic / bezier
    constructor (recognition: number,shape: string = "bezier"){
        super(recognition,shape);
    }

    setOption ({ix,iy,cp1x,cp1y,cp2x,cp2y,x,y,close}){                        // 数据解构 默认为 可选参数
        this.ix = ix? ix : this.ix;
        this.iy = iy? iy : this.iy;
        this.cp1x = cp1x? cp1x : this.cp1x;
        this.cp1y = cp1y? cp1y : this.cp1y;
        this.cp2x = cp2x? cp2x : this.cp2x;
        this.cp2y = cp2y? cp2y : this.cp2y;
        this.x = x? x : this.x;
        this.y = y? y : this.y;
        this.close = close? close : this.close;
        return this;
    }

    appendShow(stage): boolean{
        if(this.shape == "bezier"){
            stage.moveTo(this.ix,this.iy);
            stage.bezierCurveTo(this.cp1x,this.cp1y,this.cp2x,this.cp2y,this.x,this.y);
            return true
        }
        if(this.shape == "quadratic"){
            stage.moveTo(this.ix,this.iy);
            stage.quadraticCurveTo(this.cp1x,this.cp1y,this.x,this.y);
            return true;
        }
        return false;
    }

}
// 形状 类
class CanvasShape extends CanvasStyle implements CanvasOptionInterface {

    private x: number = 0;
    private y: number = 0;
    private w: number = 0;
    private h: number = 0;
    private r: number = 0;
    private sa: number = 0;
    private ea: number = Math.PI*2;
    private close: boolean = true;                         // 默认绘制开始前关闭

    // circle rect                          : arc:: 定义 特殊 arcTo
    constructor (recognition: number,shape: string = "circle"){
        super(recognition,shape);                           // 继承 父类 构造函数
    }
    setOption ({x,y,w,h,r,sa,ea,close}): any{               // 解构 接收
        this.x = x? x : this.x;
        this.y = y? y : this.y;
        this.w = w? w : this.w;
        this.h = h? h : this.h;
        this.r = r? r : this.r
        this.sa = (sa||sa==0)? sa : this.sa;
        this.ea = (ea||ea==0)? ea : this.ea;
        this.close = (close||close==false)? close : this.close;
        return this;
    }

    appendShow (stage): boolean{
        if(this.shape=="rect"){
            stage.rect(this.x,this.y,this.w,this.h);
            return true;
        }
        if(this.shape=="circle"){
            stage.arc(this.x,this.y,this.r,this.sa,this.ea,false);
            return true;
        }
        return false;
    }

}

// 线 类
class CanvasLine extends CanvasStyle implements CanvasOptionInterface {

    private axis: Array<number>;
    private close: boolean = true;                                    // 默认绘制前关闭 并且 暂时 不提供 开关方案 与 语法相关 ...arr

    // quadratic / bezier
    constructor (recognition: number,shape: string = "line"){
        super(recognition,shape);
    }

    setOption (...arr): any{
        this.axis = arr;                                           // 3.可能需要增加 close 的开关限制
        return this;
    }

    appendShow (stage): boolean{
        if(this.shape=='line'){
            let initpos = this.axis[0];
            stage.moveTo(initpos[0],initpos[1]);
            for(let i=1;i<this.axis.length;i++){
                stage.lineTo(this.axis[i][0],this.axis[i][1]);
            }
            return true;
        }
        return false;
    }

}

// 多图形 类
class CanvasBlend extends CanvasStyle implements CanvasOptionInterface {

    private blends: Array<any>;
    private close: boolean = true;

    constructor (recognition: number,shape: string = "blend"){
        super(recognition,shape);
    }

    setOption (...arr): any{
        this.blends = arr;
        return this;
    }

    appendShow(stage): boolean{
        for(let i in this.blends){
            this.blends[i].appendShow(stage);
        }
        return true;
    }

}

// 设立 独立 追加方案 : 针对 舞台类              图片接口
class CanvasImage extends CanvasStyle implements CanvasOptionInterface {

    private image: string;
    private x: number;
    private y: number;
    private h: number;
    private w: number;
    private sx: number;
    private sy: number;
    private sw: number;
    private sh: number;

    constructor (recognition: number,shape: string = "image"){
        super(recognition,shape);
    }

    setOption ({image,x,y,w,h,sx,sy,sw,sh}): any{
        this.image = image? image : this.image;
        this.x = (x||x==0) ? x : this.x;
        this.y = (y||y==0) ? y : this.y;
        this.w = (w||w==0) ? w : this.w;
        this.h = (h||h==0) ? h : this.h;
        this.sx = (sx||sx==0) ? sx : this.sx;
        this.sy = (sy||sy==0) ? sy : this.sy;
        this.sw = (sw||sw==0) ? sw : this.sw;
        this.sh = (sh||sh==0) ? sh : this.sh;
        return this;
    }

    appendShow(stage): boolean{

        let oImg = new Image();
        oImg.src = this.image;
        let oStage = stage;
        let _this = this;
        oImg.onload = function(){
            if(_this.sx || _this.sx==0){
                let w = _this.w? _this.w : _this.sw;                          // 判定 如果参数不够
                let h = _this.h? _this.h : _this.sh;
                //sx,sy,sw,sh,dx,dy,dw,dh    图片源的切割 以及 在canvas 中的位置
                oStage.drawImage(oImg,_this.sx,_this.sy,_this.sw,_this.sh,_this.x,_this.y,w,h);
                return true;
            }
            if(_this.w || _this.w==0){
                oStage.drawImage(oImg,_this.x,_this.y,_this.w,_this.h);
                return true;
            }
            if(_this.x || _this.x==0){
                oStage.drawImage(oImg,_this.x,_this.y);
                return true;
            }
            return false;
        }
        return true;
    }

    // 图片类 重构 样式设置
    setStyle (): any{
        // pass
    }

}

// 自定义类型 针对 空间方案
interface CanvasSpaceInterface {
    translate?: number[];                    // 重置 初始位
    rotate?: any;                            // 旋转 算法
    gco?: string;                             // 重叠 处理
}

// 舞台接口
interface CanvasStageInterface {
    // 目前 append 一次性多个图形的操作 remove 不支持 使用 rest格式实现
    appendShare(obj: any): any;
    removeShare(obj: any): any;
    updateStage(derail: boolean): void;                     // 区分 自动 与 手动
    setFps(fps: number): any;
    stopStage(): void;
    tickStage(fn: any): void;

    getDataUrl(obj: any): any;                               // canvas 输出方案

    appendSpace(obj: any): any;                              // 追加 空间 方案
    setOption(obj: CanvasSpaceInterface): void;               // 设置 参数

    destoryOption(): any;                                    // 销毁 当前参数 规整功能   可能与 set/get Option 进行合并
    cleanStage(obj: any): any;                               // 清空画布

}

class CanvasStage implements CanvasStageInterface {

    private canvas: any;
    private stage: any;
    private height: number;
    private width: number;
    private fps: number = 30;                                 // 默认 30 毫秒
    private timer: any;
    private aItem: any[] = [];                                // 所有被添加的元素 集合组
    private aTempItem: any[] = [];                            // 临时 集合组 过滤 aItem 配合使用

    private globalCompositeOperation: string = "source-over";   // 待定 涉及 V 0.6 空间方案

    private translate: number[] = [0,0];                        // 追加V 0.6 空间方案
    private rotate: any = 0;

    constructor ({id,width,height}){
        this.canvas = document.getElementById(id);
        this.height = height? height : this.canvas.offsetHeight;    // 1.此处 优化 方案   默认全部清空 可 重置 h,w 值
        this.width = width? width : this.canvas.offsetWidth;
        // 检测 canvas 的支持
        if(!this.canvas.getContext){
            alert("sorry,you browser does not support html canvas element");
        }else{
            this.stage = this.canvas.getContext('2d');
        }

    }
    setOption ({translate,rotate,gco}: CanvasSpaceInterface){               // V 0.6 空间方案
        this.translate = translate? translate : this.translate;
        this.rotate = rotate? rotate : this.rotate;
        this.globalCompositeOperation = gco?gco : this.globalCompositeOperation;
    }
    appendSpace (...arr): any{
        this.stage.save();
        this.stage.translate(this.translate[0],this.translate[1]);
        this.stage.rotate(this.rotate);

        // 图形追加
        for(var i in arr){
            this.stage.beginPath();
            if(!this.shapeSwitchDraw(arr[i])){
                return false;
            }
            if(arr[i].close){
                this.stage.closePath();
            }
            if(arr[i].fc){
                this.stage.fillStyle = arr[i].fc;
                this.stage.fill();
            }
            if(arr[i].sc){
                this.stage.strokeStyle = arr[i].sc;
                this.stage.stroke();
            }
            if(!arr[i].close){
                this.stage.closePath();
            }
            this.aItem.push(arr[i]);
        }

        this.stage.restore();
        return this;
    }
    appendShare (...arr): any{                   // 不能解构 区别: 接下来需要 堆指向支持 ? 暂时 不支持一次性多个添加

        for(var i in arr){
            this.stage.beginPath();                 // 此方法 不能使用空间
            if(!this.shapeSwitchDraw(arr[i])){
                return false;
            }
            if(arr[i].close){
                this.stage.closePath();
            }
            if(arr[i].fc){
                this.stage.fillStyle = arr[i].fc;
                this.stage.fill();
            }
            if(arr[i].sc){
                this.stage.strokeStyle = arr[i].sc;
                this.stage.stroke();
            }
            if(!arr[i].close){
                this.stage.closePath();
            }
            this.aItem.push(arr[i]);                    // 添加进 集合组
        }

        return this;
    }
    updateStage (derail: boolean = true): void{             // 默认 整张画布 全部 更新
        this.stage.clearRect(0,0,this.width,this.height);

        for(let i in this.aItem){                       // 清空之后 重新 画布 添加 图形

            this.appendShare(this.aItem[i]);
            this.aTempItem.push(this.aItem[i]);         // 临时数组 记录 图形
        }
        this.aItem = this.aTempItem;                    // 替换 集合组
        this.aTempItem = [];

        if(derail){
            console.log(1)
            this.timer = null;
            this.timer = setTimeout(arguments.callee.caller,this.fps);      // 执行 引用函数 tickStage
        }

    }
    tickStage (fn: any): void{                             // 绑定 画布 更新
        if(typeof(fn) == "function"){                     //  2.目前 不对 机制 进行 错误判别
            fn();
        }
    }

    setFps (fps: number): any{
        this.fps = fps;
        return this;
    }
    stopStage (): void{
        this.updateStage();                                 // 关闭定时器 之前 在执行一次 ,让图形到满足关闭的位置
        clearTimeout(this.timer);
        this.timer = null;
    }

    removeShare (obj: any): any{                          // 情况: 关闭之前 规整,每次重新绘制 规整
        if(obj.t){
           for(let i in this.aItem){
               if(this.aItem[i].t == obj.t){
                   this.aItem.splice(i,1);
                   break;
               }
           }
        }
        return this;
    }

    cleanStage (): any{
        this.aItem = [];
        this.stage.clearRect(0,0,this.width,this.height);
        return this;
    }

    // 提供 在初始化 之后 更改参数的方式                                   拓展 默认参数
    get stageOption(): any{
        return {width: this.width,height: this.height};
    }
    set stageOption({width,height}){                                      // 并不改变 canvas 本身 只是提供 清空范围参数
        this.width = (width||width==0)? width : this.width;
        this.height = (height||height==0)? height : this.height;
    }

    // 封装   绘制过程
    private shapeSwitchDraw(obj: any): boolean{
        let b = obj.appendShow(this.stage);
        if(!b){
            this.stage.closePath();
            console.log('error:shape');
            return false;
        }
        return true;
    }

    // 输出canvas图片类型          clip 除非在save情况下 否则 会对真实画布进行切分
    getDataUrl({type,radio}): any{
        var sImageData = null;
        if(!type){
            type = "image/png";                                 // 默认按照 png 格式输出
        }
        if(radio){
            sImageData = this.canvas.toDataURL(type,radio);
        }else{
            sImageData = this.canvas.toDataURL(type);
        }
        let sImageBlob = this.convertBase64UrlToBlob(sImageData,type);
        return [sImageData,sImageBlob];                                 // [0]用于前端显示 [1]用于后端存储(FormData)
    }
    // 内置 base64 转 ascii 转 blob
    private convertBase64UrlToBlob(urlData: string, type: string="image/jpeg"): any{
        let bytes = window.atob(urlData.split(',')[1]);
        let ab = new ArrayBuffer(bytes.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], { "type": type });
    }

    // canvas 默认项参数初始化 (销毁)
    destoryOption(): any{
        this.translate = [0,0];
        this.rotate = 0;
        this.globalCompositeOperation = "source-over";
    }

}

// 最终接口
interface CanvasStoreInterface {

    createStage({id,width,height}): any;         // 定义舞台
    createShape(shape: string): any;      // 定义形状
    createBezier(shape: string): any;      // 定义贝塞尔曲线
    createLine(shape: string): any;      // 定义线条
    createImage(shape: string): any;      // 定义图片
    createText(shape: string): any;         // 定义文字
    createBlend(shape: string): any;       // 定义 混合图形

}

class CanvasStore implements CanvasStoreInterface {

    private recognition: number = 0;

    createStage: any = ({id,width,height})=> new CanvasStage({id,width,height});

    createShape: any = (shape: string)=> new CanvasShape(this.reckonRecognition(),shape);

    createBezier: any = (shape: string)=> new CanvasBezier(this.reckonRecognition(),shape);

    createLine: any = (shape: string)=> new CanvasLine(this.reckonRecognition(),shape);

    createImage: any = (shape: string)=> new CanvasImage(this.reckonRecognition(),shape);

    createText: any = (shape: string)=> new CanvasText(this.reckonRecognition(),shape);

    createBlend: any = (shape: string)=> new CanvasBlend(this.reckonRecognition(),shape);

    // 计算 独立标识符
    private reckonRecognition=()=>++this.recognition;

}






/*   V 0.1
*
* 1.创建一个舞台
* 2.定义一个形状,此时只是定义记录相关参数（shape）
* 3.定义形状的其他参数 (x,y,w,h)
* 4.追加到舞台 (此时根据这个形状之前的相关参数,将其创建 添加进舞台)
*
*实现原理: 利用对象属性的形式 来 完成相关参数的记录 与 创建.
*
* */

/* V 0.2
*  1.定义  舞台/形状 等 接口 并创建实现接口的实体类
*  2.为实体类 提供可供使用的方法等
*  3.定义 终极接口 以及 集成 其他实体类的 最终类
*
*  实现原理: 利用每次返回对象 , 堆指向原理
*
* */

/* V 0.3
*  1.动态的实现: 提供所有 需要绘制对象 , 每次 利用定时器 重绘
*  2.特殊 需要变动的 , 将新的变动值 代替就的变动值 , 然后 重绘
*
*  实现原理: 在最终类中 整合 并 提供 更新画布 方案
*  修改实现方案: 由 舞台类 绑定更新 机制 , 每次 重新 回调 更新 机制 按照延迟定时器原则
*
* */

/* V 0.4
*   1.在最终类中使用标识符 完成对每个图形独立化的确认      :不能使用静态变量,原因;每个独立的形状需要独立标识符
*   2.抽离 贝塞尔/形状类 的相同部分 建立父类 并 整合 接口
*   3.支持 正常情况下 各实例的方法连缀
*
*   实现原理: 继承 , 方法结束后返回 实例对象
*
* */

/* V 0.5
 *   1.语法方案: 基于 es6 数据解构.
 *   2.除了 舞台类 其他 类 全部 只定义相关参数,不进行 相关绘制
 *
 *   缺陷: 1. 每次新建一个形状 都必须 指定样式 , 无法继承之前的样式 ？针对 fc,sc
 *           造成原因: 每个都是独立的,相关的样式信息 记录在 形状类,并不是在舞台类
 *           解决方案: 可以通过fc,sc样式在舞台类中 共享 解决，但是这就无法判别 是否需要显示
 *           // 继续使用,现有方案.
 *         2. 追加 线条 类型 , 并且考虑是否 追加 在 一个路径结束之前 允许 多个 形状连接 绘制？
 *           ??? : 应该 不考虑 : 每次新开一个路径 开始绘制, 允许重叠 但是 不允许 一个路径多个形状链接,除非是 线条型
 *           // 线条型 允许 传递多个坐标点 进行 连接绘制,并且默认自动闭合 路径
 *         3. 追加: 在绘制结束之前 回调函数 来 增加 灵活性/可拓展性
 *         4. 追加 多图形重叠后 的 参数 : globalCompositeOperation
 *         5. 舞台类中增加 新方法: 追加图片 方案    / 图片 与 形状/贝塞尔等 追加 方案分离
 *
 * */

/* V 0.6
*   1. canvasDataUrlTo canvas图像输出方式  base64编码 转 ascII码 转二进制码
*   2. 舞台类增加 默认情况下的样式参数 设置 , 做到可以 形状/贝塞尔/线性 双重样式模式   (问题: 多少参数需要默认)   ???
*   3. 新增 线型 属性设置 lineWidth      ?? 追加 为舞台类 , 默认值？   2和3 合并解决 : 提供设置默认样式的方法
*   4. 新增 文字 绘制
*   5. V 0.5 中没有实现的 3. 回调模式                 ?? 此模式改为 舞台类中方法 不关闭路径的多图形绘制
*   6. shadow/gradient等参数 设置                ?? 是否 和 2,3 合并？
*   7. 开放形变空间 / 必要情况下 增加 追加方案
*
*   对于 7 的解决方案:
*       1. 传递 函数进来 , 在执行函数 完成 对 形变 的设置                          // 效率高 但 不该这样设计
*       2. 传递 对象进来 , 对对象进行解构 根据参数对 形变 进行设置                 // 相对效率慢 但 合理设计
*
*  对于 V 0.6 中 2，3 的解决方案:
*       1. 重订默认样式的设置 基于 舞台类 设置 : 通用类型样式 , 独立类型样式
*       2. 形状类 只提供 设定 相关参数 方法
*       3. 基类 提供 设置 独立样式 / 个体识别
*
*   改: appendSpace 使用拆离: appendSpace负责 追加空间内的图形，新增方法 设置 translate/rotate
*   改: 追加 单个图形绘制情况下的 多图形 传参 追加 多图形删除
*   改: 图形实际绘制 区域从 舞台类中移除,接口追加方法: 独立绘制图形
*   改: 同路径多图形绘制 从舞台类中抽离 独立建类 统一走 appendShare 调用
*
*   问: 重绘时的模式错误               : 从舞台类中 抽离 建立独立类
* */

/* V 0.7
*   0.1~0.6 实现功能 :
*       1. 空间模式/普通模式
*       2. 批量增加图形/单个删除图形/动态更新画布/设置更新帧率/修改图形参数,画布参数/清空画布
*       3. 提供:圆形，矩形，线形，贝塞尔曲线，图片，文字(不完善)，混合型
*
*  缺陷:
*       1. 利用rest格式 接收参数,如果是按数组的方式 传输进来,需要在加一层 rest
*       2. 每个类都有独立的样式,是否给舞台类设置默认的样式,或者统一样式？  当不存在样式时 调 舞台类的默认样式
*
*       新增:
*           1. gradient渐变效果,clip截取效果,层级设置
*           2. 对 文字类 的完善
*
*       原理: 舞台类 : 调用形状类，设置大范围使用的参数
*             形状类 : 独立参数设置 , 图形的实际生成
*             基类   : 形状类公共方法 , 独立标识符
*             最终类 : 公开接口
* */




























