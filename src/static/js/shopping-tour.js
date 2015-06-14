/**
 * 逛街页面(一级分类页面)脚本文件
 */
(function(exports){
	
	function initCut(){
		jQuery('.rapids-box img').each(function(){
			var t = jQuery(this),
			p = t.parent(),
			picURL = t.attr('_src');

			new _mall.comp.Cut({
				width	:	t.parent().width(),
				height	:	t.parent().height(),
				url		:	picURL,
				handler	:	function(rt){
					
					var tmp = jQuery('<img/>');
					tmp.attr('src', picURL);
					tmp.css('width', rt.scaleW);
					tmp.css('height', rt.scaleH);
					tmp.css('margin-top', rt.marginTop);
					tmp.css('margin-left', rt.marginLeft);
					
					t.remove();
					p.append( tmp );
				}
			});
		});
	}
	
	jQuery(document).ready(function(){
		initCut();
	});
})(_mall);