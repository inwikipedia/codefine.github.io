window.onload = function (){
	
	var oTbTab = document.querySelector('.tb-banner');
	var oTmTab = document.querySelector('.tm-banner');
	var aSearch = document.querySelectorAll('.search-bar');
	
	fixSide();
	qrClose();
	xTab(oTbTab,4000);
	xTab(oTmTab,4500);
	searchList();
	tabType();
	
	window.onscroll = function (){
		fixToggle();
		fixSide();
	}
	
}

//顶部固定搜索框
function fixToggle(){
	var fixSearch = document.querySelector('#fix-search');
	var oFix = document.querySelector('.fix-search-bar');
	var oMain = document.querySelector('.main-search-bar');
	var oBar = document.querySelector('.search-bar');
	var oIns = document.querySelector('.search-sug');
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	if (scrollTop>125) {
		addClass(oBar,'fl');
		oFix.appendChild(oBar);
		fixSearch.style.display = 'block';
	} else {
		removeClass(oBar,'fl');
		oMain.insertBefore(oBar,oIns);
		fixSearch.style.display = 'none';
	}
}

//侧边导航
function fixSide(){
	var oSidebar = document.querySelector('#sidebar');
	var oOften = oSidebar.querySelector('.sidebar-often');
	var oFashion = oSidebar.querySelector('.sidebar-fashion');
	var oQuality = oSidebar.querySelector('.sidebar-quality');
	var oFeature = oSidebar.querySelector('.sidebar-feature');
	var oBenefit = oSidebar.querySelector('.sidebar-benefit');
	var oGuess = oSidebar.querySelector('.sidebar-guess');
	var oBacktop = oSidebar.querySelector('.sidebar-backtop');
	//绝对/固定定位转换
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	if (scrollTop>440) {
		oSidebar.style.position = 'fixed';
		oSidebar.style.top = '49px';
	} else {
		oSidebar.style.position = 'absolute';
		oSidebar.style.top = '488px';
	}
	//按钮滚动响应
	var disH = 49; //顶部固定定位搜索条高度
	var tOften = getOffset(document.querySelector('.section-often')).top-disH;
	var tFashion = getOffset(document.querySelector('.section-fashion')).top-disH;
	var tQuality = getOffset(document.querySelector('.section-quality')).top-disH;
	var tFeature = getOffset(document.querySelector('.section-feature')).top-disH;
	var tBenefit = getOffset(document.querySelector('.section-benefit')).top-disH;
	var tGuess = getOffset(document.querySelector('.main-guess')).top-disH;
	//返回顶部响应
	if (scrollTop>800-disH) {
		oBacktop.style.display = 'block';
	} else {
		oBacktop.style.display = 'none';
	}
	//主要按钮响应
	var elts = oSidebar.querySelectorAll('li');
	for (var i=0; i<elts.length; i++) {
		removeClass(elts[i],'active');
	}
	if (scrollTop<tFashion) {
		removeClass(oFashion,'active');
		addClass(oOften,'active');
	} else if (scrollTop>=tFashion&&scrollTop<tQuality) {
		removeClass(oOften,'active');
		removeClass(oQuality,'active');
		addClass(oFashion,'active');
	} else if (scrollTop>=tQuality&&scrollTop<tFeature) {
		removeClass(oFashion,'active');
		removeClass(oFeature,'active');
		addClass(oQuality,'active');
	} else if (scrollTop>=tFeature&&scrollTop<tBenefit) {
		removeClass(oQuality,'active');
		removeClass(oBenefit,'active');
		addClass(oFeature,'active');
	} else if (scrollTop>=tBenefit&&scrollTop<tGuess) {
		removeClass(oFeature,'active');
		removeClass(oGuess,'active');
		addClass(oBenefit,'active');
	} else if (scrollTop>=tGuess) {
		removeClass(oBenefit,'active');
		addClass(oGuess,'active');
	}
	//点击页面滚动到对应位置
	oOften.onclick = function (){
		easeScroll(tOften);
	}
	oFashion.onclick = function (){
		easeScroll(tFashion);
	}
	oQuality.onclick = function (){
		easeScroll(tQuality);
	}
	oFeature.onclick = function (){
		easeScroll(tFeature);
	}
	oBenefit.onclick = function (){
		easeScroll(tBenefit);
	}
	oGuess.onclick = function (){
		easeScroll(tGuess);
	}
	oBacktop.onclick = function (){
		easeScroll(0);
	}
}

//关闭主二维码
function qrClose(){
	var oQR = document.querySelector('#closeQR');
	oQR.onclick = function (){
		this.parentNode.style.display = 'none';
	};
}

//JsonP
function jsonp(data){
	var oUl = document.querySelector('.search-list');
	var res = data.result;
	if (res.length) {
		var html = '';
		for (var i=0; i<res.length; i++) {
			html += '<li><a target="_blank" href="https://s.taobao.com/search?q='+res[i][0]+'">'+res[i][0]+'</a></li>';
		}
		oUl.innerHTML = html;
		oUl.style.display = 'block';
	} else {
		oUl.style.display = 'none';
	}
}

//搜索框智能推荐
function searchList(){
	var oBar = document.querySelector('.search-bar');
	var oUl = oBar.querySelector('.search-list');
	var oKw = oBar.querySelector('input');
	var oP = oBar.querySelector('p');
	oKw.onkeyup = function (){
		if (this.value!='') {
			var oScript = document.createElement('script');
			oScript.src = 'https://suggest.taobao.com/sug?code=utf-8&q='+this.value+'&callback=jsonp';
			document.body.appendChild(oScript);
			oP.style.display = 'none';
		} else {
			oUl.style.display = 'none';
			oP.style.display = 'block';
		}
	}
}

//搜索类型切换(伪)
function tabType(){
	var aType = document.querySelectorAll('.main-search-bar>.search-type>li');
	var oInp = document.querySelector('.main-search-bar input');
	var oBtn = document.querySelector('.main-search-bar button');
	var aColor = ['#ff5400','#C80000','#FF5300'];
	for (var i=0; i<aType.length; i++) {
		(function (n){
			aType[n].onclick = function (){
				for (var i=0; i<aType.length; i++) {
					removeClass(aType[i],'active');
				}
				addClass(this,'active');
				oInp.style.borderColor = oBtn.style.backgroundColor = aColor[n];
			};
		})(i);
	}
}
