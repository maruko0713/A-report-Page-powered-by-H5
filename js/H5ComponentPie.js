//饼图组件对象
var H5ComponentPie = function(name, cfg) {
    var component = new H5ComponentBase(name,cfg);
    // 绘制网格线
    var w = cfg.width;
    var h = cfg.height;
    var r = w / 2;
    // 加入一个画布做网格线的背景
    //加入一个底图层
    var cns = document.createElement("canvas");
    var ctx = cns.getContext("2d");
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);
    $(cns).css("zIndex",1);

    ctx.beginPath();
    ctx.fillStyle = "#eee";
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1;
    ctx.moveTo(r,r);
    ctx.arc(r,r,r,0,2*Math.PI);
    ctx.fill();
    ctx.stroke(); 
    
    //绘制一个数据层
    var cns = document.createElement("canvas");
    var ctx = cns.getContext("2d");
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);
    $(cns).css("zIndex",2);

    var colors = ["red","green","blue","orange","gray"]; //备用颜色

    var sAngel = 1.5*Math.PI; //开始的角度在12点位置

    var eAngel = 0; //  结束的角度

    var aAngel = Math.PI*2; //圆的结束角度

    // ctx.beginPath();
    // ctx.fillStyle = "#eee";
    // ctx.strokeStyle = "#eee";
    // ctx.lineWidth = 1;
    // ctx.moveTo(r,r);
    // ctx.arc(r,r,r,0,2*Math.PI);
    // ctx.fill();
    // ctx.stroke();

    var step = cfg.data.length;
    for(var i=0;i<step;i++) {
        var item = cfg.data[i];
        var color = item[2] || (item[2]=colors.pop());

        eAngel = sAngel + aAngel * item[1];
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.moveTo(r,r);
        ctx.arc(r,r,r,sAngel,eAngel);
        ctx.fill();
        ctx.stroke();

        sAngel = eAngel;

        //加入所有项目文本和百分比
        var text = $("<div class='text'>");
        text.text(cfg.data[i][0]);

        
        var per = $("<div class='per'>");
        per.text(cfg.data[i][1]*100+"%");
        

        var x = r + Math.sin(.5*Math.PI - sAngel) * r;
        var y = r + Math.cos(.5*Math.PI - sAngel) * r;

        if(x>w/2) {
            text.css("left",x/2);
        } else {
            text.css("right",(w-x)/2);
        }
        if(y>h/2) {
            text.css("top",y/2);
        } else {
            text.css("bottom",(h-y)/2);
        }
        if( cfg.data[i][2]) {
            text.css("color",cfg.data[i][2]);
        }
        text.css("opacity",0);
        component.append(text);
        text.append(per);
    }

    // 加入一个蒙板层
    var cns = document.createElement("canvas");
    var ctx = cns.getContext("2d");
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css("zIndex",3);
    component.append(cns);

    ctx.beginPath();
    ctx.fillStyle = "#eee";
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1;
    ctx.moveTo(r,r);
    ctx.arc(r,r,r,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();

    //生长动画

    var draw = function(per) {
        ctx.clearRect(0,0,w,h);

        ctx.beginPath();
        ctx.moveTo(r,r);
        if(per <= 0 ){
        ctx.arc(r,r,r,sAngel,sAngel+2*Math.PI);
    } else {
        ctx.arc(r,r,r,sAngel,sAngel+2*Math.PI*per,true);
    }
        ctx.fill();
        ctx.stroke();

        if(per >= 1) {
            component.find(".text").css("opacity",1);
        }
        if(per <= 0) {
            component.find(".text").css("opacity",0);
        }
    }

    draw(0);

    component.on("onLoad",function() {
        //雷达图生长动画
        var s = 0;
        for(i=0;i<100;i++){
            setTimeout(function(){
                s+=.01;
                draw(s);                    
            },i*10);
        }
    });
    component.on("onLeave",function() {
        //雷达图退场动画
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