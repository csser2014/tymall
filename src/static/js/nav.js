/**
 * 用于导航栏特定脚本文件
 */
(function(exports){
	
	var proc = false,
	CONST = {
			HOST	:	''
	},
	zoneData = null,
	TEMPLATE = {
		//未登陆状态
		USER_NAV_LOGIN	:	[
			'<div id="login-area">',
				'<a href="javascript:void(0);" class="subnav-login" id="p-login">登录</a>|',
				'<a class="subnav-register" id="p-register" target="_blank" href="http://passport.tianya.cn/register/default.jsp?sourceURL=#RETURN_URL#">注册</a>',
			'</div>'
        ],
        //登陆状态
        USER_NAV_INFO	:	[
			'<div id="login-succ">',
			    '<a target="_blank" href="#HOST#/#USERID#" class="user-name"><img alt="用户头像" src="http://tx.tianyaui.com/logo/small/#USERID#"><span>#USERNAME#</span></a>',
			    '<ul class="drop-menu-t" style="display: none;">',
			        '<li class="user-youji">',
			            '<li class="my-share-t"><a href="/#USERID#">我的分享</a></li>',
						'<li class="my-special-t"><a href="/#USERID#/myLike">我的喜欢</a></li>',
						'<li class="user-exit-t"><a href="http://passport.tianya.cn/logout?returnURL=#RETURN_URL#">退出</a></li>',
			        '</li>',
			    '</ul>',
			'</div>'
 	    ]
	},
	regExpFillData = function(src, obj){
		var rt = src;
		if(src && obj){
			for(var prop in obj){
				var reg = new RegExp('#' + prop + '#', 'g');
				rt = rt.replace(reg, obj[prop]);
			}
		}
		return rt;
	}
	
	//用户导航
	function initUserNav(){
		var selector = '._user_nav';
		
		jQuery('#p-login').live('click', function(){
			exports.adapter.login();
		});
		
		jQuery('#login-succ').live('mouseover',function(){
		  	jQuery(this).find('.drop-menu-t').show();
		}).live('mouseleave',function(){
		  	jQuery(this).find('.drop-menu-t').hide();
		});
		
		//未登陆
		if(!exports.adapter.isOnline()){
			var loginHTML = TEMPLATE.USER_NAV_LOGIN.join('').replace('#RETURN_URL#', window.location.href);
			jQuery(selector).empty().append( loginHTML );
			return;
		}
		
		//已登陆
		var tmpHTML = TEMPLATE.USER_NAV_INFO.join(''),
		tmp = {
			'HOST'	:	CONST.HOST,
			'USERID'	:	exports.adapter.getUserId(),
			'USERNAME'	:	exports.adapter.getUserName(),
			'RETURN_URL':	 window.location.href
		}, tmpNode;
		
		tmpNode = jQuery( regExpFillData(tmpHTML, tmp) );
		jQuery(selector).empty().append(tmpNode);
	}
	
	//处理商家用户导航链接
	function procUserNavLink(zoneURL){
		var shareLink = zoneURL + '/share', likeLink = zoneURL + '/share/like';
		
		jQuery('#login-succ .user-name').attr('href', shareLink);
		jQuery('#login-succ .my-share-t a').attr('href', shareLink);
		jQuery('#login-succ .my-special-t a').attr('href', likeLink);
	}
	
	//分享商品	
	function initProductOp(){
		jQuery('#nav_share').click(function(){
			if(!exports.adapter.isOnline()){
				exports.adapter.login();
				return false;
			}
			
			//普通用户和企业用户弹出的都是同一个分享框
			new exports.comp.BizProductOp({
				type	:	'create',
				param	:	{
					zoneId	:	zoneData.zoneId,
					zoneUrl	:	zoneData.zoneUrl
				},
				completeHandler	:	function(){
					//np
				}
			});
		});
	}
	
	//加载用户空间信息
	function initZoneInfo(){
		if(!exports.adapter.isOnline()){
			return false;
		}
		
		var p = { userId : exports.adapter.getUserId() },
		cb = {
				success	:	function(resp){
					//企业用户
					if(resp.result == 1 && resp.data != null && resp.data.zoneType != 6){
						zoneData = {
								zoneId	:	resp.data.zoneId,
								zoneUrl	:	resp.data.zoneUrl
						};
					}else{
						zoneData = {
								zoneId	:	0,   //普通用户给一个默认值
								zoneUrl	:	""
						}; //普通用户
					}
					procUserNavLink( zoneData.zoneUrl );
				},
				failure	:	function(e){
				}
		};
		exports.service.getZoneInfo(p, cb);
	}
	
	function initBottomNav(){
		
		//商品详情嵌入页不加载下导航
		var url = window.location.href;
		var reg = /\/item\/iframe\/\d+/i;
		if( reg.test(url) ){
			return;
		}
		/*
		TY.loader('TY.ui.nav',function(){
			TY.ui.nav.init ({
				app_str:' ',		
				showTopNav: false,		
				topNavWidth: 1000,	
				showBottomNav:false
			});
		});
		*/
	}
	
	//页面返回顶部按钮
	function addBackToTopTips(){
		var toTop = jQuery('<div class="mall-back-to-top"><a class="mall-feedback" href="http://bbs.tianya.cn/post-797-23216-1.shtml" target="_blank"></a><div class="mall-top"></div></div>').hide();
		var timmer = '',timerOut='';
		jQuery('body').append(toTop);
		
		toTop.click(function(){
			jQuery('body,html').animate({
				scrollTop : 0
			});
		});
		if(jQuery.browser.msie&&jQuery.browser.version<7){
			jQuery(window).scroll(function(){
				clearTimeout(timerOut);
				clearInterval(timer);
				toTop.hide();
				timerOut = setTimeout(function(){
					showBTTIE();
					timer = setInterval(showBTTIE,800);
				},800);
			});
			timer = setInterval(showBTTIE,800);
		}else{
			timer = setInterval(showBTT,800);
		}
		function showBTT(){
			var ww = jQuery(document).width();
			var bw = jQuery('#container').width();
			var left = ww/2 + bw/2 + 10;
			var scrollTop = jQuery(window).scrollTop();
			if(scrollTop>5){
				toTop.css({
					left : left
				}).fadeIn();
			}else{
				toTop.fadeOut();
			}
		}
		function showBTTIE(){
			var ww = jQuery(document).width();
			var wh = jQuery(window).height();
			var bw = jQuery('#container').width();
			var left = ww/2 + bw/2 + 10;
			var scrollTop = jQuery(window).scrollTop();
			if(scrollTop>5){
				toTop.css({
					left : left,
					top : scrollTop + wh - 47 - 200 
				}).fadeIn();
			}else{
				toTop.hide();
			}
		}
	}
	
	jQuery(document).ready(function(){
		initUserNav();
		initZoneInfo();
		initProductOp();
		initBottomNav();
		addBackToTopTips();
	});
	
})(_mall);
