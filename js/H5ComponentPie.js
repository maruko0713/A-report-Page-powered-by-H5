//饼图组件对象
var H5ComponentPie = function(name, cfg) {
    var component = new H5ComponentBase(name,cfg);
    // 绘制网格线
    var w = cfg.width;
    var h = cfg.height;
    var r = w / 2;
   
    var cns = document.createElement("canvas");
    var ctx = cns.getContext("2d");
    // for(var i=0;i<cfg.data.length;i++) {
    //     sum += cfg.data[i][1];
    // }
     //加入一个底图层
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
        ctx.lineWidth = .1;
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
        

        var x = r + Math.sin(.5*Math.PI-sAngel) * r;
        var y = r + Math.cos(.5*Math.PI-sAngel) * r;

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

    
    ctx.fillStyle = "#eee";
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1;
    


    //生长动画
    var draw = function(per) {
        ctx.clearRect(0,0,w,h);
        ctx.beginPath();
        ctx.moveTo(r,r);
        // var sAngel = 1.5*Math.PI;
        if(per <= 0 ){
        ctx.arc( r, r, r, sAngel, sAngel+2*Math.PI);
    } else {
        if(cfg.data.length == 1){
            sAngel = 1.5*Math.PI;
            // console.log(1);
        } 
        ctx.arc( r, r, r, sAngel, sAngel+2*Math.PI*per,true);
    }
        ctx.fill();
        ctx.stroke();

        if(per >= 1) {
        	H5ComponentPie.reSort(component.find(".text"));
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
        // console.log(sum);
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
H5ComponentPie.reSort = function(list) {
  //1.检测相交
  var compare = function(domA,domB){
    //元素的位置不用left 因为有时候left auto
    var offsetA = $(domA).offset();
    var offsetB = $(domB).offset();
    var shadowA_x = [offsetA.left,$(domA).width()+offsetA.left];
    var shadowA_y = [ offsetA.top - $(domA).height(),offsetA.top];

    var shadowB_x = [offsetB.left,$(domB).width()+offsetB.left];
    var shadowB_y = [offsetB.top - $(domB).height(),offsetB.top];
    // console.log($(domA).text()+shadowA_x);
    // console.log($(domB).text()+shadowB_x);
    
    var intersect_x = (shadowA_x[0] > shadowB_x[0] && shadowA_x[0]<shadowB_x[1]) || (shadowA_x[1] > shadowB_x[0] && shadowA_x[1]<shadowB_x[1]) || 
    (shadowA_x[0]<shadowB_x[0]&&shadowA_x[1]>shadowB_x[1]);
    var intersect_y = (shadowA_y[0] > shadowB_y[0] && shadowA_y[0]<shadowB_y[1]) || (shadowA_y[1] > shadowB_y[0] && shadowA_y[1]<shadowB_y[1]) || 
    shadowA_y[0]<shadowB_y[0]&&shadowA_y[1]>shadowB_y[1];
    // console.log("x:"+intersect_x);
    // console.log("y:"+intersect_y);
    return intersect_x && intersect_y;
  }

  //2.错开重排
  var reset = function(domA,domB) {
        if($(domA).offset().left < $(domB).offset().left){
            var left = $(domA).offset().left+$(domB).width();
            $(domA).css("right","").css("left",left);
        }
        else {
            if($(domA).offset().left-$(domB).width()>=0){
            var left  = $(domA).offset().left-$(domB).width();
            $(domA).css("right","").css("left",left);
            } else {
                $(domA).css("left",0);
            }
        }

        if($(domA).offset().top < $(domB).offset().top){
            console.log($(domA).offset().top-$(domA).offsetParent().offset().top-$(domB).height());
            $(domA).css("bottom","").css("top",$(domA).offset().top-$(domA).offsetParent().offset().top-$(domB).height());
        }    else {
            console.log($(domA).offset().top-$(domA).offsetParent().offset().top);
              var top = $(domA).offset().top-$(domA).offsetParent().offset().top+$(domB).height();
              console.log(top);

            $(domA).css("bottom","").css("top",top);
            console.log($(domA).css("top"));
        }

  }
  
  //定义将要重排的元素
  var willReset = [];
  $.each(list,function(i,domTarget) {
    if(list[i+1]){
       if(compare(list[i+1],domTarget)) {
        willReset.push(domTarget);
        willReset.push(list[i+1]);
    } 
    }
  });
    if(willReset.length>1) {
        $.each(willReset, function(i,domA) {
            if(willReset[i+1]) {
                reset(domA,willReset[i+1]);
                // console.log(compare(willReset[i+1],domA));
            }
        });
        H5ComponentPie.reSort(willReset);
        console.log(willReset);
    }
 }