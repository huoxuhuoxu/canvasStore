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

// 形状/贝塞尔 接口      返回定义 可以直接定义为 某个接口 或者 是 某个实体类
interface CanvasOptionInterface {
    //  如果使用 接口可选属性 方案 但是 对比我这是不确定传入的参数，所以不适用
    //  返回值为 void 的接口 可以 重定义为 其他类型 的返回值 / 接口中的返回值可以被重定义
    setOption(obj: any): any;

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

    // circle rect                          : arc:: 定义 特殊 arcTo    漏了画线
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

        this.axis = [...arr];                                           // 3.可能需要增加 close 的开关限制
        return this;
    }

}

// 设立 独立 追加方案 : 针对 舞台类
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

    // 图片类 重构 样式设置
    setStyle (): any{
        // 待定
    }

}

// 舞台接口
interface CanvasStageInterface {
    // 目前 支持 方法连缀 不支持 一次性多个图形的操作
    appendShare(obj: any): any;
    removeShare(obj: any): any;
    updateStage(): void;
    setFps(fps: number): any;
    stopStage(): void;
    tickStage(fn: any): void;

    appendImage(obj: any): any;                             // 追加图片 方案
}

class CanvasStage implements CanvasStageInterface {
    private stage: any;
    private height: number;
    private width: number;
    private fps: number = 30;                                 // 默认 30 毫秒
    private timer: any;
    private aItem: any[] = [];                                // 所有被添加的元素 集合组
    private aTempItem: any[] = [];                            // 临时 集合组 过滤 aItem 配合使用

    constructor ({id,width,height}){
        let oCanvas = document.getElementById(id);
        this.height = height? height : oCanvas.offsetHeight;    // 1.此处 优化 方案   默认全部清空 可 重置 h,w 值
        this.width = width? width : oCanvas.offsetWidth;
        // 检测 canvas 的支持
        if(!oCanvas.getContext){
            alert("sorry,you browser does not support html canvas element");
        }else{
            this.stage = oCanvas.getContext('2d');
        }

    }
    appendShare (obj: any): any{                   // 不能解构 区别: 接下来需要 堆指向支持 ? 暂时 不支持一次性多个添加

        this.stage.beginPath();                         // 暂时不加 空间 防止 降低 灵活度

        if(!this.shapeSwitchDraw(obj)){                 // 返回 不为真 ，结束
            return false;
        };

        if(obj.close){
            this.stage.closePath();
        }
        if(obj.fc){
            this.stage.fillStyle = obj.fc;
            this.stage.fill();
        }
        if(obj.sc){
            this.stage.strokeStyle = obj.sc;
            this.stage.stroke();
        }
        if(!obj.close){
            this.stage.closePath();
        }
        this.aItem.push(obj);                              // 添加进 集合组

        return this;
    }
    updateStage (): void{                                 // 默认 整张画布 全部 更新
        this.stage.clearRect(0,0,this.width,this.height);

        for(let i in this.aItem){                       // 清空之后 重新 画布 添加 图形

            this.appendShare(this.aItem[i]);
            this.aTempItem.push(this.aItem[i]);         // 临时数组 记录 图形
        }
        this.aItem = this.aTempItem;                    // 替换 集合组
        this.aTempItem = [];

        this.timer = null;
        this.timer = setTimeout(arguments.callee.caller,this.fps);      // 执行 引用函数 tickStage

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

    // 提供 在初始化 之后 更改参数的方式
    get stageOption(): any{
        return {width: this.width,height: this.height};
    }
    set stageOption({width,height}){                                      // 并不改变 canvas 本身 只是提供 清空范围参数
        this.width = (width||width==0)? width : this.width;
        this.height = (height||height==0)? height : this.height;
    }

    // 封装   绘制过程
    private shapeSwitchDraw(obj: any): boolean{
        switch(obj.shape){                              // 形状判别       图形拓展？
            case 'circle':
                this.stage.arc(obj.x,obj.y,obj.r,obj.sa,obj.ea,false);
                break;
            case 'rect':
                this.stage.rect(obj.x,obj.y,obj.w,obj.h);
                break;
            case 'bezier':
                this.stage.moveTo(obj.ix,obj.iy);
                this.stage.bezierCurveTo(obj.cp1x,obj.cp1y,obj.cp2x,obj.cp2y,obj.x,obj.y);
                break;
            case 'quadratic':
                this.stage.moveTo(obj.ix,obj.iy);
                this.stage.quadraticCurveTo(obj.cp1x,obj.cp1y,obj.x,obj.y);
                break;
            case 'line':
                let initpos = obj.axis[0];

                this.stage.moveTo(initpos[0],initpos[1]);
                for(let i=1;i<obj.axis.length;i++){
                    this.stage.lineTo(obj.axis[i][0],obj.axis[i][1]);
                }

                break;
            default:
                this.stage.closePath();
                console.log('error:shape');
                return false;
        }
        return true;
    }

    // 追加 图片 方案
    appendImage (obj: any): any{                                    // 只 提供 new Image 方案
        let oImg = new Image();
        oImg.src = obj.image;
        let oStage = this.stage;
        oImg.onload = function(){
            console.log(obj);
            if(obj.sx || obj.sx==0){
                let w = obj.w? obj.w : obj.sw;                          // 判定 如果参数不够
                let h = obj.h? obj.h : obj.sh;
                //sx,sy,sw,sh,dx,dy,dw,dh    图片源的切割 以及 在canvas 中的位置
                oStage.drawImage(oImg,obj.sx,obj.sy,obj.sw,obj.sh,obj.x,obj.y,w,h);
                return false;
            }
            if(obj.w || obj.w==0){
                oStage.drawImage(oImg,obj.x,obj.y,obj.w,obj.h);
                return false;
            }
            if(obj.x || obj.x==0){
                oStage.drawImage(oImg,obj.x,obj.y);
                return false;
            }
        }

        return this;
    }

}

// 最终接口
interface CanvasStoreInterface {

    createStage({id,width,height}): any;         // 定义舞台
    createShape(shape: string): any;      // 定义形状
    createBezier(shape: string): any;      // 定义贝塞尔曲线
    createLine(shape: string): any;      // 定义线条
    createImage(shape: string): any;      // 定义图片
}

class CanvasStore implements CanvasStoreInterface {

    private recognition: number = 0;

    createStage: any = ({id,width,height})=> new CanvasStage({id,width,height});

    createShape: any = (shape: string)=> new CanvasShape(this.reckonRecognition(),shape);

    createBezier: any = (shape: string)=> new CanvasBezier(this.reckonRecognition(),shape);

    createLine: any = (shape: string)=> new CanvasLine(this.reckonRecognition(),shape);

    createImage: any = (shape: string)=> new CanvasImage(this.reckonRecognition(),shape);


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
*   1.在最终类中使用标识符 完成对每个图形独立化的确认
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


// 测试 ts 对 es6 的支持
class Test {

    createStyle (a:number =12, b:number =67){               // 支持
        console.log(a,b);
    }

    // 传入的是数组 自动解成 多个单独的参数 / 传入的是多个参数 自动合并成一个数组
    createArguments (...arr){                                // 支持
        for(var i in arr){
            console.log(arr[i]);
        }
    }
    createArray2 (...arr){                                  // 支持
        return Math.max(...arr);
    }
    deCreateArray (){                                       // 支持
        var a = [0];
        let b = [1,2,3,4];
        let f = [2,4,5,6,7];

        return [0,...a,...b,...f,09,87,65,54];
    }

    fnC = arr=>arr.map(x=>x*x);                          // 支持
    /*
     * fnC(arr){
     * arr.map(x){
     * return x*x;}
     * }*/

    fnB=v=>v;                                            // 支持

    // export / import                                  // 支持 但与 原生 有 区别

    //fnF (){                                               // 不支持 promise 对象
    //    var promise = new Promise(function(resolve,reject){
    //        if(true){
    //            resolve(1);
    //        }else{
    //            reject(2);
    //        }
    //    });
    //}

    //fnE (){                                            // 不支持
    //    var s = new Set();
    //    [1,2,3,4,5].map(x=>s.add(x));
    //    for (let i of s){
    //        console.log(i);
    //    }
    //}

    //fnD = value => value.sort(function(a,b){return a-b});             // 有待在测试

    //function* fnA(){                                  // Generator 对象，不支持
    //    yield "hello";
    //}

    //fnA (){                                            // 不支持
    //    var map = new Map();
    //    map.set('aa','aaa1');
    //    map.set('bbb','vvvv2');
    //    for(let [key,value] of map){
    //        console.log(key+"is"+value);
    //    }
    //}

    //createArrayFill (){                                     // 不支持
    //    return [1,2,3,4].fill(7);
    //}

    //createArrayForm (){                                     // 不支持
    //    let arr = [1,2,3,4,5,6];
    //    return Array.from(arr,i=>i*i);
    //}

    //createArray (){                                         // 不支持
    //    var arr = [1,2,3,4,5,6];
    //    var b =  [for (i of arr) i*i];
    //    return b;
    //}





}

























