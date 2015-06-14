/**
 * 喜欢，评论(发微博，纯文字)，求鉴定，购买数+1
 * ★★绑定标签需加上属性: data-product-id(产品id)， data-product-name(产品名称)★★
 */
(function(exports){
	TY.loader('TY.ui.pop');
	
	
	var MSG = {
			OP_SUCCESS	:	'操作成功',
			OP_FAILURE	:	'操作失败',
			ALREADY_IDENTIFIED	:	'已经有人求鉴定了',
			PROCESSING	:	'处理中，请稍后'
	},
	template = {
			REVIEW	:	[
				'<div class="fele pop-shopping" id="pop_com_product">',
					'<h3 class="mb10" style="width:330px;">&nbsp;</h3>',
					'<div class="form-item no-item-label">',
						'<div class="form-field"><textarea id="com_des" data-default-tips="不想说点啥？"></textarea></div>',
					'</div>',
					'<p class="form-error" style="display:none;"></p>',
					'<div class="form-action"><a class="btn p-bluebtn" href="javascript:void(0);">确定</a></div>',
				'</div>'
			    ],
			    
			IDENTIFY :	[
				'<div class="fele pop-shopping" id="pop_identify_product">',
					'<p class="mb10 w300 _identify_topic">&nbsp;</p>',
					'<div class="form-item no-item-label">',
						'<div class="form-field"><textarea id="identify_des" data-default-val="稍微说几句吧，有利于网友更清楚如何帮您鉴定哦:)"></textarea></div>',
					'</div>',
					'<p class="form-error" style="display:none;"></p>',
					'<div class="form-action"><a class="btn p-bluebtn" href="javascript:void(0);">确定</a></div>',
				'</div>'
			    ],
			    
		    CREATE_SUCCESS	:	[
     				'<div class="fele pop-shopping" id="pop_create_success">',
     					'<p class="status-success"><i class="icon-right">✓</i>发布成功！</p>',
     					'<div class="form-action"><a class="btn p-bluebtn" href="#" target="_blank">前往查看</a></div>',
     				'</div>'
           	 	]
	};
	
	var UserOp = function(args){
		var defArgs = {
				node	:	'',//节点
				type	:	'like'//参数列表: like, review, identify, buy
		};
		this.pop = null;
		this.proc = false;
		this.cfg = jQuery.extend({}, defArgs, args);
		this.init();
	};
	
	jQuery.extend(UserOp.prototype, {
		init	:	function(){
			var t = this;
			if (t.cfg.type == 'productinfo'){
				t.productInfoOp();
			}else if(t.cfg.type == 'like'){
				t.likeOp();
			}else if(t.cfg.type == 'review'){
				t.reviewOp();
			}else if(t.cfg.type == 'identify'){
				t.identifyOp();
			}else if(t.cfg.type == 'buy'){
				t.buyOp();
			}else{
				throw new Error('类型参数错误');
			}
		},
		
		checkLogin	:	function(){
			var online = exports.adapter.isOnline();
			if(!online){
				exports.adapter.login();
			}
			return online;
		},
		
		/**
		 * 初始化喜欢数和评论数
		 */
		productInfoOp : function(){
			jQuery(this.cfg.node).each(function(){
				var curr = jQuery(this),
				likeNode = jQuery('._like', curr),
				reviewNode = likeNode.siblings('._review'),
				lastComment = jQuery('.txt-detail p', curr);
				productId = likeNode.attr('data-product-id');
				
				if (likeNode.length == 0){
					return;
				}
				
				var p = {
					productId	:	productId
				},
				callback = {
					success	:	function(resp){
						if(resp.ifSuc == 1){
							var likeNum = resp.data.likeNum,
							    commentNum = resp.data.commentNum, 
							    lastCommentNum = resp.data.lastComment,
							    comUserName = (resp.data.comUserName != '') ? resp.data.comUserName : '',
							    userId = (resp.data.userId != '') ? resp.data.userId : '';		
							
							likeNode.html( likeNum );
							reviewNode.html( commentNum );
							lastComment.html('<a target="_blank" href="http://www.tianya.cn/' + userId + '">' + comUserName + '：</a><br />' + lastCommentNum);			
							if (resp.data.picUrlCover && resp.data.picUrlCover.pic){
								picCover = resp.data.picUrlCover.pic;
								reviewNode.attr('data-product-picurl-s', picCover.s);
								reviewNode.attr('data-product-picurl-m', picCover.m);
								reviewNode.attr('data-product-picurl-l', picCover.l);
								
							}
							
						}else{
							//np
						}
					},
					failure	:	function(e){
						//np
					}
				};
				exports.service.productInf(p, callback);
			});
			
			return false;
		},
		
		/**
		 * 喜欢操作
		 */
		likeOp	:	function(){
			var t = this;
			
			jQuery(t.cfg.node).live('click', function(){
				if(!t.checkLogin()){
					return;
				}
				
				var curr = jQuery(this),
				productId = curr.attr('data-product-id'),
				p = {
					pid	:	productId
				},
				callback = {
					success	:	function(resp){
						if(resp.result == 1 && resp.code == 0){
							var num = t.getNodeVal(curr) + 1;
							t.setNodeVal(curr, num, t.getNodeVal(curr) + '+1');
						}else{
							t.simplePop(resp.message);
						}
					},
					failure	:	function(e){
						t.simplePop(e);
					}
				};
				
				exports.service.like(p, callback);
				return false;
			});
		},
		
		/**
		 * 评论操作
		 */
		reviewOp	:	function(){
			var t = this;
			
			jQuery(t.cfg.node).live('click', function(){
				if(!t.checkLogin()){
					return;
				}
				
				var curr = jQuery(this),
				productId = curr.attr('data-product-id'),
				productName = curr.attr('data-product-name'),
				productURL = curr.attr('data-product-url'),
				productPICURL_s = curr.attr('data-product-picurl-s'),
				productPICURL_m = curr.attr('data-product-picurl-m'),
				productPICURL_l = curr.attr('data-product-picurl-l'),
				topic = '#购物分享[' + productId + ']#',
				tw_image,//微博图片参数，值为JSON数组字符串
				content = template.REVIEW.join('');
				
				if(productPICURL_s && productPICURL_m && productPICURL_l){
					tw_image = TY.util.json([{
						sUrl	:	productPICURL_s,
						mUrl	:	productPICURL_m,
						lUrl	:	productPICURL_l
					}]);
				}
				
				t.pop = new TY.ui.pop({
					headTxt	:	'评论',
					body	:	content,
					isShowButton	:	false,
					render	:	function(){
						jQuery('#com_des').keydown(function(e){
							if(e.which === 13){//屏蔽回车键
								return false;
							}
						});
						jQuery('#pop_com_product h3').html(productName);
						jQuery('#pop_com_product a').click(function(){
							var com = jQuery.trim( jQuery('#com_des').val() ),
							errorNode = jQuery('#pop_com_product .form-error');
							if(com){
								if(t.proc){
									return;
								}
								
								t.proc = true;
								errorNode.html( MSG.PROCESSING ).show();
								_send( topic, com, errorNode, productId, curr, productURL, tw_image );
							}else{
								errorNode.html( jQuery('#com_des').attr('data-default-tips') ).show();
							}
							return false;
						});
					}
				});
				
			});
			
			var _send = function(topic, com, errorNode, productId, node, productURL, tw_image){
				exports.twService.send({
					content	:	topic + com + ( productURL ? (' ' + productURL ) : ''),
					image	:	tw_image ? tw_image : ''
				}, {
					success	:	function(d){
						t.proc = false;
						
						var num = t.getNodeVal( node ) + 1;
						t.setNodeVal(node, num, t.getNodeVal(node) + '+1');
						
						errorNode.html('评论成功').show();
						t.removePop(500);
						
						setTimeout(function(){
							exports.service.review({
								uid		:	exports.adapter.getUserId(),
								uName	:	exports.adapter.getUserName(),
								lc		:	com,
								pid		:	productId,
								ct		:	0
							});
						}, 0);
						
					},
					failure	:	function(e){
						t.proc = false;
						errorNode.html(e).show();
					}
				});
			}
		},
		
		/**
		 * 获取喜欢，评论节点内容的数字
		 */
		getNodeVal	:	function(node){
			var t = this, num = 0;
			
			if( jQuery('i', node).length == 0 ){
				num = parseInt( node.html() );
			}else{
				num = parseInt( jQuery('i', node).html() );
			}
			
			return num;
		},
		
		/**
		 * 设置喜欢，评论节点内容的数字
		 * @param {jQuery} node 节点
		 * @param {Number} val 数字
		 * @param {String} strVal 字符串数字
		 * 
		 */
		setNodeVal	:	function(node, val, strVal){
			var t = this;
			
			if( jQuery('i', node).length == 0 ){
				node.html( strVal );
				setTimeout(function(){
					node.html( val );
				}, 2000);
			}else{
				jQuery('i', node).html( strVal );
				setTimeout(function(){
					jQuery('i', node).html( val );
				}, 2000);
			}
		},
		
		/**
		 * 求鉴定操作
		 */
		identifyOp	:	function(){
			var t = this;
			
			jQuery(t.cfg.node).live('click', function(){
				if(!t.checkLogin()){
					return;
				}
				
				var curr = jQuery(this),
				productId = curr.attr('data-product-id'),
				productName = curr.attr('data-product-name'),
				topic = '【求鉴定】看中了"' + productName + '"商品，求大家帮忙鉴定下',
				content = template.IDENTIFY.join('');
				
				t.pop = new TY.ui.pop({
					headTxt	:	'鉴定',
					body	:	content,
					isShowButton	:	false,
					render	:	function(){
						jQuery('#pop_identify_product ._identify_topic').html(topic);
						/*
						jQuery('#identify_des').focus(function(){
							var curr = jQuery(this);
							var defVal = curr.attr('data-default-val');
							var val = curr.val();
							
							if(val == defVal){
								curr.val('');
							}
							
						}).blur(function(){
							var curr = jQuery(this);
							var defVal = curr.attr('data-default-val');
							var val = curr.val();
							
							if(!val){
								curr.val( defVal );
							}
							
						});
						*/
						jQuery('#pop_identify_product a').click(function(){
							var desc = jQuery.trim( jQuery('#identify_des').val() ),
							errorNode = jQuery('#pop_identify_product .form-error');
							if(desc){
								if(t.proc){
									return;
								}
								
								t.proc = true;
								errorNode.html( MSG.PROCESSING ).show();
								_identify({
									productId	:	productId,
									productName	:	productName,
									content		:	desc,
									errorNode	:	errorNode
								});
							}else{
								errorNode.html( jQuery('#identify_des').attr('data-default-val') ).show();
							}
							return false;
						});
					}
				});
				
			});
			
			var _identify = function(cfg){
				var p = {
						productId	:	cfg.productId,
						title		:	'【求鉴定】' + cfg.productName,
						content		:	cfg.content
				},
				cb = {
						success	:	function(resp){
							if(resp.result == 1){
								t.removePop();
								
								_open({
									code	:	resp.code,
									url		:	resp.data
								});
							}else{
								cfg.errorNode.html(resp.message).show();
							}
							t.proc = false;
						},
						failure	:	function(e){
							cfg.errorNode.html(e).show();
							t.proc = false;
						}
				};
				exports.service.identifyProduct(p, cb);
			};
			
			var _open = function(args){
				var content = template.CREATE_SUCCESS.join('');
				t.pop = new TY.ui.pop({
					headTxt	:	'提示',
					body	:	content,
					isShowButton	:	false,
					render	:	function(){
						if(args.code != '200'){
							jQuery('#pop_create_success status-success').html( MSG.ALREADY_IDENTIFIED );
						}
						jQuery('#pop_create_success a').attr('href', args.url).click(function(){
							t.removePop();
						});
					}
				});
			};
			
		},
		
		/**
		 * 点击购买链接
		 */
		buyOp		:	function(){
			var t = this;
			
			jQuery(t.cfg.node).live('click', function(){
				/*
				if(!t.checkLogin()){
					return;
				}
				*/
				var curr = jQuery(this),
				productId = curr.attr('data-product-id'),
				p = {
					productId	:	productId
				};
				
				exports.service.increaseBuyNum(p);
			});
		},
		
		removePop	:	function(delay){
			var t = this;
			try {
				if(t.pop){
					if(delay > 0){
						setTimeout(function(){
							t.pop.remove();
							t.pop = null;
						}, delay);
					}else{
						t.pop.remove();
						t.pop = null;
					}
				}
			} catch (e) {
				t.pop = null;
			}
		},
		
		simplePop	:	function(content){
			var t = this;
			t.removePop();
			
			t.pop = new TY.ui.pop({
				headTxt	:	'提示',
				body	:	content,
				isShowButton	:	true
			});
		}
		
	});
	
	exports.comp.UserOp = UserOp;
})(_mall);
