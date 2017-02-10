//Tween算法
var Tween = {
	linear: function(t, b, c, d) {
		return c * t / d + b;
	},
	easeIn: function(t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOut: function(t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	easeBoth: function(t, b, c, d) {
		if((t /= d / 2) < 1) {
			return c / 2 * t * t + b;
		}
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	},
	easeOutStrong: function(t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d) {
		if((t /= d / 2) < 1) {
			return c / 2 * t * t * t * t + b;
		}
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p) {
		if(t === 0) {
			return b;
		}
		if((t /= d) == 1) {
			return b + c;
		}
		if(!p) {
			p = d * 0.3;
		}
		if(!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	elasticOut: function(t, b, c, d, a, p) {
		if(t === 0) {
			return b;
		}
		if((t /= d) == 1) {
			return b + c;
		}
		if(!p) {
			p = d * 0.3;
		}
		if(!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	elasticBoth: function(t, b, c, d, a, p) {
		if(t === 0) {
			return b;
		}
		if((t /= d / 2) == 2) {
			return b + c;
		}
		if(!p) {
			p = d * (0.3 * 1.5);
		}
		if(!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		if(t < 1) {
			return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
				Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		}
		return a * Math.pow(2, -10 * (t -= 1)) *
			Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
	},
	backIn: function(t, b, c, d, s) {
		if(typeof s == 'undefined') {
			s = 1.70158;
		}
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	backOut: function(t, b, c, d, s) {
		if(typeof s == 'undefined') {
			s = 2.70158; //回缩的距离
		}
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	backBoth: function(t, b, c, d, s) {
		if(typeof s == 'undefined') {
			s = 1.70158;
		}
		if((t /= d / 2) < 1) {
			return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		}
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d) {
		return c - Tween['bounceOut'](d - t, 0, c, d) + b;
	},
	bounceOut: function(t, b, c, d) {
		if((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if(t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
		} else if(t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
		}
		return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
	},
	bounceBoth: function(t, b, c, d) {
		if(t < d / 2) {
			return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
	}
};

//css读取和设置
function css(obj, attr, val) {
	if(/rotate|skew|scale|translate/.test(attr)) {
		return cssTransform(obj, attr, val);
	}
	if(typeof val === 'undefined') {
		var val = getComputedStyle(obj)[attr];
		if(attr == 'opacity') {
			val = Math.round(val * 100);
		}
		return parseFloat(val);
	} else {
		if(attr == 'opacity') {
			obj.style.opacity = val / 100;
		} else {
			obj.style[attr] = val + 'px';
		}
	}
}

//css读取设置(针对transform，已加入css函数中)
function cssTransform(obj, attr, val) {
	if(!obj.transform) {
		obj.transform = {};
	}
	if(typeof val === 'undefined') {
		if(typeof obj.transform[attr] === 'undefined') {
			switch(getTransformUnit(attr)) {
				case 'percent':
					obj.transform[attr] = 100;
					break;
				default:
					obj.transform[attr] = 0;
			}
		}
		return obj.transform[attr];
	} else {
		obj.transform[attr] = val;
		var iStyle = '';
		for(var s in obj.transform) {
			switch(getTransformUnit(s)) {
				case 'degree':
					iStyle += ' ' + s + '(' + obj.transform[s] + 'deg)';
					break;
				case 'percent':
					iStyle += ' ' + s + '(' + (obj.transform[s] / 100) + ')';
					break;
				case 'pixel':
					iStyle += ' ' + s + '(' + obj.transform[s] + 'px)';
					break;
			}
		}
		obj.style.WebkitTransform = obj.style.transform = iStyle;
	}
	function getTransformUnit(attribute) {
		if(/rotate|skew/.test(attribute)) {
			return 'degree';
		} else if(/scale/.test(attribute)) {
			return 'percent';
		} else {
			return 'pixel';
		}
	}
}

//基于Tween算法的时间版运动
function MTween(init) {
	/*
		 API
		 @ init.el: 运动元素,
		 @ init.target: { '属性名1': 属性值1, '属性名2': 属性值2... },
		 @ init.time: 持续时间ms,
		 @ init.type: 'Tween方程',
		 * init.callIn: function (){
		  		回调函数
		   },
		 * init.callBack: function (){
		 		并行函数
		   }
	*/
	var t = 0; //步数
	var b = {}; //起始值
	var c = {}; //变化值
	var d = init.time / 20; //持续时间
	for(var s in init.target) {
		b[s] = css(init.el, s);
		c[s] = init.target[s] - b[s];
	}
	clearInterval(init.el.timer);
	init.el.timer = setInterval(function() {
		t++;
		if(t > d) {
			clearInterval(init.el.timer);
			init.callBack && init.callBack.call(init.el);
		} else {
			init.callIn && init.callIn.call(init.el);
			for(var s in b) {
				var val = Number((Tween[init.type](t, b[s], c[s], d)).toFixed(2));
				css(init.el, s, val);
			}
		}
	}, 20);
}