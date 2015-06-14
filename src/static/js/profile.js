/**
 * 个人用户页脚本文件
 */
(function(exports){
	
	//管理员删除自己分享的商品
	function initAdminOp(){
		if(pageType != 'myShare'){//borrow
			return;
		}
		
		jQuery('div.btn-admin').hide();
		
		jQuery('.rapids-box').mouseenter(function(){
			jQuery('.btn-admin', jQuery(this)).show();
		}).mouseleave(function(){
			jQuery('.btn-admin', jQuery(this)).hide();
		});
		
		jQuery('.rapids-box').livequery(function(){
			var curr = jQuery(this),
			reviewNode = jQuery('._review', curr),
			cstp = {
				productId	:	reviewNode.attr('data-product-id'),
				productName	:	reviewNode.attr('data-product-name')
			};
			
			jQuery('._remove', curr).click(function(){
				new exports.comp.BizProductOp({
					type	:	'delete',
					param	:	cstp,
					completeHandler	:	function(){
						curr.remove();
					}
				});
				return false;
			});
		});
	}
	
	jQuery(document).ready(function(){
		initAdminOp();
	});
	
})(_mall);
