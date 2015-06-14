(function(exports){
	TY.loader('TY.ui.pop');
	var _fpr = null, ice = null,
		template = {
			CREATE_SHARE : [
				'<div class="fele pop-shopping" id="pop_create_share">',
					'<div class="form-item">',
						'<input type="text" placeholder="将分享的商品网址粘贴在此" class="form-text inline-ele" id="album_name"><a class="btn p-bluebtn" href="#">确定</a>',
					'</div>',
					'<div class="form-item site-support">',
						'<strong>已支持的网站：</strong>',
						/*'<span class="suning">苏宁易购</span>',
						'<span class="taobao">淘宝网</span>',
						'<span class="tmall">天猫商城</span>',*/
						'<span class="jdsc" title="京东商城">京东商城</span>',
						'<span class="slyg" title="苏宁易购">苏宁易购</span>',
						'<span class="yx" title="易迅">易迅</span>',
						'<span class="yhd" title="一号店">一号店</span>',
						'<span class="ddw" title="当当网">当当网</span>',
						'<span class="ymx" title="亚马逊">亚马逊</span>',
						/*'<span class="fkcp" title="凡客诚品">凡客诚品</span>',*/
						'<span class="vjia" title="Vjia">Vjia</span>',
						'<span class="gmzx" title="国美在线">国美在线</span>',
						'<span class="mbs" title="梦芭莎">梦芭莎</span>',
						'<span class="ytw" title="银泰网">银泰网</span>',
						'<span class="wmw" title="我买网">我买网</span>',
						'<span class="lfw" title="乐蜂网">乐蜂网</span>',
						'<span class="mbb" title="麦包包">麦包包</span>',
						'<span class="qww" title="趣玩网">趣玩网</span>',
					'</div>',
					'<p class="form-error none">填写错误！</p>',
					'<div class="declare">',
						'<p>仅支持个人用户分享，商家合作请联系020-84112006</p>',
					'</div>',
				'</div>'
			],  //分享商品网址的模板
			ADD_SHARE : [
				'<div class="fele form-horizontal pop-shopping" id="pop_share_exist">',
					'<div class="clearfix mb10">',
						'<div class="product-right">',
							'<div class="form-item product-name">',
								'<label>商品名称：</label>',
								'<div class="form-field"><h3>{0}</h3></div>',
							'</div>',
							'<p class="product-price">￥<span>{1}</span></p>',
							'<textarea placeholder="喜欢它的理由" id="love_reson"></textarea>',
						'</div>',
						'<div id="pop_img_pic" class="product-left">',
							'<div class="view-content">',
								'<ul class="clearfix">',
								'</ul>',
							'</div>',
							'<a class="prev-btn" href="#"></a><a class="next-btn" href="#"></a>',
						'</div>',
					'</div>',
					'<div class="form-item item-no-lable">',
						'<div class="form-field">',
							'<p class="form-des">添加标签(多个标签请使用空格或者逗号分隔)</p>',
							'<input type="text" class="form-text w500" id="album_tags" />',
						'</div>',
					'</div>',
					'<p class="form-error none">填写错误！</p>',
					'<div class="form-action"><a class="btn p-bluebtn" href="#">确定</a></div>',
				'</div>'
			], //抓取分享商品并添加到数据库的模板
			CREATE_SUCCESS : [
				'<div class="fele pop-shopping" id="pop_create_success">',
					'<p class="status-success"><i class="icon-right">✓</i>发布成功！</p>',
					'<div class="form-action"><a class="btn p-bluebtn" href="#" target="_blank">前往查看</a></div>',
				'</div>'
			] //添加分享商品成功的模板
		};

	MSG = {
		PARAM_ERROR : '参数错误',
		OP_SHARE   : '我要分享',
		OP_LOADING : '系统努力加载中...'
	};

	var ProductOp = function(args){
		var defArgs = {
			type	:	'create',
			param	:	null,
			completeHandler : function(){
			}
		};
		this.proc = false;
		this.pop = null;
		this.cfg = jQuery.extend({}, defArgs, args);
		this.init();
	};
	jQuery.extend(ProductOp.prototype, {
		init : function() {
			var t = this, cfg = t.cfg;
			if (cfg.type == 'create'){
				t.createOp();
			}else{
				t.simplePop(MSG.PARAM_ERROR); //错误的参数处理
			}
		},
		createOp : function(){
			var t = this;
			t.removePop();
			t.pop = new TY.ui.pop({
				headTxt : MSG.OP_SHARE,
				body : template.CREATE_SHARE.join(''),
				isShowButton : false,
				render : function(){
					t.createOp_Event();
				} //弹出分享商品网址的模板
			});
		},
		createOp_Event : function() {
			var t = this;
			t.pop_create_share = jQuery('#pop_create_share');
			jQuery('.btn', t.pop_create_share).bind('click', function(){
				t.albumName = jQuery.trim(jQuery('#album_name').val());
				if (jQuery.trim(t.albumName) === ""){
					jQuery('#pop_create_share .form-error').show().html('请输入您要分享的网址 ');
				}else{
					if (!t.proc){
						t.proc = true;
						jQuery('#pop_create_share .form-error').show().html(MSG.OP_LOADING); //提示数据加载中
						var p = {
							url : t.albumName   //分享商品的网址
						};
						var callback = {
							success : function(resp){
								if (resp.result == 1){
									t.removePop();
									t.editShare(resp);
									t.proc = false;
								}else if (resp.result == 0){
									//jQuery('#pop_create_share .form-error').show().html('暂时还不支持这个网站哦~');
									//jQuery('#pop_create_share .form-error').show().html('对不起，系统升级中，暂不支持该网站。 ');
									jQuery('#pop_create_share .form-error').show().html(resp.message);
									t.proc = false;
								}
							}, //根据url的地址获取数据
							failure : function(e) {
								jQuery('#pop_create_share .form-error').show().html('服务器需要休息下，请稍后重试');
									t.proc = false;
							}
						};
						exports.service.fetch(p, callback);
					}
				}
				
				return false;
			});
		},
		editShare : function(resp) {
			var t = this;
			t.data = resp.data;
			var productName = t.data.title,    //商品名称
				productPrice = t.data.price || 0,       //商品价格
				imgLen = t.data.picUrls.length,         //图片的长度
				addShare = template.ADD_SHARE.join('');
			var temp = t.format(addShare, productName, productPrice); //模板替换
			t.pop = new TY.ui.pop({
				headTxt : MSG.OP_SHARE,
				body : temp,
				isShowButton : false,
				render : function(){
					for (var i = 0; i < imgLen; i++) {
						t.scaleImg(t.data, i);
					}
					t.addOp();
				}
			}); //弹出抓取分享商品并添加到数据库的模板
		},
		scaleImg:function(data, i) {
			(function(url){
				var $pop_img_pic = jQuery('#pop_img_pic ul');
				var $li = jQuery('<li></li>');
				$pop_img_pic.append($li);
				new exports.comp.Cut({
					width   :   160,	
					height	:	160,
					url		:	url,
					handler	:	function(rt){
						var strImg = "";
						strImg = "<img src='" + url + "' alt='' height='" + rt.scaleH + "' width='" + rt.scaleW +"' style='margin-left:" + rt.marginLeft +  ";margin-top:" + rt.marginTop + ";' />";
						strImg = jQuery(strImg);
						$li.append(strImg);
						
						strImg.click(function(){
							window.open(this.src, '_blank');
						})
					}
				});
			})(data.picUrls[i]); //等比例缩放图片
		},
		createOp_validate : function(){
			var t = this, rt = {result:'true', msg : ''};
			if( !exports.util.isNull(t.albumTags) ){
				var regEx = /^[\u4e00-\u9fa5a-zA-Z0-9](( |,|，)?[\u4e00-\u9fa5a-zA-Z0-9]+)*$/;
				if( !regEx.test(t.albumTags) ){
					rt.result = false;
					rt.msg = '标签格式不正确';
				}
				t.albumTags = t.albumTags.replace(/，/g, ',').replace(/ /g, ',');
			}
			return rt;
		},
		addOp : function() {
			var t = this;
			t.pop_share_exist = jQuery('#pop_share_exist');
			t.previewPic(); //预览图片
			jQuery('.btn', t.pop_share_exist).bind('click', function(){
				var title = jQuery('.product-name h3').html();
				var price = parseFloat( jQuery('.product-price span').html() );
				var description = jQuery('#love_reson').val();
				t.albumTags = jQuery('#album_tags').val();
				var resOp = t.createOp_validate();
				if (!resOp.result){
					jQuery('#pop_share_exist .form-error').show().html(resOp.msg);
				}else{
					if (!t.proc){
						t.proc = true;
						jQuery('#pop_share_exist .form-error').show().html(MSG.OP_LOADING); //提示数据加载中
						var p = {
								title   : title,                       //商品标题
								price   : price,                       //商品价格
								picUrls : t.data.picUrls.join(","),    //图片地址[数组]
								description : description,             //商品描述
								sourceUrl   : t.albumName,             //抓取url的地址
								buyUrl  : t.data.clickUrl ? t.data.clickUrl : t.albumName,
								tempTags: t.albumTags,                  //标签
								cid		:	t.data.cid ? t.data.cid : ''//分类ID
						};
						var callback = {
							success : function(resp){
								if (resp.result == 1){
									t.removePop();
									t.pop = new TY.ui.pop({
										headTxt : MSG.OP_SHARE,
										body : template.CREATE_SUCCESS.join(''),
										isShowButton : false,
										render : function(){
											jQuery('#pop_create_success .btn').attr("href", resp.data).click(function(){
												t.removePop();
											});
										}
									}); //弹出发布成功模板
									t.proc = false;
								}else{
									jQuery('#pop_share_exist .form-error').show().html(resp.message);
									t.proc = false;
								}
							},
							failure : function(e){
								jQuery('#pop_share_exist .form-error').show().html(e);
								t.proc = false;
							}
						};
						exports.service.create(p, callback);
					}
				}
				return false;
			});
		},
		previewPic : function() {
			var t = this;
			t.pop_img_pic = jQuery('#pop_img_pic');
			var picIndex = 0;
			jQuery('.prev-btn', t.pop_img_pic).bind('click', function(){
				var $img_li = jQuery('ul li', t.pop_img_pic);
				var imgCount = $img_li.length;
				if (picIndex > 0){
					picIndex--;
					$img_li.each(function(){
						jQuery(this).css('display', 'none');
					});
					$img_li.eq(picIndex).css('display', 'block');
				}
				
			}); //上一张图片
			jQuery('.next-btn', t.pop_img_pic).bind('click', function(){
				var $img_li = jQuery('ul li', t.pop_img_pic);
				var imgCount = $img_li.length;
				if (picIndex < imgCount){
					if (picIndex != imgCount - 1){
						picIndex++;
					} //当前的图片数为3，但图片的下标从0开始计算，所以picIndex = 2为最大
					$img_li.each(function(){
						jQuery(this).css('display', 'none');
					});
					$img_li.eq(picIndex).css('display', 'block');
				}
			}); //下一张图片
		},
		format : function(str, productName, productPrice, strImg) {
			var args = [];
			for (var i = 1; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			return str.replace(/\{(\d+)\}/g, function(m, i){
				return args[i];
			});
		},
		removePop : function(delay){
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

	exports.comp.ProductOp = ProductOp;
})(_mall);
