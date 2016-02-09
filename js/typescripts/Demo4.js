var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CanvasStyle = (function () {
    function CanvasStyle(recognition, shape) {
        this.shape = shape;
        this.t = recognition;
    }
    CanvasStyle.prototype.setStyle = function (_a) {
        var fc = _a.fc, sc = _a.sc;
        this.fc = fc ? fc : this.fc;
        this.sc = sc ? sc : this.sc;
        return this;
    };
    return CanvasStyle;
})();
var CanvasBezier = (function (_super) {
    __extends(CanvasBezier, _super);
    function CanvasBezier(recognition, shape) {
        if (shape === void 0) { shape = "bezier"; }
        _super.call(this, recognition, shape);
        this.close = false;
    }
    CanvasBezier.prototype.setOption = function (_a) {
        var ix = _a.ix, iy = _a.iy, cp1x = _a.cp1x, cp1y = _a.cp1y, cp2x = _a.cp2x, cp2y = _a.cp2y, x = _a.x, y = _a.y, close = _a.close;
        this.ix = ix ? ix : this.ix;
        this.iy = iy ? iy : this.iy;
        this.cp1x = cp1x ? cp1x : this.cp1x;
        this.cp1y = cp1y ? cp1y : this.cp1y;
        this.cp2x = cp2x ? cp2x : this.cp2x;
        this.cp2y = cp2y ? cp2y : this.cp2y;
        this.x = x ? x : this.x;
        this.y = y ? y : this.y;
        this.close = close ? close : this.close;
        return this;
    };
    return CanvasBezier;
})(CanvasStyle);
var CanvasShape = (function (_super) {
    __extends(CanvasShape, _super);
    function CanvasShape(recognition, shape) {
        if (shape === void 0) { shape = "circle"; }
        _super.call(this, recognition, shape);
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.r = 0;
        this.sa = 0;
        this.ea = Math.PI * 2;
        this.close = true;
    }
    CanvasShape.prototype.setOption = function (_a) {
        var x = _a.x, y = _a.y, w = _a.w, h = _a.h, r = _a.r, sa = _a.sa, ea = _a.ea, close = _a.close;
        this.x = x ? x : this.x;
        this.y = y ? y : this.y;
        this.w = w ? w : this.w;
        this.h = h ? h : this.h;
        this.r = r ? r : this.r;
        this.sa = (sa || sa == 0) ? sa : this.sa;
        this.ea = (ea || ea == 0) ? ea : this.ea;
        this.close = (close || close == false) ? close : this.close;
        return this;
    };
    return CanvasShape;
})(CanvasStyle);
var CanvasLine = (function (_super) {
    __extends(CanvasLine, _super);
    function CanvasLine(recognition, shape) {
        if (shape === void 0) { shape = "line"; }
        _super.call(this, recognition, shape);
        this.close = true;
    }
    CanvasLine.prototype.setOption = function () {
        var arr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i - 0] = arguments[_i];
        }
        this.axis = arr.slice();
        return this;
    };
    return CanvasLine;
})(CanvasStyle);
var CanvasImage = (function (_super) {
    __extends(CanvasImage, _super);
    function CanvasImage(recognition, shape) {
        if (shape === void 0) { shape = "image"; }
        _super.call(this, recognition, shape);
    }
    CanvasImage.prototype.setOption = function (_a) {
        var image = _a.image, x = _a.x, y = _a.y, w = _a.w, h = _a.h, sx = _a.sx, sy = _a.sy, sw = _a.sw, sh = _a.sh;
        this.image = image ? image : this.image;
        this.x = (x || x == 0) ? x : this.x;
        this.y = (y || y == 0) ? y : this.y;
        this.w = (w || w == 0) ? w : this.w;
        this.h = (h || h == 0) ? h : this.h;
        this.sx = (sx || sx == 0) ? sx : this.sx;
        this.sy = (sy || sy == 0) ? sy : this.sy;
        this.sw = (sw || sw == 0) ? sw : this.sw;
        this.sh = (sh || sh == 0) ? sh : this.sh;
        return this;
    };
    CanvasImage.prototype.setStyle = function () {
    };
    return CanvasImage;
})(CanvasStyle);
var CanvasStage = (function () {
    function CanvasStage(_a) {
        var id = _a.id, width = _a.width, height = _a.height;
        this.fps = 30;
        this.aItem = [];
        this.aTempItem = [];
        var oCanvas = document.getElementById(id);
        this.height = height ? height : oCanvas.offsetHeight;
        this.width = width ? width : oCanvas.offsetWidth;
        if (!oCanvas.getContext) {
            alert("sorry,you browser does not support html canvas element");
        }
        else {
            this.stage = oCanvas.getContext('2d');
        }
    }
    CanvasStage.prototype.appendShare = function (obj) {
        this.stage.beginPath();
        if (!this.shapeSwitchDraw(obj)) {
            return false;
        }
        ;
        if (obj.close) {
            this.stage.closePath();
        }
        if (obj.fc) {
            this.stage.fillStyle = obj.fc;
            this.stage.fill();
        }
        if (obj.sc) {
            this.stage.strokeStyle = obj.sc;
            this.stage.stroke();
        }
        if (!obj.close) {
            this.stage.closePath();
        }
        this.aItem.push(obj);
        return this;
    };
    CanvasStage.prototype.updateStage = function () {
        this.stage.clearRect(0, 0, this.width, this.height);
        for (var i in this.aItem) {
            this.appendShare(this.aItem[i]);
            this.aTempItem.push(this.aItem[i]);
        }
        this.aItem = this.aTempItem;
        this.aTempItem = [];
        this.timer = null;
        this.timer = setTimeout(arguments.callee.caller, this.fps);
    };
    CanvasStage.prototype.tickStage = function (fn) {
        if (typeof (fn) == "function") {
            fn();
        }
    };
    CanvasStage.prototype.setFps = function (fps) {
        this.fps = fps;
        return this;
    };
    CanvasStage.prototype.stopStage = function () {
        this.updateStage();
        clearTimeout(this.timer);
        this.timer = null;
    };
    CanvasStage.prototype.removeShare = function (obj) {
        if (obj.t) {
            for (var i in this.aItem) {
                if (this.aItem[i].t == obj.t) {
                    this.aItem.splice(i, 1);
                    break;
                }
            }
        }
        return this;
    };
    Object.defineProperty(CanvasStage.prototype, "stageOption", {
        get: function () {
            return { width: this.width, height: this.height };
        },
        set: function (_a) {
            var width = _a.width, height = _a.height;
            this.width = (width || width == 0) ? width : this.width;
            this.height = (height || height == 0) ? height : this.height;
        },
        enumerable: true,
        configurable: true
    });
    CanvasStage.prototype.shapeSwitchDraw = function (obj) {
        switch (obj.shape) {
            case 'circle':
                this.stage.arc(obj.x, obj.y, obj.r, obj.sa, obj.ea, false);
                break;
            case 'rect':
                this.stage.rect(obj.x, obj.y, obj.w, obj.h);
                break;
            case 'bezier':
                this.stage.moveTo(obj.ix, obj.iy);
                this.stage.bezierCurveTo(obj.cp1x, obj.cp1y, obj.cp2x, obj.cp2y, obj.x, obj.y);
                break;
            case 'quadratic':
                this.stage.moveTo(obj.ix, obj.iy);
                this.stage.quadraticCurveTo(obj.cp1x, obj.cp1y, obj.x, obj.y);
                break;
            case 'line':
                var initpos = obj.axis[0];
                this.stage.moveTo(initpos[0], initpos[1]);
                for (var i = 1; i < obj.axis.length; i++) {
                    this.stage.lineTo(obj.axis[i][0], obj.axis[i][1]);
                }
                break;
            default:
                this.stage.closePath();
                console.log('error:shape');
                return false;
        }
        return true;
    };
    CanvasStage.prototype.appendImage = function (obj) {
        var oImg = new Image();
        oImg.src = obj.image;
        var oStage = this.stage;
        oImg.onload = function () {
            console.log(obj);
            if (obj.sx || obj.sx == 0) {
                var w = obj.w ? obj.w : obj.sw;
                var h = obj.h ? obj.h : obj.sh;
                oStage.drawImage(oImg, obj.sx, obj.sy, obj.sw, obj.sh, obj.x, obj.y, w, h);
                return false;
            }
            if (obj.w || obj.w == 0) {
                oStage.drawImage(oImg, obj.x, obj.y, obj.w, obj.h);
                return false;
            }
            if (obj.x || obj.x == 0) {
                oStage.drawImage(oImg, obj.x, obj.y);
                return false;
            }
        };
        return this;
    };
    return CanvasStage;
})();
var CanvasStore = (function () {
    function CanvasStore() {
        var _this = this;
        this.recognition = 0;
        this.createStage = function (_a) {
            var id = _a.id, width = _a.width, height = _a.height;
            return new CanvasStage({ id: id, width: width, height: height });
        };
        this.createShape = function (shape) { return new CanvasShape(_this.reckonRecognition(), shape); };
        this.createBezier = function (shape) { return new CanvasBezier(_this.reckonRecognition(), shape); };
        this.createLine = function (shape) { return new CanvasLine(_this.reckonRecognition(), shape); };
        this.createImage = function (shape) { return new CanvasImage(_this.reckonRecognition(), shape); };
        this.reckonRecognition = function () { return ++_this.recognition; };
    }
    return CanvasStore;
})();
var Test = (function () {
    function Test() {
        this.fnC = function (arr) { return arr.map(function (x) { return x * x; }); };
        this.fnB = function (v) { return v; };
    }
    Test.prototype.createStyle = function (a, b) {
        if (a === void 0) { a = 12; }
        if (b === void 0) { b = 67; }
        console.log(a, b);
    };
    Test.prototype.createArguments = function () {
        var arr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i - 0] = arguments[_i];
        }
        for (var i in arr) {
            console.log(arr[i]);
        }
    };
    Test.prototype.createArray2 = function () {
        var arr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i - 0] = arguments[_i];
        }
        return Math.max.apply(Math, arr);
    };
    Test.prototype.deCreateArray = function () {
        var a = [0];
        var b = [1, 2, 3, 4];
        var f = [2, 4, 5, 6, 7];
        return [0].concat(a, b, f, [09, 87, 65, 54]);
    };
    return Test;
})();
//# sourceMappingURL=Demo4.js.map