/**
 * 产品操作组件, 针对企业用户或空间管理员
 * 
 	new _mall.comp.BizProductOp({
 		type	:	'create|delete|hook-special',
 		param	:	{
 			productId	:	'产品ID',
 			productName	:	'产品名称',
 			productURL	:	'产品图片地址',
 			zoneUrl		:	'企业空间地址',
 			specialId	:	'产品所属专辑ID'
 		},
 		completeHandler	:	function(){
 		
 		}
 	});
 */
(function(exports){
	TY.loader('TY.ui.pop');
	TY.loader('TY.ui.photoV2');
	
	var _fpr = null, _PictureChoose = exports.comp.PictureChoose,
	KEY_SPECIAL_LIST = 'KEY_SPECIAL_LIST',
	//模板增加了"推荐理由"和删除了"优惠活动"，"推荐理由"可填可不填
	template = {
			CREATE	:	[
				'<div class="fele form-horizontal pop-shopping" id="pop_create_product">',
					'<div class="form-item">',
						'<label for="product_link">商品链接：</label>',
						'<div class="form-field">',
							'<input type="text" class="form-text inline-ele" name="product_link">',
							'<a class="btn p-bluebtn _fetch" href="javascript:void(0);">采集</a>',
							'<div style="color:red;">输入商品链接，点采集按钮，可以快速采集商品名称和图片</div>',
						'</div>',
					'</div>',
					'<div class="form-item form-required">',
						'<label for="product_name"><i class="icon-required">*</i>商品名称：</label>',
						'<div class="form-field"><input type="text" class="form-text" name="product_name"></div>',
					'</div>',
					'<div class="form-item form-required form-item-special">',
						'<label><i class="icon-required">*</i>商品图片：</label>',
						'<div class="form-field">',
							'<ul class="clearfix _images">',
								'<li>',
									'<div class="img-wrap _image_wrap">',
										'<!--<img width="100" height="100" alt="" src="static/images/pic/img100.jpg">-->',
										'<div class="admin-option pngfix dd-pngfix none">',
											'<span class="sp-left"><a href="javascript:void(0);" class="move-left pngfix dd-pngfix _op_move_left"></a><a href="javascript:void(0);" class="move-right pngfix dd-pngfix _op_move_right"></a></span>',
											'<span class="sp-right"><a href="javascript:void(0);" class="pngfix dd-pngfix _op_delete"></a></span>',
										'</div>',
									'</div>',
									'<a class="btn p-greybtn _op_browse" href="javascript:void(0);">浏览</a>',
								'</li>',
								'<li>',
									'<div class="img-wrap _image_wrap">',
										'<!--<img width="100" height="100" alt="" src="static/images/pic/img100.jpg">-->',
										'<div class="admin-option pngfix dd-pngfix none">',
											'<span class="sp-left"><a href="javascript:void(0);" class="move-left pngfix dd-pngfix _op_move_left"></a><a href="javascript:void(0);" class="move-right pngfix dd-pngfix _op_move_right"></a></span>',
											'<span class="sp-right"><a href="javascript:void(0);" class="pngfix dd-pngfix _op_delete"></a></span>',
										'</div>',
									'</div>',
									'<a class="btn p-greybtn _op_browse" href="javascript:void(0);">浏览</a>',
								'</li>',
								'<li>',
									'<div class="img-wrap _image_wrap">',
										'<!--<img width="100" height="100" alt="" src="static/images/pic/img100.jpg">-->',
										'<div class="admin-option pngfix dd-pngfix none">',
											'<span class="sp-left"><a href="javascript:void(0);" class="move-left pngfix dd-pngfix _op_move_left"></a><a href="javascript:void(0);" class="move-right pngfix dd-pngfix _op_move_right"></a></span>',
											'<span class="sp-right"><a href="javascript:void(0);" class="pngfix dd-pngfix _op_delete"></a></span>',
										'</div>',
									'</div>',
									'<a class="btn p-greybtn _op_browse" href="javascript:void(0);">浏览</a>',
								'</li>',								
								'<li>',
									'<div class="img-wrap _image_wrap">',
										'<!--<img width="100" height="100" alt="" src="static/images/pic/img100.jpg">-->',
										'<div class="admin-option pngfix dd-pngfix none">',
											'<span class="sp-left"><a href="javascript:void(0);" class="move-left pngfix dd-pngfix _op_move_left"></a><a href="javascript:void(0);" class="move-right pngfix dd-pngfix _op_move_right"></a></span>',
											'<span class="sp-right"><a href="javascript:void(0);" class="pngfix dd-pngfix _op_delete"></a></span>',
										'</div>',
									'</div>',
									'<a class="btn p-greybtn _op_browse" href="javascript:void(0);">浏览</a>',
								'</li>',								
								'<li>',
									'<div class="img-wrap _image_wrap">',
										'<!--<img width="100" height="100" alt="" src="static/images/pic/img100.jpg">-->',
										'<div class="admin-option pngfix dd-pngfix none">',
											'<span class="sp-left"><a href="javascript:void(0);" class="move-left pngfix dd-pngfix _op_move_left"></a><a href="javascript:void(0);" class="move-right pngfix dd-pngfix _op_move_right"></a></span>',
											'<span class="sp-right"><a href="javascript:void(0);" class="pngfix dd-pngfix _op_delete"></a></span>',
										'</div>',
									'</div>',
									'<a class="btn p-greybtn _op_browse" href="javascript:void(0);">浏览</a>',
								'</li>',								
							'</ul>',
						'</div>',
					'</div>',
					'<div class="form-item">',
						'<label for="product_name">商品价格：</label>',
						'<div class="form-field"><input type="text" class="form-text w100" name="product_price"></div>',
					'</div>',
					'<div class="form-item">',
						'<label for="product_des">推荐理由：</label>',
						'<div class="form-field"><textarea class="w428" name="product_des"></textarea></div>',
					'</div>',
					'<div class="form-item form-item-special">',
						'<label for="product_tags">添加标签：</label>',
						'<div class="form-field">',
							'<input type="text" class="form-text w500" name="product_tags">',
							'<p class="form-des">(多个标签请使用空格或者逗号分隔)</p>',
							'<!--<p class="rec-tags mb10">推荐标签：<span class="pop-tag">牛仔裤</span><span class="pop-tag">连衣裙</span></p>-->',
						'</div>',
					'</div>',
					'<p class="form-error none">填写错误！</p>',
					'<div class="form-action"><a class="btn p-bluebtn _submit" href="javascript:void(0);">确定</a></div>',
				'</div>'
		    ],
		    CREATE_SUCCESS	:	[
				'<div class="fele pop-shopping" id="pop_create_success">',
					'<p class="status-success"><i class="icon-right">✓</i>发布成功！</p>',
					'<div class="form-action"><a class="btn p-bluebtn" href="#" target="_blank">前往查看</a></div>',
				'</div>'
      	 	],
      	 	PRODUCT_TO_SPECIAL	:	[
				'<div id="pop_product_to_special" class="fele pop-shopping">',
					'<div class="add_special_pic _picwrap">',
						'<!-- <img src="static/images/pic/img141-162.jpg" alt="" /> -->',
					'</div>',
					'<div class="add_special_list">',
						'<div class="special_list_item _dropMenu">&nbsp;</div>',
						'<div class="special_list_info">',
							'<p class="form-error" style="display:none;">填写错误！</p>',
							'<div class="form-action"><a href="#" class="btn p-bluebtn _confirm">确定</a></div>',
						'</div>',
					'</div>',
				'</div>'
      	 	],
      	 	PRODUCT_TO_SPECIAL_SUCCESS	:	[
				'<div class="fele pop-shopping" id="pop_create_success">',
					'<p class="status-success"><i class="icon-right">✓</i>添加成功！</p>',
					'<div class="form-action"><a class="btn p-bluebtn" href="#" target="_blank">前往查看</a></div>',
				'</div>'
     	 	],
     	 	PRODUCT_TO_SPECIAL_CREATE	:	[
				'<div class="special_list_create">',
					'<input type="text" name="special_name" class="form-text" bindcursor="true">',
					'<a href="javascript:void(0);" class="btn p-bluebtn ">创建</a>',
				'</div>' 	 
     	 	]
	},
	CONST = {
			TITLE_MIN_LEN	:	10,
			TITLE_MAX_LEN	:	100
	},
	MSG	= {
			PARAM_ERROR	:	'参数错误',
			OP_CREATE	:	'发布商品',
			PRODUCT_TO_SPECIAL	:	'加入专辑',
			
			ADD_PRODUCT_TO_SPECIAL_SUCCESS	:	'加入专辑成功',
			SELECT_SPECIAL	:	'请选择专辑',
			
			VALID_ERR_NULL	:	'#1 不能为空',
			VALID_ERR_LENGTH	:	'#1 为#2-#3个汉字 ',
			VALID_ERR_NUM_FORMAT	:	'#1 为不小于0的数字',
			VALID_ERR_AT_LEAST_PIC	:	'请至少上传一张图片',
			TAG_FORMAT_ERROR	:	'标签格式不正确',
			PRODUCT_IS_NULL_ERROR : '抱歉，分享的商品链接地址不能为空',
			PRODUCT_LINK_ERROR : '商品链接不合法'
	};
	
	var BizProductOp = function(args){
		var defArgs = {
				type	:	'create',//操作类型，create|delete|hook-special
				param	:	{},//参数，可选
				popCloseHandler	:	function(){},//关闭按钮事件
				completeHandler	:	function(){
					
				}
		};
		this.pop = null;
		this.proc = false; //是否在请求
		this.pictureChooseComp = null;//图片选择组件
		this.cfg = jQuery.extend({}, defArgs, args);
		this.init();
	};
	
	jQuery.extend(BizProductOp.prototype, {
		
		init	:	function(){
			var t = this, cfg = t.cfg;
			if(cfg.type	==	'create'){
				t.createOp();
			}else if(cfg.type == 'delete'){
				if(cfg.param.productId && cfg.param.productName){
					t.deleteOp();
				}else{
					t.simplePop(MSG.PARAM_ERROR);
				}
			}else if(cfg.type == 'hook-special'){
				if(cfg.param.productId && cfg.param.productURL){
					t.hookOp();
				}else{
					t.simplePop(MSG.PARAM_ERROR);
				}
			}else{
				t.simplePop(MSG.PARAM_ERROR);
			}
		},
		
		createOp	:	function(){
			var t = this;
			
			t.pop = new TY.ui.pop({
				headTxt	:	MSG.OP_CREATE,
				body	:	template.CREATE.join(''),
				isShowButton	:	false,
				isDrag	:	true,
				render	:	function(){
					t.createOp_bind();
				}
			});
		},
		
		createOp_bind	:	function(){
			var t = this, u = exports.util;
			t.node = jQuery('#pop_create_product');
			
			//抓取
			jQuery('._fetch', t.node).click(function(){
				
				if(t.proc){
					return;
				}
				
				var prodLink = jQuery.trim( jQuery(':text[name=product_link]').val() );
				if(!prodLink){
					t.createOp_message(MSG.PRODUCT_IS_NULL_ERROR); //商品链接不能为空
					return;
				}
				
				
				//sourceUrl, not necessary
				
				if(!u.isNull(prodLink)){
					var regEx = /(http[s]{0,1}):\/\/.+/;
					if( !regEx.test(prodLink) ){
						t.createOp_message( MSG.PRODUCT_LINK_ERROR );
						return;
					}
				}
				
				
				//去掉图片预览浮层
				try {
					if(t.pictureChooseComp){
						t.pictureChooseComp.destroy();
						t.pictureChooseComp = null;
					}
				} catch (e) {
					t.pictureChooseComp = null;
				}
				
				
				t.createOp_fetchWaiting();
				var p = {
						url	:	prodLink
				};
				var cb = {
						success	:	function(resp){
							if(resp.result == 1){
								t.createOp_setValue(resp.data);
							}else{
								t.createOp_message(resp.message);
							}
							
							t.createOp_fetchOver();
						},
						failure	:	function(e){
							t.createOp_message(e);
							t.createOp_fetchOver();
						}
				};
				exports.service.fetch(p, cb);
				return false;
			});
			
			//图片操作
			jQuery('._image_wrap', t.node).mouseenter(function(){
				var curr = jQuery(this);
				if(jQuery('img', curr).length > 0){
					jQuery('.admin-option', curr).show();
				}
			}).mouseleave(function(){
				jQuery('.admin-option', jQuery(this)).hide();
			});
			
			//左移动，右移动，删除
			jQuery('._image_wrap .admin-option', t.node).each(function(i){
				var curr = jQuery(this);
				
				jQuery('._op_move_left', curr).attr('data-index', i).click(function(){
					var currIndex = parseInt( jQuery(this).attr('data-index') );
					if(currIndex == 0){
						return;
					}
					t.createOp_exchange_image(currIndex - 1, currIndex);
				});
				
				jQuery('._op_move_right', curr).attr('data-index', i).click(function(){
					var currIndex = parseInt( jQuery(this).attr('data-index') );
					if(currIndex == 4){
						return;
					}
					t.createOp_exchange_image(currIndex, currIndex + 1);
				});
				
				jQuery('._op_delete', curr).attr('data-index', i).click(function(){
					t.createOp_remove_image( jQuery(this).attr('data-index') );
				});
			});
			
			//浏览上传
			jQuery('._images a._op_browse', t.node).each(function(i){
				var up = jQuery(this);
				(function(index){
					
					new exports.comp.FileUpload({
						el	:	up,
						handler	:	function(rt){
							if(rt.result == 1){
								var bigurl = rt.data.photo[0].bigurl;
								t.createOp_procImage(index, bigurl);
							}
						}
					});
					
				})(i);
			});
			
			//提交
			jQuery('._submit', t.node).click(function(){
				var data	= 	t.createOp_getValue();
				var rt		=	t.createOp_validate(data);
				if(rt.result){
					t.createOp_submit(data);
				}else{
					var messages = rt.message.join('<br/>');
					t.createOp_message( messages );
				}
			});
			
			//取消优惠选择
			jQuery('._cancel_youhui', t.node).click(function(){
				jQuery(':radio[name=youhui][checked]').removeAttr('checked');
			});
			
		},
		
		createOp_fetchWaiting	:	function(){
			var t = this;
			t.proc = true;
			jQuery('<span class="proc-loading">&nbsp;</span>').insertAfter( jQuery('._fetch') );
		},
		
		createOp_fetchOver	:	function(){
			var t = this;
			t.proc = false;
			jQuery('.proc-loading').remove();
		},
		
		//交互图片
		createOp_exchange_image	:	function(from, to){
			var t = this, 
			from_wrap = jQuery('._images ._image_wrap:eq(' + from + ')', t.node),
			to_wrap = jQuery('._images ._image_wrap:eq(' + to + ')', t.node),
			from_image = jQuery('img', from_wrap),
			to_image = jQuery('img', to_wrap);
			
			from_wrap.append( to_image );
			to_wrap.append( from_image );
			
		},
		
		//删除图片
		createOp_remove_image	:	function(idx){
			var t = this, wrap = jQuery('._images ._image_wrap:eq(' + idx + ')', t.node);
			
			jQuery('img', wrap).remove();
		},
		
		//删除所有图片
		createOp_remove_image_all	:	function(){
			var t = this;
			jQuery('._images ._image_wrap img', t.node).remove();
		},
		
		//处理图片
		createOp_procImage	:	function(index, picURL){
			var t = this, wrap = jQuery('._images ._image_wrap:eq(' + index + ')', t.node);
			
			new exports.comp.Cut({
				width	:	wrap.width(),
				height	:	wrap.height(),
				url		:	picURL,
				handler	:	function(rt){
					var tmp = jQuery('<img title="点击查看原图"/>')
					tmp.css('width', rt.scaleW);
					tmp.css('height', rt.scaleH);
					tmp.css('margin-top', rt.marginTop);
					tmp.css('margin-left', rt.marginLeft);
					tmp.attr('src', rt.url);
					
					jQuery('img', wrap).remove();
					wrap.append( tmp );
					
					tmp.click(function(){
						window.open(this.src, '_blank');
					});
				}
			});
		},
		
		//fech接口返回值处理
		createOp_setValue	:	function(data){
			var t = this, node = t.node, pics = data.picUrls, picLen = pics.length;
			
			jQuery('.form-error', node).hide(); // 隐藏错误的信息
			
			jQuery(':text[name=product_name]').val( data.title );
			jQuery(':text[name=product_price]').val( data.price );
			
			if(data.clickUrl){
				t.buyUrl = data.clickUrl;
			}
			if(data.cid){
				t.cid = data.cid;
			}
			
			//合作方
			if(data.isPartner == 1){
				t.createOp_remove_image_all();
				for(var i = 0; i < picLen; i++){
					t.createOp_procImage(i, pics[i]);
				}
			}else{
				
				t.pictureChooseComp = new _PictureChoose({
					picURLs			:	pics,
					target			:	jQuery('._fetch', node),
					max				:	5,
					chosenHandler	:	function(arr){
						t.createOp_remove_image_all();
						for(var j = 0; j < arr.length; j++){
							t.createOp_procImage(j, arr[j]);
						}
					}
				});
			}
			
		},
		
		//获取表单值
		createOp_getValue	:	function(){
			var t = this, node = t.node, tmpUrls = [],
			rt = new Object();
			
			rt['sourceUrl']		=	jQuery.trim( jQuery(':text[name=product_link]').val() );
			rt['title']			=	jQuery.trim( jQuery(':text[name=product_name]').val() );
			rt['price']			=	jQuery.trim( jQuery(':text[name=product_price]').val() );
			rt['description']	=	jQuery.trim( jQuery('textarea[name=product_des]', node).val() );
			rt['buyUrl']		=	t.buyUrl ? t.buyUrl : rt['sourceUrl'];
			rt['tempTags']		=	jQuery.trim( jQuery(':text[name=product_tags]').val() );
			rt['zoneId']		=	t.cfg.param.zoneId;
			rt['couponType']	=	jQuery(':radio[name=youhui][checked]').val();
			jQuery('._images ._image_wrap img', node).each(function(){
				tmpUrls.push( this.src );
			});
			rt['picUrls']		=	tmpUrls.length == 0 ? null : tmpUrls.join(',');
			if(t.cfg.param.specialId){
				rt['specialId'] = t.cfg.param.specialId;
			}
			if(t.cid){
				rt['cid']		= t.cid;
			}
			
			return rt;
		},
		//验证对象
		createOp_validate	:	function(p){
			var t = this, u = exports.util,
			rt = {result : true, message : []};
			
			//sourceUrl, not necessary
			
			if(!u.isNull(p.sourceUrl)){
				var regEx = /(http[s]{0,1}):\/\/.+/;
				if( !regEx.test(p.sourceUrl) ){
					rt.result = false;
					rt.message.push( MSG.PRODUCT_LINK_ERROR );
				}
			}
			
			
			//title
			if( u.strlen(p.title) < CONST.TITLE_MIN_LEN || u.strlen(p.title) > CONST.TITLE_MAX_LEN ){
				rt.result = false;
				rt.message.push( MSG.VALID_ERR_LENGTH.replace(/#1/, '商品名称').replace(/#2/, CONST.TITLE_MIN_LEN/2).replace(/#3/, CONST.TITLE_MAX_LEN/2));
			}
			
			//price
			if( u.isNull(p.price) ){
				p.price = 0.0;//价格为空，默认填0.0
			}else if( u.isNaN(p.price) ){
				rt.result = false;
				rt.message.push( MSG.VALID_ERR_NUM_FORMAT.replace(/#1/, '商品价格'));
			}
			
			//picUrls
			if( !p.picUrls ){
				rt.result = false;
				rt.message.push( MSG.VALID_ERR_AT_LEAST_PIC );
			}
			
			//tempTags
			if( !u.isNull(p.tempTags) ){
				var regEx = /^[\u4e00-\u9fa5a-zA-Z0-9](( |,|，)?[\u4e00-\u9fa5a-zA-Z0-9]+)*$/;
				if( !regEx.test(p.tempTags) ){
					rt.result = false;
					rt.message.push( MSG.TAG_FORMAT_ERROR );
				}
				p.tempTags = p.tempTags.replace(/，/g, ',').replace(/ /g, ',');
			}
			
			return rt;
		},
		
		//提交
		createOp_submit	:	function(data){
			var t = this,
			cb = {
					success	:	function(resp){
						
						if(resp.result == 1){
							
							t.removePop();
							
							var content = template.CREATE_SUCCESS.join('');
							t.pop = new TY.ui.pop({
								headTxt	:	'提示',
								body	:	content,
								isShowButton	:	false,
								closeHandler	:	t.cfg.popCloseHandler,
								render	:	function(){
									var url;
									if(t.cfg.param.zoneUrl){
										url = t.cfg.param.zoneUrl + resp.data;
									}else{
										url = resp.data;
									}
									jQuery('#pop_create_success a').attr('href', url).click(function(){
										t.removePop();
										t.opCompleteHandler();
									});
								}
							});
							
						}else{
							t.createOp_message( resp.message );
						}
						
						t.proc = false;
					},
					failure	:	function(e){
						t.proc = false;
						t.createOp_message(e);
					}
			};
			
			if(t.proc){
				return;
			}
			t.proc = true;
			exports.service.create(data, cb);
		},
		
		//显示信息
		createOp_message	:	function( msg ){
			var t = this;
			jQuery('.form-error', t.node).html('').show().html( msg );
		},
		
		deleteOp	:	function(){
			var t = this, param = t.cfg.param,
			p = {
					productId	:	param.productId,
					specialId	:	param.specialId
			},
			cb = {
					success	:	function(resp){
						t.simplePop(resp.message);
						if(resp.result == 1){
							t.opCompleteHandler();
						}
					},
					failure	:	function(e){
						t.simplePop(e);
					}
			};
			if( confirm('确认删除[' + param.productName + ']吗？') ){
				exports.service.remove(p, cb);
			}
			return false;
		},
		
		hookOp	:	function(){
			var t = this;
			
			t.selected = null; //加入专辑操作，特有属性
			t.dropMenu = null; //加入专辑操作，特有属性
			t.special_create_node; //加入专辑操作，特有属性
			
			t.pop = new TY.ui.pop({
				headTxt	:	MSG.PRODUCT_TO_SPECIAL,
				body	:	template.PRODUCT_TO_SPECIAL.join(''),
				isShowButton	:	false,
				render	:	function(){
					t.hookOp_bind();
					t.hookOp_load();
				}
			});
		},
		
		hookOp_bind	:	function(){
			var t = this;
			t.node = jQuery('#pop_product_to_special');
			
			//确定按钮事件
			jQuery('a._confirm', t.node).click(function(){
				if(!t.selected){
					t.hookOp_message( MSG.SELECT_SPECIAL );
					return false;
				}
				t.hookOp_submit();
				return false;
			});
		},
		
		hookOp_load	:	function(){
			var t = this, node = t.node, param = t.cfg.param,
			picWrap = jQuery('._picwrap', node),
			dropMenuTarget	= jQuery('._dropMenu', node);
			
			//加载图片，缩放操作
			new exports.comp.Scale({
				width	:	picWrap.width(),
				height	:	picWrap.height(),
				url		:	param.productURL,
				handler	:	function(rt){
					var tmp = jQuery('<img/>')
					tmp.css('width', rt.scaleW);
					tmp.css('height', rt.scaleH);
					tmp.css('margin-top', rt.marginTop);
					tmp.css('margin-left', rt.marginLeft);
					tmp.attr('src', rt.url);
					picWrap.append( tmp );
				}
			});
			
			//初始化专辑下拉框
			var _initDropMenu = function(data){
				t.dropMenu = new exports.comp.DropMenu({
					target	:	dropMenuTarget,
					data	:	data,
					render	:	function(obj){
						t.hookOp_special_create( obj );
					},
					handler	:	function(rt){
						t.selected = rt;
						dropMenuTarget.html( rt.key );
					}
				});
				
				dropMenuTarget.html( data[0].key );
				t.selected = data[0];
			};
			
			//加载专辑列表
			if(exports.cache[KEY_SPECIAL_LIST]){
				_initDropMenu( exports.cache[KEY_SPECIAL_LIST] );
			}else{
				var p = {
						
				},cb = {
						success	:	function(resp){
							if(resp && resp.result == 1 && resp.data && resp.data.dataList && resp.data.dataList.length > 0){
								var rt = [], dataLen = resp.data.dataList.length, i = 0, obj, tmp;
								for(; i < dataLen; i++){
									obj = resp.data.dataList[i];
									tmp = {
											key		:	obj.name,
											value	:	obj.specialId	
									};
									rt.push( tmp );
								}
								exports.cache[KEY_SPECIAL_LIST] = rt;
								_initDropMenu( exports.cache[KEY_SPECIAL_LIST] );
							}
						},
						failure	:	function(e){
						}
				};
				exports.service.userSpecialList(p, cb);
			}
		},
		
		hookOp_special_create	:	function(pNode){
			var t = this;
			
			t.special_create_node = jQuery( template.PRODUCT_TO_SPECIAL_CREATE.join('') );
			pNode.append( t.special_create_node );
			
			//创建专辑事件
			jQuery('a', t.special_create_node).click(function(){
				if(t.proc){
					return false;
				}
				
				var specialName = jQuery.trim( jQuery('input[name=special_name]', t.special_create_node).val() );
				if(!specialName){
					return;
				}
				
				t.proc = true;
				var p = {
						name	:	specialName
				},cb = {
						success	:	function(resp){
							if(resp && resp.result == 1){
								var opt = {
										key		:	specialName,
										value	:	resp.data
								};
								
								t.dropMenu.addOption(opt, true);
								t.dropMenu.select( opt.value );
								exports.cache[KEY_SPECIAL_LIST].push( opt );
							}
							t.proc = false;
						},
						failure	:	function(e){
							t.proc = false;
						}
				};
				exports.service.createSpecial(p, cb);
				return false;
			});
			
		},
		
		hookOp_submit	:	function(){
			var t = this;
			
			if(t.proc){
				return false;
			}
			
			t.proc = true;
			var p = {
					specialId	:	t.selected.value,
					productId	:	t.cfg.param.productId
			},
			cb = {
					success	:	function(resp){
						if(resp && resp.result == 1){
							t.removePop();
							
							var content = template.PRODUCT_TO_SPECIAL_SUCCESS.join('');
							t.pop = new TY.ui.pop({
								headTxt	:	'提示',
								body	:	content,
								isShowButton	:	false,
								closeHandler	:	t.cfg.popCloseHandler,
								render	:	function(){
									var url = t.cfg.param.zoneUrl + '/share/special/' + t.selected.value + '.html';
									jQuery('#pop_create_success a').attr('href', url).click(function(){
										t.removePop();
										t.opCompleteHandler();
									});
								}
							});
							
						}else{
							t.hookOp_message(resp.message);
						}
						
						t.proc = false;
					},
					failure	:	function(e){
						t.hookOp_message(e);
						t.proc = false;
					}
			};
			exports.service.addProdToSpecial(p, cb);
		},
		
		//显示信息
		hookOp_message	:	function( msg ){
			var t = this;
			jQuery('.form-error', t.node).show().html( msg );
		},
		
		opCompleteHandler	:	function(p){
			var t = this, cfg = t.cfg;
			if(cfg.completeHandler && cfg.completeHandler instanceof Function){
				cfg.completeHandler(p);
			}
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
	
	//export
	exports.comp.BizProductOp = BizProductOp;
})(_mall);
