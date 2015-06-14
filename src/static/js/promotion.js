/**
 * 促销优惠脚本文件
 */
(function(exports){
	
	function initSlide(){
		new exports.comp.SpecialSlide({
			root	:	'div.imgslide'
		});
	}
	
	jQuery(document).ready(function(){
		initSlide();
	});
})(_mall);