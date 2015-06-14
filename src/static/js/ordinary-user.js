(function(exports){
	
	var _fpr = null, ice = null;

	var LocalServiceLocator = function(cfg){
		LocalServiceLocator.superclass.constructor.call(this, cfg);
	};
	 exports.extend(LocalServiceLocator, exports.AbstractServiceLocator);
	
	_fpr = LocalServiceLocator.prototype;
	
	_fpr.getProducts = function(param, callback){
		this.req('/v/search/getProducts', this.METHOD.GET, param, callback);
	};
	
	_fpr = null;
	
	ice = new LocalServiceLocator({
		crossdomain	:	true,
		host		:	'page.tianya.cn',
		proxy		:	'/html/space-proxy.html'
	});


	var wall = new exports.comp.GridWall({
		columnNodes		:	jQuery('._col0, ._col1, ._col2'),
		scroll			:	true,
		debug			:	true,
		gridHandler		:	function(d){
			var rt = {}, data = d.entity;
			rt = exports.fn.createBox( data );
			return rt;
		},
		requestHandler	:	function(sault, n){
			
			if(n > 4){
				sault.noDataYet();
				return;
			}
			
			var p = {
				zoneId:6153,
				price1:1,
				//pno:1,
				pno:n,
				s:30,
				o:2,
				u:'down'	
			};
			var cb = {
				success	:	function(e){
					var tmp, data = [];
					
					for(var i = 0; i < e.length; i++){
						tmp = e[i];
						data.push({
							productId		:	'123',
							picUrlCover		:	tmp.picUrl,
							title			:	tmp.name,
							detailURL		:	'item/123',
							price			:	tmp.vipPrice,
							comUserId		:	tmp.adminId,
							comUserName		:	tmp.adminName,
							likeNum			:	tmp.viewNum,
							commentNum		:	100000,
							lastComment		:	tmp.summary
						});
					}
					sault.launch( data );
				},
				failure	:	function(e){
				}
			};
			ice.getProducts(p, cb);
		},
		
		completeHandler	:	function(){
			console.log('complete');
		}
	});
	
})(_mall);