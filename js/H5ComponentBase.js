//基本图文组建对象 
//基本图文组建对象 
var H5ComponentBase = function(name, cfg) {
	var cfg = cfg || {};
	var id=("h5_c_"+Math.random()).replace(".","_");
	//当前的组件类型对应样式
	var cls = "h5_component" + " h5_component_name_" + name +" h5_component_" + cfg.type;
	var component = $("<div class='"+cls+"' id="+id+">");
	cfg.text &&  component.text(cfg.text);
	cfg.width && component.width(cfg.width/2);
	cfg.height && component.height(cfg.height/2);
	cfg.bg && component.css("backgroundImage","url("+cfg.bg+")");
	cfg.css && component.css(cfg.css);
	if(typeof cfg.onclick == "function") {
		component.on("click",cfg.onclick);
	}
	if(cfg.center == true) {
		component.css({
			marginLeft:(cfg.width/4 * -1)+"px",
			left:"50%",
			position:"absolute"
		});
	// }else{
	// 	if(cfg.relativeTo) {
	// 	component.css({
	// 		position:"absolute",
	// 		top:cfg.top,
	// 		left:cfg.left
	// 	});
	// 	cfg.relativeTo.css({
	// 		position:"relative"
	// 	});
	// }
	}
	component.on("onLoad", function() {
		setTimeout(function(){
			component.removeClass(cls+"_leave").addClass(cls+"_load");
			cfg.animateIn && component.animate(cfg.animateIn);
		},cfg.delay || 0);
		return false;
	})
	component.on("onLeave",function() {
		setTimeout(function(){
			component.removeClass(cls+"_leave").addClass(cls+"_load");
			cfg.animateIn && component.animate(cfg.animateIn);
		},cfg.delay || 0);
		return false;
	})
	return component;
}