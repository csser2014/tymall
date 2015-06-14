/**
 * 首页脚本文件
 */
(function(exports){
	
	//剪切图片
	function initCut(){
		jQuery('._pic_show img').each(function(){
			var t = jQuery(this);
			
			new exports.comp.Cut({
				width	:	t.parent().width(),
				height	:	t.parent().height(),
				url		:	t.attr('_src'),
				handler	:	function(rt){
					
					t.css('width', rt.scaleW);
					t.css('height', rt.scaleH);
					t.css('margin-top', rt.marginTop);
					t.css('margin-left', rt.marginLeft);
					t.attr('src', rt.url);
				}
			});
			
		});
	}
	
	//轮播图
	function initSlide(){
		new exports.comp.SpecialSlide({
			root	:	'div.imgslide'
		});
	}
	
	//购物街首页涯有说模块喜欢数，评论数更新
	function initLinkAndComment(){
		new exports.comp.UserOp({
			node    :   '#recommend ul li',
			type    :   'productinfo'
		});
	}
	
	jQuery(document).ready(function(){
		initCut();
		initLinkAndComment();
		jQuery('.bxslider').bxSlider({
			auto: true,
			minSlides: 3,
			maxSlides: 3,
			moveSlides: 1,
			slideWidth: 332,
			nextSelector: '.next-btn',
			prevSelector: '.prev-btn',
			nextText: '',
			prevText: '',
			slideMargin: 2
		});
		
	});
	
})(_mall);
