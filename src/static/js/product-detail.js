(function(exports){
	
	var proc = false,
	TEMPLATE = {
			NOT_FOLLOW	:	'<a href="javascript:void(0);" class="button button-attention _follow"></a>',
			FOLLOWED	:	'<a href="javascript:void(0);" class="button button-no-attention _cancel_follow"></a>'
	},
	comment4System = '';//用于保存到购物街系统的用户评论，不带商品链接
	
	
	/**
	 * 微博发布完成后回调函数
	 */
	function twHandler(p, cb){
		exports.service.review(p, cb);
	}
	
	/**
	 * 简单弹出层
	 */
	function simplePop(content){
		var t = this;
		
		new TY.ui.pop({
			headTxt	:	'提示',
			body	:	content,
			isShowButton	:	true
		});
	}
	
	/**
	 * 初始化微博发布框和话题列表
	 */
	function initTW(args){
		var tw, twList, cfg, patchTopic,
		defArgs = {
				twNode		:	null,//微博发布框节点
				twListNode	:	null,//微博话题列表节点
				topic		:	'',//话题
				productId	:	-1,
				isCreator	:	false//当前用户是否是当前产品创建者
		};
		
		cfg = jQuery.extend({}, defArgs, args);
		patchTopic = '#' + cfg.topic + '#';
		TY.loader('TY.ui.twitterPost','TY.ui.activity', function(){
			tw = new TY.ui.twitterPost({
				el				:	cfg.twNode,
				plugins			:	-1,
				//appid			:	'brand',
				//from			:	'企业空间',
				isCross			:	true,
				wordLimit 		:	140 - Math.ceil ( exports.util.strlen( '#' + cfg.topic + '#' + ' ' + _productUrl) / 2 ),//处理字符长度
				extraHandlerFn	:	function(obj){
					//备份用户输入内容
					comment4System = obj.oPostData.title;
					//添加话题，产品链接
					obj.oPostData.title = '#' + cfg.topic + '#' + obj.oPostData.title + ' ' + _productUrl;
					//添加图片
					obj.oPostData.image = TY.util.json( [{sUrl : _firstPic.s, mUrl : _firstPic.m, lUrl : _firstPic.l}] );
					return obj;
				},
				callback		:	function(o){
					if(o.success != 1){
						return;
					}
					
					twList.refresh();
					twHandler({
						uid		:	o.data.userId,
						uName	:	o.data.userName,
						//lc		:	o.data.oTitle.replace(patchTopic, ''),
						lc		:	comment4System,
						pid		:	cfg.productId,
						ct		:	0
					},{
						success	:	function(resp){
							if(resp.result == 1){
								var rv = jQuery('._curr_product_review_num');
								rv.html( parseInt( rv.html() ) + 1 );
							}
						},
						failure	:	function(e){
							
						}
					});
					
					comment4System = '';//清空操作
				},
				render			:	function(){
					//去掉标题
					jQuery('.slogan').html( exports.adapter.getUserName() ? exports.adapter.getUserName() : '&nbsp;');
				}
			});
			
			
			/**
			 * ===========================================
			 * 话题列表数据处理插件-开始
			 * ===========================================
			 */
			TY.ui.listPlugin.TopicRemove = function(cfg){
				this.init(cfg);
			};
			jQuery.extend(TY.ui.listPlugin.TopicRemove.prototype, TY.ui.listPlugin.Base, {
				beforeItemHandle	:	function(item){
					var regExp = /<a[^>]*>#购物分享\[\d+\]#<\/a>/g;
					item.title = item.title.replace(regExp, '');
					return item;
				}
			});
			/**
			 * ===========================================
			 * 话题列表数据处理插件-结束
			 * ===========================================
			 */
			
			
			twList = new TY.ui.twitterList({
				url				:	'http://www.tianya.cn/api/tw?method=topic.ice.getTwitterByTopic',
				blogMin			:	true,
				container		:	cfg.twListNode,
				disableGroup	:	true,
				tfType			:	'script',
				isCross			:	true,
				plugins			:	['TopicRemove'],
				queryParam		:	{
					 pageSize	:	3,
		             page		:	1,
		             key		: 	encodeURIComponent( cfg.topic )
				},
				emptyText		:	'没有评论'
			});
			
			//增加 有用 按钮到新鲜事列表
			if(!cfg.isCreator){
				return;
			}
			jQuery('li.twitterlist').livequery(function(){
				var node = jQuery(this),
				links = jQuery('span.links', node),
				tmpLink = jQuery('<a href="javascript:void(0);" style="color: #fff; background-color: #0B59B2;">有用</a>'),
				p = {
					uid		:	node.attr('_userid'),
					uName	:	decodeURIComponent(node.attr('_username')),
					lc		:	decodeURIComponent(node.attr('_otitle')).replace( patchTopic , '').replace( /http\:\/\/tysurl.com\/[a-z0-9]{6,}$/i , ''),//去掉产品链接
					pid		:	cfg.productId,
					ct		:	1
				};
				
				tmpLink.click(function(){
					twHandler(p, {
						success	:	function(resp){
							if(resp.result == 1){
								simplePop('操作成功，该评论会优先显示在首页和列表页');
							}else{
								simplePop(resp.message);
							}
						},
						failure	:	function(e){
							simplePop(e);
						}
					});
					return false;
				});
				links.append(tmpLink);
			});
			
		});
	}
	
	//初始化头图
	function initHeadPic(){
		var UL = jQuery('.img-view ul'),
		thumbUL = jQuery('.thumb-list'),
		active = 'active';
		
		UL.empty();
		
		jQuery('li img', thumbUL).each(function(index){
			
			var i = index, curr = jQuery(this),
			tmpUL = jQuery('<li></li>');
			UL.append( tmpUL );
			
			if(index == 0){
				curr.parent().addClass(active);
			}
			curr.parent().mouseenter((function(no){
				return function(){
					jQuery('li', UL).hide();
					jQuery('li:eq(' + no + ')', UL).show();
					
					jQuery('li', thumbUL).removeClass(active);
					jQuery('li:eq(' + no + ')', thumbUL).addClass(active);
				}
			})(i));
			
			new exports.comp.Cut({
				width	:	tmpUL.width(),
				height	:	tmpUL.height(),
				url		:	curr.attr('data-bigurl'),
				handler	:	function(rt){
					var tmp = jQuery('<img/>')
					tmp.css('width', rt.scaleW);
					tmp.css('height', rt.scaleH);
					tmp.css('margin-top', rt.marginTop);
					tmp.css('margin-left', rt.marginLeft);
					tmp.attr('src', rt.url);
					tmpUL.append( tmp );
				}
			});
			
		});
		
	}
	
	/**
	 * 关注与取消关注
	 */
	function initFollow(){
		
		var followCTN = jQuery('._FOLLOW_CTN'),
		followId = followCTN.attr('data-follow-id'),
		followed = followCTN.attr('data-followed') == 'true';
		
		followCTN.empty();
		
		//是否是自己
		if( exports.adapter.isOnline() ){
			if( exports.adapter.getUserId() == followId ){
				return;
			}
		}
		
		//关注与否
		if(followed){
			followCTN.append( TEMPLATE.FOLLOWED );
		}else{
			followCTN.append( TEMPLATE.NOT_FOLLOW );
		}
		
		//点击关注按钮
		jQuery('._follow').live('click', function(){
			if(!exports.adapter.isOnline()){
				return false;
			}
			
			if(proc){
				return false;
			}
			proc = true;
			
			var p = {
					userId	:	followId
			},
			cb = {
					success	:	function(d){
						followCTN.empty().append( TEMPLATE.FOLLOWED );
						proc = false;
					},
					failure	:	function(e){
						proc = false;
					}
			};
			exports.twService.follow(p, cb);
			return false;
		});
		//点击取消关注按钮
		jQuery('._cancel_follow').live('click', function(){
			if(!exports.adapter.isOnline()){
				return false;
			}
			
			if(proc){
				return false;
			}
			proc = true;
			
			var p = {
					userId	:	followId
			},
			cb = {
					success	:	function(d){
						followCTN.empty().append( TEMPLATE.NOT_FOLLOW );
						proc = false;
					},
					failure	:	function(e){
						proc = false;
					}
			};
			exports.twService.cancelFollow(p, cb);
			return false;
		});
	}
	
	jQuery(document).ready(function(){
		var productId = null, isCreator = false;
		try {
			productId = _currProdId;
			isCreator = exports.adapter.getUserId() == _currProdCreatorId;
		} catch (e) {
			productId = 123;
		}
		
		var topic = '购物分享[' + productId + ']';
		initTW({
			twNode		:	jQuery('.tw_ctn'),
			twListNode	:	jQuery('.tw_list_ctn'),
			topic		:	topic,
			productId	:	productId,
			isCreator	:	isCreator
		});
		initHeadPic();
		initFollow();
	});
})(_mall);
