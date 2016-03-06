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
var CanvasText = (function (_super) {
    __extends(CanvasText, _super);
    function CanvasText(recognition, shape) {
        if (shape === void 0) { shape = "text"; }
        _super.call(this, recognition, shape);
    }
    CanvasText.prototype.setOption = function (_a) {
        var text = _a.text, x = _a.x, y = _a.y;
        this.text = text ? text : this.text;
        this.x = x ? x : this.x;
        this.y = y ? y : this.y;
        return this;
    };
    CanvasText.prototype.appendShow = function (stage) {
        stage.stage.font = "30px Verdana";
        var a = this.text;
        var b = Math.ceil(a.length * 30 / 3);
        stage.fillStyle = this.fc;
        stage.fillText(this.text, this.x - b, this.y + 30 / 2);
        return true;
    };
    return CanvasText;
})(CanvasStyle);
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
    CanvasBezier.prototype.appendShow = function (stage) {
        if (this.shape == "bezier") {
            stage.moveTo(this.ix, this.iy);
            stage.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y);
            return true;
        }
        if (this.shape == "quadratic") {
            stage.moveTo(this.ix, this.iy);
            stage.quadraticCurveTo(this.cp1x, this.cp1y, this.x, this.y);
            return true;
        }
        return false;
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
    CanvasShape.prototype.appendShow = function (stage) {
        if (this.shape == "rect") {
            stage.rect(this.x, this.y, this.w, this.h);
            return true;
        }
        if (this.shape == "circle") {
            stage.arc(this.x, this.y, this.r, this.sa, this.ea, false);
            return true;
        }
        return false;
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
        this.axis = arr;
        return this;
    };
    CanvasLine.prototype.appendShow = function (stage) {
        if (this.shape == 'line') {
            var initpos = this.axis[0];
            stage.moveTo(initpos[0], initpos[1]);
            for (var i = 1; i < this.axis.length; i++) {
                stage.lineTo(this.axis[i][0], this.axis[i][1]);
            }
            return true;
        }
        return false;
    };
    return CanvasLine;
})(CanvasStyle);
var CanvasBlend = (function (_super) {
    __extends(CanvasBlend, _super);
    function CanvasBlend(recognition, shape) {
        if (shape === void 0) { shape = "blend"; }
        _super.call(this, recognition, shape);
        this.close = true;
    }
    CanvasBlend.prototype.setOption = function () {
        var arr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i - 0] = arguments[_i];
        }
        this.blends = arr;
        return this;
    };
    CanvasBlend.prototype.appendShow = function (stage) {
        for (var i in this.blends) {
            this.blends[i].appendShow(stage);
        }
        return true;
    };
    return CanvasBlend;
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
    CanvasImage.prototype.appendShow = function (stage) {
        var oImg = new Image();
        oImg.src = this.image;
        var oStage = stage;
        var _this = this;
        oImg.onload = function () {
            if (_this.sx || _this.sx == 0) {
                var w = _this.w ? _this.w : _this.sw;
                var h = _this.h ? _this.h : _this.sh;
                oStage.drawImage(oImg, _this.sx, _this.sy, _this.sw, _this.sh, _this.x, _this.y, w, h);
                return true;
            }
            if (_this.w || _this.w == 0) {
                oStage.drawImage(oImg, _this.x, _this.y, _this.w, _this.h);
                return true;
            }
            if (_this.x || _this.x == 0) {
                oStage.drawImage(oImg, _this.x, _this.y);
                return true;
            }
            return false;
        };
        return true;
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
        this.globalCompositeOperation = "source-over";
        this.translate = [0, 0];
        this.rotate = 0;
        this.canvas = document.getElementById(id);
        this.height = height ? height : this.canvas.offsetHeight;
        this.width = width ? width : this.canvas.offsetWidth;
        if (!this.canvas.getContext) {
            alert("sorry,you browser does not support html canvas element");
        }
        else {
            this.stage = this.canvas.getContext('2d');
        }
    }
    CanvasStage.prototype.setOption = function (_a) {
        var translate = _a.translate, rotate = _a.rotate, gco = _a.gco;
        this.translate = translate ? translate : this.translate;
        this.rotate = rotate ? rotate : this.rotate;
        this.globalCompositeOperation = gco ? gco : this.globalCompositeOperation;
    };
    CanvasStage.prototype.appendSpace = function () {
        var arr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i - 0] = arguments[_i];
        }
        this.stage.save();
        this.stage.translate(this.translate[0], this.translate[1]);
        this.stage.rotate(this.rotate);
        for (var i in arr) {
            this.stage.beginPath();
            if (!this.shapeSwitchDraw(arr[i])) {
                return false;
            }
            if (arr[i].close) {
                this.stage.closePath();
            }
            if (arr[i].fc) {
                this.stage.fillStyle = arr[i].fc;
                this.stage.fill();
            }
            if (arr[i].sc) {
                this.stage.strokeStyle = arr[i].sc;
                this.stage.stroke();
            }
            if (!arr[i].close) {
                this.stage.closePath();
            }
            this.aItem.push(arr[i]);
        }
        this.stage.restore();
        return this;
    };
    CanvasStage.prototype.appendShare = function () {
        var arr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i - 0] = arguments[_i];
        }
        for (var i in arr) {
            this.stage.beginPath();
            if (!this.shapeSwitchDraw(arr[i])) {
                return false;
            }
            if (arr[i].close) {
                this.stage.closePath();
            }
            if (arr[i].fc) {
                this.stage.fillStyle = arr[i].fc;
                this.stage.fill();
            }
            if (arr[i].sc) {
                this.stage.strokeStyle = arr[i].sc;
                this.stage.stroke();
            }
            if (!arr[i].close) {
                this.stage.closePath();
            }
            this.aItem.push(arr[i]);
        }
        return this;
    };
    CanvasStage.prototype.updateStage = function (derail) {
        if (derail === void 0) { derail = true; }
        this.stage.clearRect(0, 0, this.width, this.height);
        for (var i in this.aItem) {
            this.appendShare(this.aItem[i]);
            this.aTempItem.push(this.aItem[i]);
        }
        this.aItem = this.aTempItem;
        this.aTempItem = [];
        if (derail) {
            console.log(1);
            this.timer = null;
            this.timer = setTimeout(arguments.callee.caller, this.fps);
        }
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
    CanvasStage.prototype.cleanStage = function () {
        this.aItem = [];
        this.stage.clearRect(0, 0, this.width, this.height);
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
        var b = obj.appendShow(this.stage);
        if (!b) {
            this.stage.closePath();
            console.log('error:shape');
            return false;
        }
        return true;
    };
    CanvasStage.prototype.getDataUrl = function (_a) {
        var type = _a.type, radio = _a.radio;
        var sImageData = null;
        if (!type) {
            type = "image/png";
        }
        if (radio) {
            sImageData = this.canvas.toDataURL(type, radio);
        }
        else {
            sImageData = this.canvas.toDataURL(type);
        }
        var sImageBlob = this.convertBase64UrlToBlob(sImageData, type);
        return [sImageData, sImageBlob];
    };
    CanvasStage.prototype.convertBase64UrlToBlob = function (urlData, type) {
        if (type === void 0) { type = "image/jpeg"; }
        var bytes = window.atob(urlData.split(',')[1]);
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], { "type": type });
    };
    CanvasStage.prototype.destoryOption = function () {
        this.translate = [0, 0];
        this.rotate = 0;
        this.globalCompositeOperation = "source-over";
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
        this.createText = function (shape) { return new CanvasText(_this.reckonRecognition(), shape); };
        this.createBlend = function (shape) { return new CanvasBlend(_this.reckonRecognition(), shape); };
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