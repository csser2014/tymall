/**
 * 关于单个商品的交互通用脚本文件
 * 包含以下功能
 * 1. 点击评论商品
 * 2. 点击喜欢商品
 * 3. 点击求鉴定商品
 * 4. 点击购买+1
 * 5. 构造瀑布流单个产品jQuery Object结构
 */
(function(exports){
	
	var TEMPLATE = {
			BOX	:	[
				'<div class="rapids-box">',
				'<a target="_blank" href="#DETAIL_URL#"><img width="220" alt="" src="#PIC_URL#"></a>',
				'<h3 class="short-title"><a target="_blank" title="#PRODUCT_NAME#" href="#DETAIL_URL#">#PRODUCT_NAME#</a></h3>',
				'<div class="oper"><span class="price">￥#PRICE#</span><span class="love loved _like" data-product-id="#PRODUCT_ID#" data-product-name="#PRODUCT_NAME#">#LIKE_NUM#</span><span class="comment commented _review" data-product-id="#PRODUCT_ID#" data-product-name="#PRODUCT_NAME#" data-product-picurl-l="#PIC_URL_L#" data-product-picurl-m="#PIC_URL_M#" data-product-picurl-s="#PIC_URL_S#" data-product-url="#DETAIL_URL_ABSOLUTE#">#REVIEW_NUM#</span></div>',
				'<div class="imgtext-h clearfix _comment">',
					'<a target="_blank" class="img-left" href="/#COMMENT_USER_ID#"><img width="30" height="30" alt="" src="http://tx.tianyaui.com/logo/small/#COMMENT_USER_ID#"></a>',
					'<div class="text-right">',
						'<p title="#COMMENT_CONTENT_FULL#"><a target="_blank" href="/#COMMENT_USER_ID#" class="user">#COMMENT_USER_NAME#</a>:#COMMENT_CONTENT#</p>',
					'</div>',
				'</div>',
				'<p class="t-recommend recommend-theme-#COUPON_TYPE#"></p>',
				'</div>'
	   	 	]
	};
	
	function initUserOp(){
		new exports.comp.UserOp({
			node	:	'._like',
			type	:	'like'
		});
		new exports.comp.UserOp({
			node	:	'._review',
			type	:	'review'
		});
		new exports.comp.UserOp({
			node	:	'._identify',
			type	:	'identify'
		});
		new exports.comp.UserOp({
			node	:	'._buy',
			type	:	'buy'
		});
	}
	
	/**
	 * 加载页面上选区变量$sec1的数据
	 * @param {jQuery} columnNodes jQuery对象，列节点
	 */
	exports.fn.proc$Sec1Data = function(columnNodes){
		
		var columnNodeLen = columnNodes.length,
		columnNode = function(no){
			var idx = no % columnNodeLen;
			return columnNodes.eq(idx);
		}
		
		try {
			var tmp = null, tmpNode = null, tmpLen = -1;
			if($sec1 && $sec1.data && $sec1.data.data && $sec1.data.data.length > 0){
				tmpLen = $sec1.data.data.length;
				for(var i = 0; i < tmpLen; i++){
					tmp = $sec1.data.data[i];
					tmpNode = exports.fn.createBox( tmp );
					columnNode(i).append( tmpNode );
				}
			}
		} catch (e) {
		}
	}
	
	/**
	 * 生成瀑布流单个数据节点
	 */
	exports.fn.createBox = function(data){
		var rt, tmpHTML = TEMPLATE.BOX.join(''),
		tmp = {};
		
		tmp['PRODUCT_ID']			=	data.productId;
		tmp['DETAIL_URL']			=	'/item/' + data.productId + '.html';
		tmp['DETAIL_URL_ABSOLUTE']	=	location.protocol + '//' + location.host + tmp['DETAIL_URL'];
		tmp['PIC_URL']				=	data.picUrlCover && data.picUrlCover.pic ? data.picUrlCover.pic.m : '';
		tmp['PIC_URL_S']			=	data.picUrlCover && data.picUrlCover.pic ? data.picUrlCover.pic.s : '';
		tmp['PIC_URL_M']			=	data.picUrlCover && data.picUrlCover.pic ? data.picUrlCover.pic.m : '';
		tmp['PIC_URL_L']			=	data.picUrlCover && data.picUrlCover.pic ? data.picUrlCover.pic.l : '';
		tmp['PRODUCT_NAME']			=	data.title;
		tmp['PRICE']				=	data.priceStr ? data.priceStr : data.price;
		tmp['LIKE_NUM']				=	data.likeNum;
		tmp['REVIEW_NUM']			=	data.commentNum;
		tmp['COMMENT_USER_ID']		=	data.comUserId;
		tmp['COMMENT_USER_NAME']	=	data.comUserName;
		tmp['COMMENT_CONTENT_FULL']	=	data.lastComment ? data.lastComment : '';
		tmp['COMMENT_CONTENT']		=	data.lastComment ? exports.util.substr(data.lastComment, 40) : '';
		tmp['COUPON_TYPE']			=	data.couponType;
		
		//删除没有评论的DOM结构
		rt = exports.util.regExpFillData( tmpHTML, tmp );
		rt = jQuery(rt);
		if(data.lastComment){
			
		}else{
			jQuery('._comment', rt ).remove();
		}
		
		//删除没有价格或者价格为0的DOM结构
		if(data.price && data.price != 0 ){
			
		}else{
			jQuery('.price', rt ).remove();
		}
		
		return rt;
	}
	
	jQuery(document).ready(function(){
		initUserOp();
	});
})(_mall);
