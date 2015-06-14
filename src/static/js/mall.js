var _mall = {};
(function(exports){
	
	/**
	 * 继承函数
	 * @param {Class} subClass 子类
	 * @param {Class} superClass 父类
	 */
	var extend = function(subClass,superClass){
		var F = function(){};
		F.prototype = superClass.prototype;
		subClass.prototype = new F();
		subClass.prototype.constructor = subClass;
		subClass.superclass = superClass.prototype;
		if(superClass.prototype.constructor == Object.prototype.constructor) {
			superClass.prototype.constructor = superClass;
		}
	};
	
	/**
	 * 当前页面URL参数表
	 */
	var getArgs = function(){
		var args = new Object();
		var query = location.search.substring(1);
		var pairs = query.split("&");
		for(var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('=');
			if (pos == -1) continue;
			var argname = pairs[i].substring(0,pos);
			var value = pairs[i].substring(pos+1);
			value = decodeURIComponent(value);
			args[argname] = value;
		}
		return args;
	};
	
	
	/**
	 * 对象基类，提供set和get方法
	 */
	var CObject = function(param){
		this._data = {};
		for(var key in param){
			if(param.hasOwnProperty(key)){
				this.set(key, param[key]);
			}
		}
	};
	/**
	 * 存储组件全局参数到组件沙盒
	 */
	CObject.prototype.set = function(key,value){
		this._data[key] = value;
	};
	/**
	 * 获得组件全局参数值
	 */
	CObject.prototype.get = function(/*String*/key){
		return this._data[key];
	};
	
	
	
	var MSG = {
			SERVER_ERROR		:	'服务器忙，请稍候再试',
			NONE_DATA			:	'没有数据',
			LOADING_DATA_ERROR	:	'加载数据错误'
	};
	/**
	 * 应用通信类
	 * @constructor
	 * @class
	 * @param {Object} cfg
	 * cfg.host, cfg.protocol, cfg.port, cfg.crossdomain, cfg.proxy
	 */
	var AbstractServiceLocator = function(cfg){
		var ts = new Date().getTime() + '' + Math.floor( (Math.random() * 1000) );
		this._cfg = {
				protocol 	:	'http',
				host		:	'somehost',
				port		:	80,
				crossdomain	:	true,
				proxy	:	'/proxy.html',
				iframeName	:	'iframe_' + ts
		};
		this.METHOD = {
				GET : 'get',
				POST : 'post'
		};
		
		jQuery.extend(this._cfg, cfg);
	};
	/**
	 * 跨域jQuery请求
	 */
	AbstractServiceLocator.prototype._xjQuery = function(url, method, param, callback){
		 var _args = arguments,
		 _frame = null,
         _jQuery = null,
         _this = this;
		 try{
			 _frame = frames[this._cfg.iframeName];
			 _jQuery = _frame.jQuery;
		 }catch(e){}
		 if(_jQuery){
			 var Aargs = jQuery.makeArray(_args);
			 Aargs.shift();
			 _jQuery[_args[0]].apply(_jQuery, Aargs);
		 }else{
			 if(!_frame){
				 jQuery('body').append('<iframe src="' + this._cfg.protocol + '://' + this._cfg.host + ':' + this._cfg.port +  this._cfg.proxy
						 + '" name="' + this._cfg.iframeName
						 + '" style="display:none"></iframe>');
			 }
	         setTimeout(function(){
	        	 _args.callee.apply(_this, _args);
	         },500);
		 }
	};
	
	/**
	 * 通信请求
	 * @param {String} url 相对于host，以/开头
	 * @param {String} method POST or GET
	 * @param {Object} param 参数
	 * @param {Object} callback 回调对象。包含callback.success 和 callback.failure 两个函数
	 */
	AbstractServiceLocator.prototype.req = function(url, method, param, callback){
		if(this._cfg.crossdomain){
			this._xjQuery('ajax',{
				url : url,
				type : method,
				data : param,
				cache : false,
				dataType : 'json',
				success : function(data,textStatus){
					if(data){
						successHandler(callback, data);
					}else{
						failureHandler(callback, MSG.SERVER_ERROR);
					}
				},
				error : function (XMLHttpRequest, textStatus, errorThrown) {
					failureHandler(callback, MSG.SERVER_ERROR + '[' + textStatus + ']');
				}
			});
		}else{
			jQuery.ajax({
				url : url,
				type : method,
				data : param,
				cache : false,
				dataType : 'json',
				success : function(data,textStatus){
					if(data){
						successHandler(callback, data);
					}else{
						failureHandler(callback, MSG.SERVER_ERROR);
					}
				},
				error : function (XMLHttpRequest, textStatus, errorThrown) {
					failureHandler(callback, MSG.SERVER_ERROR + '[' + textStatus + ']');
				}
			});
		}
	};
	/**
	 * 成功返回数据调用
	 */
	var successHandler = function(callback, p){
		if(callback && callback.success && callback.success instanceof Function){
			callback.success.call(callback, p);
		}
	};
	/**
	 * 失败调用
	 */
	var failureHandler = function(callback, p){
		if(callback && callback.failure && callback.failure instanceof Function){
			callback.failure.call(callback, p);
		}
	};
	
	
	/**
	 * 适配器，封装了部分全局调用
	 */
	var adapter = (function(){
		
		return{
			/**
			 * 当前登录用户ID
			 */
			getUserId : function(){
				return __global.getPartCookie('user', 'id');
			},
			
			/**
			 * 当前登录用户名称
			 */
			getUserName : function(){
				return __global.getUserName();
			},
			
			/**
			 * 当前登录用户KEY
			 */
			getUserKey : function(){
				return __global.getPartCookie('temp', 'k');
			},
			
			/**
			 * 当前登录用户是否在线
			 */
			isOnline : function(){
				return __global.isOnline();
			},
			
			/**
			 * 弹出用户登录界面
			 */
			login : function(url){
				TY.loginAction('用户登录', url || window.location.href);
			}
		};
	})();
	
	/**
	 * 工具类
	 */
	var util = (function(){
		var _number_format = /^(0|[1-9]\d*)$|^(0|[1-9]\d*)\.(\d+)$/;
		
		return{
			
			/**
			 * 正则表达式填充数据
			 */
			regExpFillData : function(src, obj){
				var rt = src;
				if(src && obj){
					for(var prop in obj){
						var reg = new RegExp('#' + prop + '#', 'g');
						rt = rt.replace(reg, obj[prop]);
					}
				}
				return rt;
			},
			
			/**
			 * 对象序列化成JSON字符串
			 */
			serialize : function(obj){
			    switch(obj.constructor){
			        case Object:
			            var str = "{";
			            for(var o in obj){
			                str += "\"" + o + "\":" + this.serialize(obj[o]) +",";
			            }
			            if(str.substr(str.length-1) == ",")
			                str = str.substr(0,str.length -1);
			            return str + "}";
			            break;
			        case Array:            
			        	var str = "[", len = obj.length, tmp;
			            for(var i = 0; i < len; i++){
			            	tmp = obj[i];
			            	str += this.serialize(tmp) +",";
			            }
			            if(str.substr(str.length-1) == ",")
			                str = str.substr(0,str.length -1);
			            return str + "]";
			            break;
			        case Boolean:
			            return "\"" + obj.toString() + "\"";
			            break;
			        case Date:
			            return "\"" + obj.toString() + "\"";
			            break;
			        case Function:
			            break;
			        case Number:
			            return "\"" + obj.toString() + "\"";
			            break; 
			        case String:
			        	//bug修复，英文双引号，反斜杠问题
			            //return "\"" + obj.toString() + "\"";
			        	return "\"" + obj.toString().replace(/\\/g,'\\\\').replace(/"/g,'\\"') + "\"";
			            break;    
			    }
			},
			
			/**
			 * 计算字符串的长度，包括非ASCII字符
			 * @param {String} str 原始字符串
			 */
			strlen : function(str){
				if(!str){
					return 0;
				}
				var len = 0;  
			    for (var i = 0; i < str.length; i++) {  
			        if (str.charCodeAt(i) > 255) len += 2; else len ++;  
			    }  
			    return len;
			},
			
			isNull : function(/*String*/v){
				var rt = true;
				if(v){
					v = jQuery.trim(v);
					if(v.length > 0){
						rt = false;
					}
				}
				return rt;
			},
			
			isNaN : function(/*Number|String*/v){
				var rt = true;
				if(this.isNull(v) == false){
					if(_number_format.test(v)){
						rt = false;
					}
				}
				return rt;
			},
			
			heightChange : function(){
				if(top != window){
					var t = 0;
					if(jQuery.browser.safari){
						t = document.body.offsetHeight;
					}else{
						t = document.body.scrollHeight;
					}
					var h = t + 15;//调整15个间距差
					var url = location.href;
					var ifr = jQuery('iframe[src=' + url+ ']',jQuery(parent.document));
					
					//双保险设置高度
					ifr.height(h);
					ifr.css('height',h);
					
				}else{
					//非嵌入页啥都不做哈
				}
			},
			
			/**
			 * 截取定长字符串，加上...
			 * @param {String} str
			 * @param {Number} len 英文字符长度
			 */
			substr : function(str, len){
				var str_length = 0; 
				var str_len = 0; 
				str_cut = ''; 
				str_len = str.length; 
				for(var i = 0; i < str_len; i++) { 
				    a = str.charAt(i); 
				    str_length++; 
				    if(escape(a).length > 4){ 
				        str_length++; 
				    } 
				    str_cut = str_cut.concat(a); 
				    if(str_length>=len){ 
				        str_cut = str_cut.concat("..."); 
				        return str_cut; 
				    } 
				} 
				if(str_length < len){ 
				    return  str; 
				} 
			}
		
		};
	})();
	
	/**
	 * 环境类
	 */
	var vdir = document.scripts;
	vdir = vdir[vdir.length - 1].src.substring(0, vdir[vdir.length - 1].src.lastIndexOf('/js/'));
	var env = (function(){
		
		return{
			STATIC_URL		:	vdir,
			PARAM			:	getArgs()
		};
	})();
	
	
	var _fpr = null;
	
	/**
	 * ======================================================================================
	 * 微博接口调用类
	 * ======================================================================================
	 */
	var TWServiceLocator = function(cfg){
		TWServiceLocator.superclass.constructor.call(this, cfg);
	};
	extend(TWServiceLocator, AbstractServiceLocator);
	
	_fpr = TWServiceLocator.prototype;
	
	/**
	 * 发微博, 纯文本内容
	 * 参数
	 * {
	 * 		content	:	文本内容
	 * }
	 */
	_fpr.send = function(param, callback){
		var p = {};
		p['params.appId'] = 'twitter';
		p['params.sourceName'] = '天涯微博';
		p['params.title'] = param.content;
		if(param.image){
			p['params.image'] = param.image;
		}
		
		var _callback = {
				success	:	function(d){
					if(d && d.success == 1){
						callback.success( d.data );
					}else{
						callback.failure( d.message );
					}
				},
				failure	:	function(e){
					callback.failure(e);
				}
		};
		this.req('/api/tw?method=tweet.ice.insert', this.METHOD.POST, p, _callback);
	};
	
	/**
	 * 关注某人
	 * 参数
	 * {
	 * 		userId	:	被关注者ID
	 * }
	 */
	_fpr.follow = function(param, callback){
		var p = {};
		p['params.followingUserId'] = param.userId;
		
		var _callback = {
				success	:	function(d){
					if(d && d.success == 1){
						callback.success( d.data );
					}else{
						callback.failure( d.message );
					}
				},
				failure	:	function(e){
					callback.failure(e);
				}
		};
		this.req('/api/tw?method=following.ice.insert', this.METHOD.POST, p, _callback);
	};
	
	/**
	 * 取消关注某人
	 */
	_fpr.cancelFollow = function(param, callback){
		var p = {};
		p['params.followingUserId'] = param.userId;
		
		var _callback = {
				success	:	function(d){
					if(d && d.success == 1){
						callback.success( d.data );
					}else{
						callback.failure( d.message );
					}
				},
				failure	:	function(e){
					callback.failure(e);
				}
		};
		this.req('/api/tw?method=following.ice.delete', this.METHOD.POST, p, _callback);
	};
	
	_fpr = null;
	
	/**
	 * ======================================================================================
	 * 企业空间接口调用类
	 * ======================================================================================
	 */
	var SpaceServiceLocator = function(cfg){
		SpaceServiceLocator.superclass.constructor.call(this, cfg);
	};
	extend(SpaceServiceLocator, AbstractServiceLocator);
	
	_fpr = SpaceServiceLocator.prototype;
	
	/**
	 * 获取空间信息接口
	 * 参数
	 * {
	 * 		aui	:	空间管理员ID
	 * }
	 */
	_fpr.zoneInfo = function(param, callback){
		this.req('/search/getZoneInfo', this.METHOD.GET, param, callback);
	};
	
	_fpr = null;
	
	/**
	 * ======================================================================================
	 * 微博接口调用类
	 * ======================================================================================
	 */
	var LocalServiceLocator = function(cfg){
		LocalServiceLocator.superclass.constructor.call(this, cfg);
	};
	extend(LocalServiceLocator, AbstractServiceLocator);
	
	_fpr = LocalServiceLocator.prototype;
	
	//抓起商品
	_fpr.fetch = function(param, callback){
		this.req('/item/fetchInfo', this.METHOD.GET, param, callback);
	};
	
	//保存商品
	_fpr.create = function(param, callback){
		this.req('/item/share', this.METHOD.POST, param, callback);
	};
	
	//删除商品
	_fpr.remove = function(param, callback){
		this.req('/item/stopProduct', this.METHOD.POST, param, callback);
	};
	
	//喜欢商品
	_fpr.like = function(param, callback){
		this.req('/web/like', this.METHOD.GET, param, callback);
	};

	//喜欢商品数和评论商品数
	_fpr.productInf = function(param, callback){
		this.req('/item/productInf', this.METHOD.GET, param, callback);
	};
	
	//评论商品
	_fpr.review = function(param, callback){
		this.req('/web/comment', this.METHOD.GET, param, callback);
	};

	//搜索商品
	_fpr.search = function(param, callback){
		this.req('/web/search', this.METHOD.GET, param, callback);
	};
	
	//用户喜欢的商品列表
	_fpr.userLike = function(param, callback){
		this.req('/web/uLike', this.METHOD.GET, param, callback);
	};
	
	//用户分享的商品列表
	_fpr.userShare = function(param, callback){
		this.req('/web/uShare', this.METHOD.GET, param, callback);
	};
	
	//发布专辑
	_fpr.createSpecial = function(param, callback){
		this.req('/special/publish', this.METHOD.POST, param, callback);
	};
	
	//获取专辑
	_fpr.getSpecial = function(param, callback){
		this.req('/special/show', this.METHOD.GET, param, callback);
	};
	
	//修改专辑
	_fpr.updateSpecial = function(param, callback){
		this.req('/special/edit', this.METHOD.POST, param, callback);
	};
	
	//删除专辑
	_fpr.deleteSpecial = function(param, callback){
		this.req('/special/updateNotPass', this.METHOD.POST, param, callback);
	};
	
	//单个专辑商品列表
	_fpr.specialProductList = function(param, callback){
		this.req('/web/special', this.METHOD.GET, param, callback);
	};
	
	//购买数+1
	_fpr.increaseBuyNum = function(param, callback){
		this.req('/item/buyProduct', this.METHOD.POST, param, callback);
	};
	
	//是否鉴定过
	_fpr.ifIdentified = function(param, callback){
		this.req('/item/ifIdentified', this.METHOD.GET, param, callback);
	};
	
	//获取空间用户信息
	_fpr.getZoneInfo = function(param, callback){
		this.req('/api/zone/getZoneInfoById', this.METHOD.GET, param, callback);
	};
	
	//求鉴定商品
	_fpr.identifyProduct = function(param, callback){
		this.req('/item/identifyProduct', this.METHOD.GET, param, callback);
	};
	
	//求鉴定商品
	_fpr.addProdToSpecial = function(param, callback){
		this.req('/special/addProdToSpecial', this.METHOD.POST, param, callback);
	};
	
	//用户专辑列表
	_fpr.userSpecialList = function(param, callback){
		this.req('/special/getMySpecialList', this.METHOD.GET, param, callback);
	};
	
	
	_fpr = null;

	//exports
	exports.comp					=	{};//组件命名空间
	exports.fn						=	{};//函数命名空间
	exports.cache					=	{};//缓存对象命名空间
	exports.extend 					=	extend;
	exports.getArgs 				=	getArgs;
	exports.CObject 				=	CObject;
	exports.AbstractServiceLocator	=	AbstractServiceLocator;
	exports.adapter					=	adapter;
	exports.util					=	util;
	exports.env						=	env;
	exports.service			=	new LocalServiceLocator({
		crossdomain	:	true,
		host		:	'mall.tianya.cn',
		proxy		:	'/proxy.html'
	});
	exports.twService		=	new TWServiceLocator({
		crossdomain	:	true,
		host		:	'www.tianya.cn',
		proxy		:	'/proxy.html'
	});
	exports.spaceService	=	new SpaceServiceLocator({
		crossdomain	:	true,
		host		:	'page.tianya.cn',
		proxy		:	'/html/space-proxy.html'
	});
	
	
	jQuery(document).ready(function(){
		TY.loader('TY.util.placeholder',function(){
			jQuery.Placeholder.init();
		})
	});
	
})(_mall);
