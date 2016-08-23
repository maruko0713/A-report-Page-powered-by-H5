// 内容管理对象
var H5 = function() {
	this.id=("h5_"+Math.random()).replace(".","_");
	this.el = $('<div class="h5" id="'+this.id+'">').hide();
	$("body").append(this.el);
	this.page = [];
	/* 新增一个页面 */
	/**
	 * [addPage descript]
	 * @param {[string]} name 组件名称 加入ClassName中
	 * @param {[h5]} h5对象 可以重复使用h5对象支持的方法
	 */
	this.addPage = function(name, text) {
        var page = $("<div class='h5_page section'>");
        if(name!=undefined) {
        	page.addClass("h5_page_"+name);
        }
        if(text!=undefined) {
        	page.text(text);
        }
 		this.el.append(page);
 		this.page.push(page);
 		if(typeof this.whenAddPage === "function") {
 			this.whenAddPage();
 		}
        return this;
	}
	// 新增一个组件
	this.addComponent = function(name, cfg) {
		var cfg = cfg || {};
		cfg = $.extend({
			type:"base"
		},cfg);
		var component;
		switch (cfg.type) {
			case "base":
				component = new H5ComponentBase(name,cfg);
				break;
			default:
		}
		var page = this.page.slice(-1)[0];
		page.append(component);
		return this;
	}
	this.loader = function(firstPage) {
		this.el.fullpage({
			onLeave:function( index, nextIndex, direction) {
					// debugger
					$(this).find(".h5_component").trigger("onLeave");
			},
			afterLoad:function( anchorLink, index) {
					// debugger
					$(this).find(".h5_component").trigger("onLoad");
			}
		});
		this.el.show();
		if(firstPage) {
			$.fn.fullpage.moveTo(firstPage);
		}
	}
	return this;
}