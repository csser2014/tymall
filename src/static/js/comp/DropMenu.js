/**
 * 下拉菜单
 * @description 给定key=value键值对构造下拉菜单
 */
(function(exports){
	
	var template = [
        '<div class="drop-menu-wrap">',
        	'<ul>',
        		'<!--<li class="" data-opt-key="#KEY#" data-opt-value="#VALUE#"><a href="javascript:void(0);">#KEY#</a></li>-->',
        	'</ul>',
        '</div>'
    ];
	
	var DropMenu = function(args){
		var defArgs = {
				width	:	300,//下拉菜单宽度
				height	:	140,//下拉菜单高度
				target	:	null,//目标对象
				data	:	[],//键值对数组对象
				render	:	function(){},//渲染完成后回调函数
				handler	:	function(rt){}//选择后回调函数
		};
		this.cfg = jQuery.extend({}, defArgs, args);
		this.node = null;
		this.LOOP_NODE_HTML = null;//循环节点字符串
		this.selected = null;//当前选择的数据
		this.on = false;//是否已经显示出来
		this.init();
	};
	
	jQuery.extend(DropMenu.prototype, {
		
		init	:	function(){
			var t = this;
			
			t.node = jQuery( template.join('') );
			t.LOOP_NODE_HTML = t.node.find('ul').contents().filter(function(){
				return this.nodeType == 8;
			}).get(0).nodeValue;
			
			t.procData();
			t.bind();
			t.hook();
			t.ext_proc();
		},
		
		procData	:	function(){
			var t = this, cfg = t.cfg, ls = cfg.data, lsLen = ls.length, obj, i = 0;
			
			for(; i < lsLen; i++){
				obj = ls[i];
				t.addOption(obj, false);
			}
		},
		
		/**
		 * 增加选项
		 * @public
		 * @param {Object} obj 键值对
		 * @param {Boolean} flag 是否是新增数据
		 */
		addOption	:	function(obj, flag){
			var t = this, cfg = t.cfg, tmp = {}, rt, UL = jQuery('ul', t.node);
			
			tmp = {};
			tmp['KEY'] = obj.key;
			tmp['VALUE'] = obj.value;
			
			rt = exports.util.regExpFillData( t.LOOP_NODE_HTML, tmp );
			rt = jQuery(rt);
			rt.click(function(){
				var curr = jQuery(this);
				t.li_click_bubble_fix(curr);
			});
			UL.append( jQuery(rt) );
			
			if(flag){
				t.cfg.data.push( obj );
			}
		},
		
		/**
		 * 选择某一项
		 * @public
		 * @param {String} val 键值对的value值
		 */
		select	:	function(val){
			var t = this, node = t.node;
			jQuery('li[data-opt-value=' + val + ']', node).click();
		},
		
		bind	:	function(){
			var t = this, node = t.node;
			
			//阻止根节点的事件起泡
			node.click(function(e){
				e.stopPropagation();
			});
			
			jQuery('li', node).click(function(){
				var curr = jQuery(this);
				t.li_click_bubble_fix(curr);
			});
			
			var doc_click = function(){
				t.hide();
				jQuery(document).unbind('click', doc_click);
			};
			//点击事件
			t.cfg.target.click(function(e){
				e.stopPropagation();
				
				if(t.on){
					return;
				}
				
				t.show();
				jQuery(document).bind('click', doc_click );
			});
			
		},
		
		//起泡问题修复
		li_click_bubble_fix	:	function(curr){
			var t = this;
			t.selected = {
					key		:	curr.attr('data-opt-key'),
					value	:	curr.attr('data-opt-value')
			};
			t.hide();
			t.dispatch();
		},
		
		hook	:	function(){
			var t = this, node =  t.node, cfg = t.cfg, des = cfg.target, p_des = des.parent(), des_o = des.get(0),
			w = des.width(), h = des.height();
			
			t.hide();
			p_des.append( t.node );
		},
		
		ext_proc	:	function(){
			var t = this, node =  t.node, cfg = t.cfg;
			if(cfg.render && cfg.render instanceof Function){
				cfg.render.call(null, node);
			}
		},
		
		hide	:	function(){
			var t = this;
			
			t.node.hide();
			t.on = false;
		},
		
		show	:	function(){
			var t = this;
			
			t.node.show();
			t.on = true;
		},
		
		dispatch	:	function(){
			var t = this, cfg = t.cfg;
			if(cfg.handler && cfg.handler instanceof Function){
				cfg.handler.call(null, t.selected);
			}
		}
	});
	
	exports.comp.DropMenu = DropMenu;
})(_mall);