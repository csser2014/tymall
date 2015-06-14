/**
 * 二级分类页面脚本文件
 */
(function(exports, win){
	
	//瀑布流列对象
	var columnNodes = jQuery('._col0, ._col1, ._col2, ._col3'), 
	href = win.location.href, 
	argsRE = /\/(\d+)\-(\d+)\-(\d+)\-(\d+)\-(\d+)/;
	tmpArgs = null,
	loadingBox = null,
	currArgs = {};
	
	function showLoadingBox(){
		if(loadingBox){
			loadingBox.show();
			return;
		}
		
		loadingBox = jQuery('<div class="clearfix" style="background-color:#ccc; padding:5px; text-align:center;margin:5px 20px;">正在努力加载中……</div>');
		jQuery('#category_page').append( loadingBox );
	};
	
	function hideLoadingBox(){
		loadingBox.hide();
	};
	
	//解析当前参数
	tmpArgs = href.match(argsRE);
	if(tmpArgs){
		currArgs['c1id'] = tmpArgs[1];
		currArgs['c2id'] = tmpArgs[2];
		currArgs['px']	 = tmpArgs[3];
		currArgs['ud'] 	 = tmpArgs[4];
		currArgs['page'] = tmpArgs[5];
	}else{
		try {
			currArgs['c1id'] = scriptArgs.c1id;//borrow
			currArgs['c2id'] = scriptArgs.c2id;//borrow
			currArgs['px']	 = scriptArgs.px;//borrow
			currArgs['ud'] 	 = scriptArgs.ud;//borrow
			currArgs['page'] = scriptArgs.page;//borrow
		} catch (e) {
			currArgs['c1id'] = 0;
			currArgs['c2id'] = 0;
			currArgs['px']	 = 0;
			currArgs['ud'] 	 = 0;
			currArgs['page'] = 0;
		}
	}
	
	exports.fn.proc$Sec1Data( columnNodes );
	
	var wall = new exports.comp.GridWall({
		columnNodes		:	columnNodes,
		scroll			:	true,
		debug			:	false,
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
			
			var defArgs = {
				sec	:	n + 1,
				tn	:	exports.env.PARAM['tn'] ? exports.env.PARAM['tn'] : ''
			},
			p = jQuery.extend({}, currArgs, defArgs )
			
			var cb = {
				success	:	function(e){
					var tmp, data = [];
					if(e.result == 1 && e.data.data.length > 0){
						data = e.data.data;
						sault.launch( data );
					}else{
						sault.noDataYet();
					}
					hideLoadingBox();
				},
				failure	:	function(e){
					sault.noDataYet();
					hideLoadingBox();
				}
			};
			exports.service.search(p, cb);
			showLoadingBox();
		},
		
		completeHandler	:	function(){
			jQuery('.pager').show();
		}
	});
	
})(_mall, window);