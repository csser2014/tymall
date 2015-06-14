/**
 * 图片选择组件
 */
(function(exports){
	var _Cut = exports.comp.Cut,
	template = {
			ITEM	:	[
    	 	    '<div class="pic-choose-item">',//增加样式on，表示选中
    	 	    	'<!-- <img /> -->',
    	 	    	'<span class="choose-index">&nbsp;</span>',
    	 	    	'<a class="choose-origin dd-pngfix pngfix" href="javascript:void(0);">查看原图</a>',
    	 	    '</div>'
    	 	],
    	 	
    	 	CHOOSE_WRAP	:	[
 	           	 '<div class="pic-choose">',
    	 	    	'<div class="_wrap cf"></div>',
    	 	    	'<div class="tl mt10 cf">',
    	 	    		'<span class="desc fl">最多可勾选5张，点击确定保存</span>',
    	 	    		'<span class="choose-btn fele fr">',
    	 	    			'<a href="javascript:void(0);" class="btn blue-btn mr10 _confirm">确定</a>',
    	 	    			'<a href="javascript:void(0);" class="_cancel">取消</a>',
    	 	    		'</span>',
    	 	    	'</div>',
    	 	     '</div>'	 
       	 	]
	};
	
	
	
	var PictureChooseItem = function(args){
		var defArgs = {
				picURL	:	'',//图片URL
				parentNode	:	null,//父节点
				locked		:	false,//不能选择
				compID		:	0,
				onScope		:	null,//调用方，与onHandler配合使用
				onHandler	:	function(obj){}//图片选择与否
		};
		this.cfg = jQuery.extend({}, defArgs, args);
		this.on = false;
		this.index = -1;
		this.cut = null;
		this.init();
	};
	
	jQuery.extend(PictureChooseItem.prototype, {
		
		init	:	function(){
			var t = this;
			t.node = jQuery(template.ITEM.join(''));
			t.cfg.parentNode.append( t.node );
			t.load();
			t.bind();
		},
		
		load	:	function(){
			var t = this, cfg = t.cfg, node = t.node;
			
			t.cut = new _Cut({
				width	:	node.width(),
				height	:	node.height(),
				url		:	cfg.picURL,
				handler	:	function(rt){
					var tmp = jQuery('<img/>')
					tmp.css('width', rt.scaleW);
					tmp.css('height', rt.scaleH);
					tmp.css('margin-top', rt.marginTop);
					tmp.css('margin-left', rt.marginLeft);
					tmp.attr('src', rt.url);
					
					node.append( tmp );
				}
			});
		},
		
		bind	:	function(){
			var t = this, node = t.node, cfg = t.cfg, oLink = jQuery('a', node);
			
			node.click(function(){
				if(t.locked){
					return;
				}
				
				var curr = jQuery(this);
				if(t.on){
					curr.removeClass('on');
					t.on = false;
				}else{
					curr.addClass('on');
					t.on = true;
				}
				
				t.dispatch();
			}).mouseenter(function(){
				oLink.css('display','block');
			}).mouseleave(function(){
				oLink.css('display','none');
			});
			
			oLink.click(function(e){
				e.stopPropagation();
				
				window.open(cfg.picURL, '_blank');
			});
		},
		
		dispatch	:	function(){
			var t = this, cfg = t.cfg;
			
			if(cfg.onHandler && cfg.onHandler instanceof Function){
				cfg.onHandler.call(cfg.onScope, {
					on	:	t.on,
					curr	:	t
				});
			}
		},
		
		/**
		 * @public
		 * 更新选中索引
		 */
		updateIndex	:	function(idx){
			var t = this, node = t.node;
			if(t.on){
				t.index = idx;
			}else{
				t.index = -1;
			}
			jQuery('.choose-index', node).html( t.index );
		},
		
		getPictureURL	:	function(){
			return this.cfg.picURL;
		}
	});
	
	
	var PictureChoose = function(args){
		var defArgs = {
				picURLs	:	[],//图片URLs数组
				max		:	5,//图片选择的张数
				target	:	null,//目标节点
				top			:	30,
				left		:	-475,
				chosenScope	:	null,//图片选择后调用方
				chosenHandler	:	function(arr){}//图片选择后回调函数
		};
		this.cfg = jQuery.extend({}, defArgs, args);
		
		this.compID_PREFIX = 'ITEM_';
		this.un_chosen = [];
		this.chosen = [];
		
		this.init();
	};
	
	jQuery.extend(PictureChoose.prototype, {
		
		init	:	function(){
			var t = this, cfg = t.cfg;
			
			t.node = jQuery( template.CHOOSE_WRAP.join('') );
			var _tmp = jQuery('<div style="position:relative; z-index:2; display:inline-block; width:1px; height:1px;"></div>');
			_tmp.insertAfter( cfg.target );
			_tmp.append( t.node );
			t.node.css('left', cfg.left + 'px');
			t.node.css('top', cfg.top + 'px');
			
			t.generateItemList();
			t.bind();
		},
		
		generateItemList	:	function(){
			var t = this, cfg = t.cfg, picURLs = cfg.picURLs, len = picURLs.length, i = 0, picURL, item,
			wrap = jQuery('._wrap', t.node);
			
			for(; i < len; i++){
				picURL = picURLs[i];
				
				
				item = new PictureChooseItem({
					picURL		:	picURL,
					parentNode	:	wrap,
					compID		:	t.compID_PREFIX + i,
					onScope		:	t,
					onHandler	:	t.onHandler
				});
				
				t.un_chosen.push(item);
			}
			
		},
		
		onHandler	:	function(obj){
			var t = this, cfg = cfg, tmpIndex;
			if(obj.on){
				tmpIndex = t.findArrayIndex( t.un_chosen, obj.curr );
				t.un_chosen.splice(tmpIndex, 1);
				t.chosen.push( obj.curr );
			}else{
				tmpIndex = t.findArrayIndex( t.chosen, obj.curr );
				t.chosen.splice(tmpIndex, 1);
				t.un_chosen.push( obj.curr );
			}
			
			t.procIndex();
			t.procLock();
		},
		
		procIndex	:	function(){
			var t = this, list = t.chosen, len = list.length, i = 0, tmp;
			for(; i < len; i++){
				tmp = list[i];
				tmp.updateIndex( i + 1 );
			}
		},
		
		procLock	:	function(){
			var t = this, list = t.un_chosen, len = list.length, i = 0, tmp,
			locked = t.chosen.length >= t.cfg.max;
			for(; i < len; i++){
				tmp = list[i];
				tmp.locked = locked;
			}
		},
		
		findArrayIndex	:	function(arr, item){
			var t = this, list = arr, len = list.length, i = 0, tmp;
			for(; i < len; i++){
				tmp = list[i];
				if(item.cfg.compID == tmp.cfg.compID){
					return i;
				}
			}
			return -1;
		},
		
		bind	:	function(){
			var t = this, node = t.node;
			
			jQuery('._confirm', node).click(function(){
				if(t.chosen.length == 0){
					return;
				}
				
				var tmpURLs = [], len = t.chosen.length, i = 0;
				for(; i < len; i++){
					tmpURLs.push( t.chosen[i].getPictureURL() );
				}
				
				if(t.cfg.chosenHandler && t.cfg.chosenHandler instanceof Function){
					t.cfg.chosenHandler.call(t.cfg.chosenScope, tmpURLs);
				}
				
				t.destroy();
			});
			
			jQuery('._cancel', node).click(function(){
				t.destroy();
			});
		},
		
		/**
		 * @public
		 * 销毁方法
		 */
		destroy	:	function(){
			var t = this, node = t.node;
			try {
				t.un_chosen = [];
				t.chosen = [];
				node.parent().remove();
			} catch (e) {
			}
		}
		
	});
	
	//export
	exports.comp.PictureChoose = PictureChoose;
})(_mall);