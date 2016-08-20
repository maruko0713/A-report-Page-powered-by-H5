//柱图表组件对象
var H5ComponentPolyline = function(name, cfg) {
    var component = new H5ComponentBase(name,cfg);
    // 绘制网格线
    var w = cfg.width;
    var h = cfg.height;
    // 加入一个画布做网格线的背景
    // 水平网格线 
    var cns = document.createElement("canvas");
    var ctx = cns.getContext("2d");
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);
    var cns_2 = document.createElement("canvas");
    var ctx_2 = cns.getContext("2d");
    cns_2.width = ctx.width = w;
    cns_2.height = ctx.height = h;
    component.append(cns_2);
    var step = cfg.data.length+1;
    var text_w = w/step;
    for(var i=0;i<step+1;i++){
        var x = w/step*i;
        if(cfg.data[i]){
        var text = $("<div class='text'>");
        text.text(cfg.data[i][0])
            .css("left",x/2+text_w/4)
            .css("width",text_w/2);
        component.append(text);
    }
    }
    /**
     * @param  {float} per 0-1之间的数据
     * @return {Dom} component元素
     */
    var draw = function(per) {
        // $(".text").remove();
        // ctx.clearRect(0,0,w,h);
        ctx_2.clearRect(0,0,w,h);
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.strokeStyle = "#F00";
         
        var step = 10;
        for(var i=0;i<step+1;i++) {

            var y = h/step*i;
            ctx.moveTo(0,y);
            ctx.lineTo(w,y);
        }
    // 垂直网格线
    step = cfg.data.length+1;
    var text_w = w/step;
    for(var i=0;i<step+1;i++){
        var x = w/step*i;
        ctx.moveTo(x,0);
        ctx.lineTo(x,h);
    }
    ctx.stroke();
    // 绘制折线数据
    ctx_2.beginPath();
    ctx_2.lineWidth=3;
    ctx_2.strokeStyle = "#fff8878";
    var x=0;
    var y=0;
    for(i in cfg.data) {
        var item = cfg.data[i];
        x = (w/step)*(parseInt(i)+1);
        y=h*(1-item[1]*per);
        ctx_2.moveTo(x,y);
        ctx_2.arc(x,y,5,0,2*Math.PI);
    }
    ctx_2.moveTo(w/step,h*(1-cfg.data[0][1]*per));
    for(i in cfg.data) {
        var item = cfg.data[i];
        x = (w/step)*(parseInt(i)+1);
        y=h*(1-item[1]*per);
        ctx_2.lineTo(x,y);
        ctx_2.fillStyle = item[2]?item[2]:"#595959";
        ctx_2.fillText((item[1]*100)+"%",x-10,y-10);
    }
    ctx_2.stroke();
    ctx_2.lineWidth=1;
    ctx_2.strokeStyle = "rgba(255,136,120,0.2)"
    //绘制阴影
    ctx_2.lineTo(x,h);
    ctx_2.lineTo(w/step,h);
    ctx_2.fillStyle = "rgba(255,136,120,0.2)";
    ctx_2.fill();
    ctx_2.stroke();
}
    draw(0);
    component.on("onLoad",function() {
        //折线图生长动画
        var s = 0;
        for(i=0;i<100;i++){
            setTimeout(function(){
                s+=.01;
                draw(s);                    
            },500+i*10);
        }
    });
    component.on("onLeave",function() {
        //折线图生长动画
        var s = 1;
        for(i=0;i<100;i++){
            setTimeout(function(){
                s-=.01;
                draw(s);
            },i*10);
        }
    });
    return component;
}