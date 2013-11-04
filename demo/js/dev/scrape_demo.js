(function ($, window) {
    var $canvas = "",
        ctx = "";

    function rgbToHex(r, g, b) {

        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    //图层颜色.
    var rgbA = {
        R:255,
        G:215,
        B:0,
        A:255
    }

    var Style = {
        Fill: rgbToHex(rgbA.R,rgbA.G,rgbA.B),
        globalComposite: 'destination-out',
        Radius: 30,
        lineJoin: "round",
        lineCap: "round",
        strokeStyle: rgbToHex(rgbA.R,rgbA.G,rgbA.B),
        lineWidth: 30
    }
    var wrapper,
        canvas
        ;

    var $scrape;
    function init(w,c){
        wrapper = w;
        canvas = c;
        $canvas = $(canvas);
        $scrape = $('#output');
        draw();
    }

    function draw(){
        ctx = $canvas[0].getContext('2d');
        isNext = true;

        var w = 300,
            h = $canvas.height(),
            clientOffsetX =  $canvas[0].getBoundingClientRect().left,
            clientOffsetY = $canvas[0].getBoundingClientRect().top
            ;

        //设置奖项.

        $canvas[0].width = '300'; //强刷.
        ctx.globalCompositeOperation = "source-over"; //解决部分手机白屏.
        ctx.fillStyle = Style.Fill;
        ctx.fillRect(0, 0, w, h);


        $scrape.off();

        function touchStart(e){
            e.preventDefault();

            //设置笔触.
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = Style.globalComposite;
            ctx.lineJoin = Style.lineJoin;
            ctx.lineCap = Style.lineCap;
            ctx.strokeStyle = Style.strokeStyle;
            ctx.lineWidth = Style.lineWidth;

            oldX =  e.changedTouches[0].clientX - clientOffsetX;
            oldY =  e.changedTouches[0].clientY - clientOffsetY;

            ctx.beginPath();
            ctx.moveTo(oldX,oldY);

            $scrape.on('touchmove', touchMove);
            $scrape.on('touchend', touchEnd);
        };
        $scrape.on('touchstart', touchStart);


        var oldX,
            oldY,
            curX,
            curY
            ;

        function touchMove(e){
            e.preventDefault();

            curX =  e.changedTouches[0].clientX - clientOffsetX;
            curY =  e.changedTouches[0].clientY - clientOffsetY;

            ctx.lineTo(curX, curY);
            ctx.stroke();

            oldX = curX;
            oldY = curY;

            forceUpdate();
        };

        function touchEnd(e){
            e.preventDefault();

            $scrape.off('touchmove', touchMove);
            $scrape.off('touchend', touchEnd);


            ctx.closePath();
            isOver();
        };

        function forceUpdate(){
            $canvas.css('padding-right', $canvas.css('padding-right') == "0px" ? "1px" : "0px");
        };

        function isOver() {
            var data = ctx.getImageData(0, 0, w, h).data
                ;

            //剩余像素（未被刮开）点数。
            for (var i = 0, j = 0, k = 0; i < data.length; i += 4,k++) {
                if ((data[i] == rgbA.R) && (data[i + 1] == rgbA.G) && (data[i + 2] == rgbA.B) && (data[i + 3] == rgbA.A)) {
                    j++;
                }
            }


            //图层被刮页面大于30%
            if ((j / (w * h)) < 0.7) {
                //Todo
            }
        }
    }

    window.Scrape = init;

})(Zepto, window);



(function ($, window) {
    Scrape('#output','#myCanvas');
})(Zepto, window);

