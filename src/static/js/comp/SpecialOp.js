/**
 * 专辑的创建、修改、删除
 * 
 */
(function(exports){
	TY.loader('TY.ui.pop');
	
	var POP_SUCCESS_MSG = {
		CREATE : '添加专辑成功！',
		DELETE : '删除专辑成功！',
		EDIT   : '修改专辑成功！'
	}; //返回成功信息的各个操作提示

	var MSG = {
		OP_LOADING : '数据处理中...'
	};

	var POP_CREATE_ERROR = {
		NAME        : '专辑名不能为空',
		DESCRIPTION : '专辑描述不能为空'
	}; //创建专辑，填写表单的出错信息

	var _fpr = null,
	template = {
		CREATE_OR_EDIT : [
			'<div class="fele form-horizontal pop-shopping" id="pop_create_album">',
				'<div class="form-item form-required">',
					'<label for="album_name"><i class="icon-required">*</i>专辑名：</label>',
					'<div class="form-field"><input type="text" class="form-text" id="album_name"></div>',
				'</div>',
				'<div class="form-item form-required">',
					'<label for="album_des"><i class="icon-required">*</i>描述：</label>',
					'<div class="form-field"><textarea id="album_des"></textarea></div>',
				'</div>',
				'<p class="form-error none">填写错误！</p>',
				'<div class="form-action"><a class="btn p-bluebtn" href="javascript:void(0);">确定</a></div>',
			'</div>'
		]
	}; //创建或者编辑专辑的模板
	
	var SpecialOp = function(args){
		var defArgs = {
			type            : 'create', //参数列表 : create, edit, delete
			specialId       : '' ,    //专辑的Id
			zoneUrl      	: '',
			completeHandler : function(){
			}
		};
		this.proc = false;
		this.pop = null;
		this.cfg = jQuery.extend({}, defArgs, args);
		this.init();
	};
	
	jQuery.extend(SpecialOp.prototype, {
		init	:	function(){
			var t = this;
			if(t.cfg.type == 'create'){
				t.createOp();
			}else if(t.cfg.type == 'edit'){
				t.editOp();
			}else if(t.cfg.type == 'delete'){
				t.deleteOp();
			}else{
				throw new Error('类型参数错误');
			}
		},
		
		checkLogin : function(){
			var online = exports.adapter.isOnline();
			if(!online){
				exports.adapter.login();
			}
			return online;
		},

		checkSpecialValue : function(albumName, albumDes){
			if (jQuery.trim(albumName) === ''){
				jQuery('#pop_create_album .form-error').show().html(POP_CREATE_ERROR.NAME);
				return false;
			}
			else if (jQuery.trim(albumDes) === ''){
				jQuery('#pop_create_album .form-error').show().html(POP_CREATE_ERROR.DESCRIPTION);
				return false;
			}
			return true;
		}, //验证专辑名和专辑描述是否为空
		
		/**
		 * 创建专辑操作
		 */
		createOp	:	function(){
			var t = this;
			var content = template.CREATE_OR_EDIT.join('');
			t.pop = new TY.ui.pop({
				headTxt      :  '创建专辑',
				body         :  content,
				isShowButton :  false,
				render       : function(){
					jQuery('#pop_create_album .btn').bind('click', function(){
						var albumName = jQuery('#album_name').val();   //专辑名
						var albumDes  = jQuery('#album_des').val();     //描述
						if (t.checkSpecialValue(albumName, albumDes)) {
							if (!t.proc){
								t.proc = true;
								jQuery('#pop_create_album .form-error').show().html(MSG.OP_LOADING);
								var p = {
									name        : albumName,
									description : albumDes
								},
								callback = {
									success	:	function(resp){
										if (resp.result === 1){
											t.simplePop(POP_SUCCESS_MSG.CREATE, 'create', resp.data);
											t.proc = false;
											
											t.opCompleteHandler();
										}else{
											jQuery('#pop_create_album .form-error').show().html(resp.message);
											t.proc = false;
										}
									},
									failure	:	function(e){
										jQuery('#pop_create_album .form-error').show().html(e);
										t.proc = false;
									}
								};
								exports.service.createSpecial(p, callback);
							}
						}
						return false;
					});
				}
			});
		},
		
		/**
		 * 编辑专辑操作
		 */
		editOp	:	function(){
			var t = this;
			var p = {
				specialId : t.cfg.specialId
			};
			var callback = {
				success : function(resp){
					if (resp.result === 1){
						content = template.CREATE_OR_EDIT.join('');
						t.pop = new TY.ui.pop({
							headTxt      : '编辑专辑',
							body         : content,
							isShowButton : false,
							render       : function(){
								jQuery('#album_name').val(resp.data.name);           //专辑名
								jQuery('#album_des').val(resp.data.description);     //描述
							}
						});
						jQuery('#pop_create_album .btn').bind('click', function(){
							var albumName = jQuery('#album_name').val(), albumDes = jQuery('#album_des').val();
							if (t.checkSpecialValue(albumName, albumDes)){
								t.updateOp(albumName, albumDes, resp.data.picUrlCover ? resp.data.picUrlCover : undefined);
							}
						});
					}else{
						t.simplePop(resp.message);
					}
				},
				failure : function(e){
					t.simplePop(e);
				}
			};
			exports.service.getSpecial(p, callback);
		},

		/**
		 * 更新专辑操作
		 */
		updateOp:function(albumName, albumDes, picUrlCover) {
			var t = this;
			if (!t.proc){
				t.proc = true;
				jQuery('#pop_create_album .form-error').show().html(MSG.OP_LOADING);
				var p = {
					specialId   : t.cfg.specialId,
					name        : albumName,
					description : albumDes,
					picUrlCover : picUrlCover
				},
				callback = {
					success	: function(resp){
						if (resp.result === 1){
							t.simplePop(POP_SUCCESS_MSG.EDIT);
							t.proc = false;
							
							t.opCompleteHandler();
						}else{
							jQuery('#pop_create_album .form-error').show().html(resp.message);
							t.proc = false;
						}
					},
					failure : function(e){
						jQuery('#pop_create_album .form-error').show().html(e);
						t.proc = false;
					}
				};
				exports.service.updateSpecial(p, callback);
			}
		},
		
		/**
		 * 删除专辑操作
		 */
		deleteOp	:	function(){
			var t = this;
			if(confirm("是否删除专辑[" + t.cfg.specialName + "]?")){
				var p = {
					specialId : t.cfg.specialId
				};
				var callback = {
					success : function(resp){
						if (resp.result === 1){
							t.simplePop(POP_SUCCESS_MSG.DELETE);
							
							t.opCompleteHandler();
						}else{
							t.simplePop(resp.message);
						}
					},
					failure : function(e){
						t.simplePop(e);
					}
				};
				exports.service.deleteSpecial(p, callback);
			}
			return false;
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
		
		simplePop	:	function(content, flag, data){
			var t = this;
			t.removePop();
			
			t.pop = new TY.ui.pop({
				headTxt	:	'提示',
				body	:	content,
				isShowButton	:	true,
				render  : function(){
					jQuery('.yes').bind('click', function(){
						if (flag == 'create'){
							var url = zoneUrl + '/share/special/' + data + '.html';
							window.open(url, 'newwindow');
						}
					});
				}
			});
		}
		
	});
	
	exports.comp.SpecialOp = SpecialOp;
})(_mall);
