(function(exports, $){
	
	var CONST = {
			TEMPLATE	:	[
				'<div class="f-file-upload">',
					'<form>',
						'<span class="f-replacebtn">浏&nbsp;&nbsp;览</span>',
						'<input type="file" class="f-file-field" name="doc"/>',
						'<div class="f-waiting"></div>',
					'</form>',
				'</div>'
			],
			
			EMBED_IFRAME : '<iframe style="display: none;" name="album_iframe_upload" src="http://photo.tianya.cn/loaddata.html"></iframe>'
	},
	_TUI_upload = function(){
		var _args = arguments, _TUI = null;
		try {
			_TUI = frames['album_iframe_upload'] && frames['album_iframe_upload'].TUI;
			if(_TUI){
				_TUI.ioUpload.apply(_TUI,_args);
			}else{
				throw new Error('无法加载TUI');
			}
		} catch (e) {
			var t = new Error('服务器忙，请稍候再试[' + e.message + ']');
			throw e;
		}
	};
	
	var FileUpload = function(args){
		var defArgs = {
				el			:	null,//用于替换的节点
				fileType	:	'.gif,.jpg,.png,.jpeg',//文件类型，用逗号分隔
				param		:	{},//额外参数
				app			:	'qyzone',//应用方
				handler		:	function(rt){}//上传成功与否的回调 rt.result, rt.param, rt.data
		};
		this.cfg = $.extend(true, {}, defArgs, args);
		this.init();
	};
	
	$.extend(FileUpload.prototype, {
		
		init	:	function(){
			var t = this;
			t.createNode();
			t.bind();
		},
		
		createNode	:	function(){
			var t = this, tmpNode, tmpHTML = CONST.TEMPLATE.join('');
			
			tmpNode = $(tmpHTML);
			$(t.cfg.el).replaceWith( tmpNode );
			t.node = tmpNode;
		},
		
		bind	:	function(){
			var t = this, fileType = t.cfg.fileType,
			fileTypeReg = new RegExp('\\S+(' + fileType.split(',').join('|') + ')$', 'i');
			$(':file', t.node).change(function(){
				var file = jQuery(this);
				if( !fileTypeReg.test( file.val() ) ){
					file.val('');
					alert('只允许上传[' + fileType + ']类型的文件');
					return;
				}
				
				t.upload();
			});
		},
		
		upload	:	function(){
			var t = this,
			cfg = {
					form	:	{
						id		:	$('form', t.node).get(0),
						upload	:	true
					}
			},
			handler	= function(rt){
				if(t.cfg.handler && t.cfg.handler instanceof Function){
					rt.param = t.cfg.param;
					t.cfg.handler(rt);
				}
			};
			
			try {
				
				t.waiting();
				
				_TUI_upload('http://photo.tianya.cn/photo?act=uploadphoto&watermark=0&app=' + t.cfg.app,
						function(resp){
					if(resp && resp.result == 1){
						handler({
							result	:	1,
							data	:	resp.data
						});
					}else{
						handler({
							result	:	0,
							message	:	resp.error
						});
					}
					
					t.reset();
					
				}, cfg);
			} catch (e) {
				t.reset();
				handler({
					result	:	0,
					message	:	e.message
				});
			}
			
		},
		
		reset	:	function(){
			var t = this;
			$('.f-waiting', t.node).hide();
		},
		
		waiting	:	function(){
			var t = this;
			$('.f-waiting', t.node).show();
		}
		
	});
	
	//export
	exports.FileUpload = FileUpload;
	$(document).ready(function(){
		$(document.body).append( CONST.EMBED_IFRAME );
	});
})(_mall.comp, jQuery);