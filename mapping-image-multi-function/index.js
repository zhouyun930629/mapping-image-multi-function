class ChangeImage {
    constructor(config = {}) {
        this.$config = config || {};
        this.$src = config.src || '';
        this.$width = config.width || '';
        this.$height = config.height || '';
        this.$callback = config.callback || null;
        this.$base64Url = config.base64Url || '';
        this.$quality = config.quality || 0.8;
        this.$type = config.type || "image/jpeg";
        this.$decompression = config.decompression || false;
        if (this.$src) {
            this.imageUrlToBase64();
        } else if (this.$base64Url) {
            this.photoCompress();
        }
    }
    imageUrlToBase64({ src, width, height, callback, quality, type, decompression }) {
        console.log(1);
        if (!src) { return }
        let base64Url = null;
        let image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = src || this.$src;
        image.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = width || this.$width || image.width;
            canvas.height = height || this.$height || image.height;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, width || this.$width || image.width, height || this.$height || image.height);
            base64Url = canvas.toDataURL(type || this.$type, quality || this.$quality);//使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
            if (decompression || this.$decompression) {
                this.photoCompress({ base64Url, width, height, callback, quality, type })
            } else {
                if (typeof callback === "function") {
                    callback(base64Url)
                } else {
                    this.$callback(base64Url)
                }
            }
        }
    }
    photoCompress({ base64Url, width, height, callback, quality, type }) {
       debugger
        if (!base64Url) { return }
        var img = new Image();
        img.src = base64Url || this.$base64Url;
        img.onload = () => {
            var that = this;
            var w = width || that.$width || img.width,
                h = height || that.$height || img.height;
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var anw = document.createAttribute("width");
            anw.nodeValue = w;
            canvas.setAttributeNode(anw);
            var anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anh);
            ctx.drawImage(img, 0, 0, w, h);
            var base64 = canvas.toDataURL(type || this.$type, quality || this.$quality);
            if (typeof callback === "function") {
                callback(base64)
            } else {
                this.$callback(base64)
            }
        };
    }
}
export default ChangeImage;