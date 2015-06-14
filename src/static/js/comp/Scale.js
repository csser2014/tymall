/**
 * 图片缩放
 * @description 根据给定的容器高宽，缩放图片，然后使图片居中显示
 */
(function(exports){
	
	var Scale = function(args){
		var defArgs = {
				width	:	100,
				height	:	100,
				url		:	'http://img3.laibafile.cn/p/m/131806106.jpg',
				handler	:	function(rt){}
		};
		this.cfg = jQuery.extend({}, defArgs, args);
		this.init();
	};
	
	jQuery.extend(Scale.prototype, {
		
		init	:	function(){
			var i = new Image(), t = this;
			i.onload = function(){
				if(i.width != 0 && i.height != 0)
				t.scaleOp(i.width, i.height);
			}
			i.src = t.cfg.url;
		},
		
		/**
		 * 缩放操作
		 */
		scaleOp	:	function(oW, oH){
			var t = this, reqW = t.cfg.width, reqH = t.cfg.height,
			tmpW, tmpH, scaleX = 1, scaleY = 1, scale;
			
			//图片原始尺寸小于规定尺寸
			if(oW < reqW && oH < reqH){
				tmpH = oH;
				tmpW = oW;
			}else{
				scaleX = reqW / oW;
				scaleY = reqH / oH;
				scale = Math.min(scaleX, scaleY);
				tmpW = scale * oW;
				tmpH = scale * oH;
			}
			t.moveOp(tmpW, tmpH);
		},
		
		/**
		 * 移动操作
		 */
		moveOp	:	function(sW, sH){
			var t = this, reqW = t.cfg.width, reqH = t.cfg.height,
			tx = 0, ty = 0;
			
			tx = (reqW - sW ) / 2;
			ty = (reqH - sH) / 2;
			
			try {
				if(t.cfg.handler && t.cfg.handler instanceof Function){
					t.cfg.handler.call(null, {
						reqW		:	reqW,
						reqH		:	reqH,
						scaleW		:	sW,
						scaleH		:	sH,
						url			:	t.cfg.url,
						marginTop	:	ty + 'px',
						marginLeft	:	tx + 'px'
					})
				}
			} catch (e) {
			}
		}
		
	});
	
	exports.Scale = Scale;
})(_mall.comp);