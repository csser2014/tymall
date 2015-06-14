/**
 * 适用于首页和促销优惠页面特定结构的滚动轮播图
 */
(function(exports){
	
	var SpecialSlide = function(args){
		var defArgs = {
				root		:	'',//根
				speed		:	200,//移动速度,
				interval	:	3000//轮播速度
		};
		this.cfg = jQuery.extend({}, defArgs, args);
		this.init();
	};
	
	jQuery.extend(SpecialSlide.prototype, {
		
		init	:	function(){
			var t = this;
			
			t.root	=	jQuery(t.cfg.root);
			t.ul	=	jQuery('.slide-view ul', t.root);
			t.prev	=	jQuery('.slide-prev-next .prev-btn', t.root);
			t.next	=	jQuery('.slide-prev-next .next-btn', t.root);
			
			t.circles	=	 jQuery('.slide-control a', t.root);
			t.currIndex	=	0;
			t.nextIndex	=	1;
			t.number	=	jQuery('li', t.ul).length;
			t.gap		=	jQuery('li', t.ul).eq(0).width();
			t.length	=	t.gap * t.number;
			
			t.intervalID	=	-1;
			
			t.bind();
			t.start();
		},
		
		bind	:	function(){
			var t = this;
			
			t.prev.attr('href', 'javascript:void(0);').click(function(){
				t.prevOp();
				return false;
			});
			
			t.next.attr('href', 'javascript:void(0);').click(function(){
				t.nextOp();
				return false;
			});
			
			t.root.mouseover(function(){
				t.stop();
			});
			
			t.root.mouseout(function(){
				t.start();
			});
		},
		
		prevOp	:	function(){
			var t = this;
			if(t.currIndex == 0){
				t.nextIndex = (t.number - 1);
			}else{
				t.nextIndex = t.currIndex - 1;
			}
			t.move();
		},
		
		nextOp	:	function(){
			var t = this;
			if(t.currIndex == (t.number - 1) ){
				t.nextIndex = 0;
			}else{
				t.nextIndex = t.currIndex + 1;
			}
			t.move();
		},
		
		move	:	function(){
			var t = this, tmp;
			jQuery(t.ul).animate({
				marginLeft	:	(-1) * t.gap * t.nextIndex
			}, t.cfg.speed, 'linear', function(){
				t.currIndex = t.nextIndex;
				t.active();
			});
		},
		
		active	:	function(){
			var t = this;
			t.circles.removeClass('active');
			t.circles.eq(t.currIndex).addClass('active');
		},
		
		start	:	function(){
			var t = this;
			t.intervalID = setInterval(function(){
				t.nextOp();
			}, t.cfg.interval);
		},
		
		stop	:	function(){
			var t = this;
			clearInterval( t.intervalID );
		}
	});
	
	exports.SpecialSlide = SpecialSlide;
})(_mall.comp);
