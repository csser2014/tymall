/**
 * 图片剪切
 */
(function(exports){
	
	var Cut = function(args){
		var defArgs = {
				width	:	100,
				height	:	100,
				url		:	'http://t1.baidu.com/it/u=1566587549,317259339&fm=24&gp=0.jpg',
				handler	:	function(rt){}
		};
		this.cfg = jQuery.extend({}, defArgs, args);
		this.init();
	};
	
	jQuery.extend(Cut.prototype, {
		
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
			tmpW, tmpH, scaleX = 1, scaleY = 1;
			
			//图片原始尺寸小于规定尺寸
			if(oW < reqW || oH < reqH){
				tmpH = oH;
				tmpW = oW;
			}else{
				scaleX = reqW / oW;
				scaleY = reqH / oH;
				if(scaleX > scaleY){
					tmpW = reqW;
					tmpH = Math.round( oH * scaleX );
				}else{
					tmpH = reqH;
					tmpW = Math.round( oW * scaleY );
				}
			}
			t.cutOp(tmpW, tmpH);
		},
		
		/**
		 * 剪切操作
		 */
		cutOp	:	function(sW, sH){
			var t = this, reqW = t.cfg.width, reqH = t.cfg.height,
			tx = 0, ty = 0;
			
			tx = (-1) * (sW - reqW) / 2;
			ty = (-1) * (sH - reqH) / 2;
			
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
	
	
	exports.Cut = Cut;
})(_mall.comp);
