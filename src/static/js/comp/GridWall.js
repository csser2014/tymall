/**
 * 网格或瀑布流模块
 */
(function(exports){
	var _fpr = null;
	
	/**
	 * 瀑布流列 类
	 * @param {Object} p 参数
	 * {
	 * 		id			:	列标识[可选]
	 * 		className	:	列使用的class名称[可选]
	 * 		node		:	列节点
	 * }
	 */
	var Column = function(p){
		this.dom = null;
		this.grids = [];
		this.cfg = jQuery.extend({}, {
			id			:	'column_' + new Date().getTime(),
			className	:	'',
			node		:	null
		}, p);
		this.currHeight = 0;
		
		
		this.init();
	};
	_fpr = Column.prototype;
	
	_fpr.init = function(){
		var t = this;
		t.dom = jQuery( t.cfg.node );
		if(t.cfg.className){
			t.dom.addClass( t.cfg.className );
		}
	};
	
	/**
	 * 获得列大约高度
	 * @public
	 */
	_fpr.getApproximateHeight = function(){
		var t = this;
		return t.currHeight;
	};
	
	/**
	 * 增加格子
	 * @public
	 * @param {jQuery} node jQuery对象节点
	 */
	_fpr.putGrid = function(node){
		var t = this;
		t.grids.push( node );
		t.dom.append( node );
		
		t.currHeight = t.dom.height();
	};
	
	_fpr = null;
	
	
	/**
	 * 瀑布流类
	 * 注意，public的方法才能给外部使用
	 */
	var GridWall = function(args){
		
		var defArgs = {
				id					:	'sault_' + new Date().getTime(),
				columnNodes			:	[],//列节点
				columnClassNames	:	[],//列节点额外类名
				scroll				:	true,//是否滚动加载数据
				debug				:	false,//是否调试数据
				gridHandler			:	function(d){return jQuery('<div>Your Data</div>');},//构造数据块回调函数
				requestTimesLimit	:	10,//请求次数限制
				requestHandler		:	function(gridWall, n){},//请求数据回调函数，参数为GridWall对象和 请求次数
				completeHandler		:	function(){}//全部加载完成后回调
		};
		
		this.cfg = jQuery.extend({}, defArgs, args);
		
		//列数组
		this.columns = [];
		//数据
		this.data = [];
		//图片加载后保存的数据
		this.imageLoaded = [];
		//图片加载个数
		this.imageLoadLength = 0;
		//图片总数
		this.imageTotalLength = 0;
		//Grid插入索引
		this.insertIndex = -1;
		//可视窗口高度
		this.clientHeight = 0;
		//瀑布流最大高度
		this.maxHeight = 0;
		//当前偏移量(clientHeight + scrollTop)
		this.offsetHeight = 0;
		//处理数据是否完成
		this.drawCompleted = true;
		//数据是否请求完成
		this.requestCompleted = true;
		//当前请求次数
		this.requestTimes = 0;
		//加载提示框
		this.requestBox = null;
		//是否还有数据
		this.stillHaveData = true;
		
		
		this.init();
	};
	_fpr = GridWall.prototype;
	
	_fpr.init = function(){
		var t = this, cfg = t.cfg, col, colLen = cfg.columnNodes.length;

		for(var i = 0; i < colLen; i++){
			var col = new Column({
				className	:	cfg.columnClassNames[i] ? cfg.columnClassNames[i] : '',
				node		:	cfg.columnNodes[i]
			});
			t.putColumn( col );
		}
		
		t.constructRequestBox();
		t.calcHeight();
		t.scroll();
		t.nextRequest();
	};
	
	_fpr.putColumn = function(col){
		var t = this;
		t.columns.push( col );
	};
	
	/**
	 * 构造加载提示框
	 */
	_fpr.constructRequestBox = function(){
		var t = this, tmp;
		tmp = jQuery('<div style="clear:both; border:1px solid #333; display:none; padding:5px; background-color:#ccc; text-align:center;">数据加载中...</div>');
		
		t.requestBox = tmp;
	};
	
	/**
	 * 计算高度
	 */
	_fpr.calcHeight = function(){
		var t = this;
		setTimeout(function(){
			t.clientHeight = document.documentElement.clientHeight || document.body.clientHeight || 0;
			t.maxHeight = t.getMaxHeightColumn().getApproximateHeight();
			t.offsetHeight = t.clientHeight + (document.documentElement.scrollTop || document.body.scrollTop );
		}, 0);

	};
	
	/**
	 * 滚动绑定
	 */
	_fpr.scroll = function(){
		var t = this;
		
		if(!t.cfg.scroll){
			return;
		}
		
		jQuery(window).bind('scroll',function(){
			t.calcHeight();
			if(t.offsetHeight > ( t.maxHeight - 200)
					&& t.drawCompleted == true
					&& t.requestCompleted == true
					&& t.stillHaveData == true
					&& (t.requestTimes < t.cfg.requestTimesLimit) ){
				t.nextRequest();
			}
			
		});
	};
	
	/**
	 * debug日志输出
	 */
	_fpr.log = function(msg){
		var t = this;
		if(t.cfg.debug && window.console && window.console.log){
			window.console.log(msg);
		}
	};
	
	/**
	 * 下一次请求
	 */
	_fpr.nextRequest = function(){
		var t = this;
		
		if(t.cfg.requestHandler){
			t.requestTimes++;
			
			t.requestBox.show();
			t.log('第' + t.requestTimes + '次加载数据 开始');
			t.cfg.requestHandler.call(null, t, t.requestTimes);
			t.requestCompleted = false;
		}

	};
	
	/**
	 * 处理图片加载
	 */
	_fpr.procImage = function(){
		var t = this, dLen = t.data.length, tmp;
		
		t.drawCompleted = false;
		t.imageTotalLength += dLen;
		
		for(var i = 0; i < dLen; i++){
			tmp = t.data[i];
			t.preLoadImage(i, tmp.picURL, dLen);
		}
	};
	
	/**
	 * 加载图片
	 * @param {Number} index 	数据索引
	 * @param {String} url 		图片地址
	 * @param {String} currLen	数据长度
	 */
	_fpr.preLoadImage = function(index, url, currLen){
		var t = this, cfg = t.cfg;
		
		var handler = function(){
			t.imageLoadLength++;

			if(t.imageLoaded.length == cfg.columnNodes.length){
				t.imageLoaded = [];
			}
			
			t.imageLoaded.push({
				index	:	index,
				entity	:	t.data[index]	
			});
			
			if(t.imageLoaded.length % cfg.columnNodes.length == 0 || t.imageLoadLength == currLen){
				t.procData();
			}
			
			if(t.imageTotalLength == t.imageLoadLength){
				t.drawCompleted = true;
				t.log('第' + t.requestTimes + '绘制页面完成');
			}
		};
		
		handler();
	};
	
	/**
	 * 处理数据，计算列高度，插入
	 */
	_fpr.procData = function(){
		var t = this, cfg = t.cfg, gridHandler = cfg.gridHandler,
		data = t.imageLoaded, dLen = data.length,
		tmpCol = null, tmpGrid = null;
		
		for(var i = 0; i < dLen; i++){
			t.insertIndex++;
			tmpCol = t.getTargetColumn();
			tmpGrid = gridHandler.call(null, data[i] );
			tmpCol.putGrid( tmpGrid );
		}
	};
	
	/**
	 * 获得目标列
	 */
	_fpr.getTargetColumn = function(){
		var t = this, cols = t.columns;
		
		return cols[t.insertIndex % cols.length];
	};
	
	/**
	 * 获得最大高度列
	 */
	_fpr.getMaxHeightColumn = function(){
		var t = this, cols = t.columns;
		cols.sort(function(col1, col2){
			if(col1.getApproximateHeight() < col2.getApproximateHeight()){
				return -1;
			}else if(col1.getApproximateHeight() > col2.getApproximateHeight()){
				return 1;
			}else{
				return 0;
			}
		});
		return cols[cols.length - 1];
	};
	
	/**
	 * 启动入口
	 * @public
	 * @param {Object} parr 数组数据
	 * [{
	 * 		picURL	:	图片URL地址
	 * 		entity	:	与图片相关的实际数据
	 * }]
	 */
	_fpr.launch = function(parr){
		var t = this;
		t.data = parr;
		t.log('第' + t.requestTimes + '次数据长度: ' + t.data.length);
		
		t.requestCompleted = true;
		t.requestBox.hide();
		t.log('第' + t.requestTimes + '次加载数据 完成');
		
		t.procImage();
	};
	
	/**
	 * 没有数据后，调用此方法
	 * @public
	 */
	_fpr.noDataYet = function(){
		var t = this;
		
		t.requestCompleted = true;
		t.stillHaveData = false;
		t.requestBox.hide();
		t.log('已经没有数据了');
		
		if(t.cfg.completeHandler){
			t.cfg.completeHandler();
		}
	};
	
	_fpr = null;
	
	exports.GridWall = GridWall;
})(_mall.comp);