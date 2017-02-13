window.onload = function (){
			
	//阻止系统默认事件
	document.addEventListener('touchstart',function (e){
		e.preventDefault();
	});
	
	var oImgList = document.querySelector('.img-list');
	var oBtnList = document.querySelector('.btn-list');
	var iLen = oImgList.children.length;
	
	var disX = 0; //点击开始时手指位置记录
	var oriLeft = 0; //点击开始时元素位置记录
	var curLeft = 0; //点击结束时目标位置
	
	var iWidth = document.documentElement.clientWidth;
	
	var curIndex = 0; //当前元素索引
	var oldIndex = 0; //前一个元素索引
	
	//扩展图片列表和容器宽度(无缝轮播关键点1)
	oImgList.innerHTML += oImgList.innerHTML;
	oImgList.style.width = oImgList.offsetWidth*2 + 'px';
	
	oImgList.addEventListener('touchstart',function (e){
		
		disX = e.changedTouches[0].pageX;
		this.style.transition = 'none';
		
		//元素位置修正(无缝轮播关键点2)
		curIndex = Math.abs(this.offsetLeft/iWidth)%iLen;
		if (curIndex==0) {
			this.style.left = -this.offsetWidth/2 + 'px';
		} else if (curIndex==iLen-1) {
			this.style.left = -(iLen-1)*iWidth + 'px';
		}
		oriLeft = this.offsetLeft;
		
	});
	
	oImgList.addEventListener('touchmove',function (e){
		
		curLeft = oriLeft + e.changedTouches[0].pageX - disX;
		this.style.left = curLeft + 'px';
		
	});
	
	oImgList.addEventListener('touchend',function (){
		
		var iPos = Math.round((curLeft-oriLeft)/iWidth);
		curLeft = oriLeft + iPos*iWidth;
		curIndex = Math.abs(curLeft/iWidth)%iLen;
		this.style.left = curLeft + 'px';
		this.style.transition = '0.5s';
		
		oBtnList.children[oldIndex].className = '';
		oBtnList.children[curIndex].className = 'active';
		oldIndex = curIndex;
		
	});
	
}