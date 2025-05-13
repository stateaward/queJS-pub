((exp)=>{
    /*
        [queJS Function] ctgry.js
        : 카테고리 조작과 관련된 함수(queJS)
    */
    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // [exports]
    const updateForm = function(object, type = 'none', resetFltrYn = 'none'){
        for (let key in object) {
            try {
                const $target = document.querySelector(`#ctgryParams [name="${key}"]`);
                $target.value = object[key];
    
                if(key == 'back' && object[key] == 'N'){
                    // 뒤로가기를 N으로 한 경우, 세션값 삭제
                    scrollBack('del');
                }
            } catch (error) {
                console.warn(`[ERROR] at updateForm ${key}... ${error}`, error);
            }
        }
    
        if(resetFltrYn == 'reset'){
            // 브랜드 목록 초기화
            try {
                $QUI.Filter.resetFilter();
            } catch (error) {
            }
        }
    
        if(type != 'none'){
            try {
                // 상품 조회 필요한 경우, 필터 닫기 처리
                $QUI.Filter.resetFilterActive();
            } catch (error) {
            }

            if(type == 'getList'){
                // 신규 조회
                getGodsList();
                scrollCtgry();
            }else if(type == 'more'){
                // 더보기
                getGodsList('more');
            }
        }
    }

    // [exports]
    const updateURL = function(){
        let queryString = '';
        const urlObj = new URL(window.location.href);
        
        const formData = new FormData(document.querySelector('#ctgryParams'));
        formData.forEach((value, key)=>{
            urlObj.searchParams.set(key, value);
            queryString += `${key}=${value}&`;
        });
    
        const formData2 = new FormData(document.querySelector('#ctgryFilterParams'));
        formData2.forEach((value, key)=>{
            urlObj.searchParams.set(key, value);
            queryString += `${key}=${value}&`;
        });
    
        history.replaceState(null, null, urlObj);
        
        return queryString.slice(0,-1);
    }

    const serializeParams = function(){
        const formData = new FormData(document.querySelector('#ctgryParams'));
        const queryString1 = new URLSearchParams(formData)?.toString();
    
        const formFilterData = new FormData(document.querySelector('#ctgryFilterParams'));
        const queryString2 = new URLSearchParams(formFilterData)?.toString();
    
        return `${queryString1}&${queryString2}`;
    }
    
    // [exports]
    const getGodsList = function(type){
        const queryString = updateURL();
        const isBack = document.querySelector('#ctgryParams [name="back"]')?.value;
        return new Promise((resolve, reject) => {
            $.ajax({
                type : "POST",
                url : `/category/v2/godListHtml${type=='more' ? '?more=Y' : ''}`,
                data: queryString,
                beforeSend: function (request){
                    if($QFn.CTGRY.frontState('get') == 'FIRST_ENTRY') {
                        // 최초 접속 시, 로딩바 제거
                    }else{
                        showLoadingPopup2(false, 999);
                    }
                },
                success : function(result) {
                    if(type != 'more'){
                        // 더보기가 아닐 경우(통목록 조회)
                        $('#gods-section').html(result);
                    }else{
                        // 더보기 일 경우(li만 추가)
                        $('#gods-section .product_info li[name="product"]').last().after(result);
                    }
                    resolve(result);
                },
                error : function(e) {
                    console.error(`⚡[queJS][ERROR] at getGodsList :: `, e);
                    // showAlert2(e.responseText);
                    reject(e);
                },
                complete: function () {
                    if($QFn.CTGRY.frontState('get') == 'FIRST_ENTRY') {
                        // 최초 접속 시, 로딩바 제거
                    }else{
                        hideLoadingPopup2();
                    }
                    if($QFn.CTGRY.frontState('get') == 'BACK' && isBack == 'Y'){
                        // 뒤로가기로 접근 시, 스크롤 값 삭제
                        scrollBack('move');
                    }else{
                        scrollBack('del');
                    }
                    
                    // 상품 목록 조회 후 뒤로가기(Y) 처리
                    updateForm({back:'Y'});
                    updateURL();
    
                    CREMA.Widget.run();
                    $QFn.SKELETON?.init();
                }
            });
        });
    }

    // [exports] 리뷰관 > 리뷰 목록 조회
    const getReviewList = function(type) {
    	const queryString = updateURL();
    	const isBack = document.querySelector('#ctgryParams [name="back"]')?.value;
		var url = ""
		if (type == 'more'){
			url = "/category/v2/reviewList?more=Y"
		}else{
			url = "/category/v2/reviewList"
		}
    	return new Promise((resolve, reject) => {
        	$.ajax({
            	type : "POST",
            	url : url,
            	data: queryString,
            	beforeSend: function (request){
                	if(frontState('get') == 'FIRST_ENTRY') {
                    	// 최초 접속 시, 로딩바 제거
                	}else{
                    	showLoadingPopup2(false, 999);
                	}
            	},
            	success : function(result) {
                	if(type != 'more'){
                    	// 더보기가 아닐 경우(통목록 조회)
                    	$('#reviews-section').html(result);
                	}else{
                    	// 더보기 일 경우(li만 추가)
                    	$('#reviews-section .product_info li[name="review"]').last().after(result);
                	}
                	resolve(result);
            	},
            	error : function(e) {
                	showAlert2(e.responseText);
                	reject(e);
            	},
            	complete: function () {
                	if(frontState('get') == 'FIRST_ENTRY') {
                    	// 최초 접속 시, 로딩바 제거
                	}else{
                    	hideLoadingPopup2();
                	}
                	if(frontState('get') == 'BACK' && isBack == 'Y'){
                    	// 뒤로가기로 접근 시, 스크롤 값 삭제
                    	scrollBack('move');
                	}else{
                    	scrollBack('del');
                	}

                	// 상품 목록 조회 후 뒤로가기(Y) 처리
                	updateForm({back:'Y'});
                	updateURL();

                	CREMA.Widget.run();
            	}
        	});
    	});
	}
    
    // [exports]
    const getGodsListMore = function(){
        const $page = document.querySelector('[name="page"]');
        const _page = Number($page.value) + 1;
    
        updateForm({back:'N',page:_page}, 'more');
    }
    
    // [exports]
    const getFilterCount = async function(mode){
        const queryString = serializeParams();
        const result = await $QFn.fetchData('POST', `/filter/v2/count?mode=${mode}`, queryString);

        if(typeof $QUI?.Filter?.COMP?.FilterResult != 'undefined'){
            $Que.render('FilterResult', $QUI.Filter.COMP.FilterResult(result?.totalCount));
        }
        await getFilteringBrandList(mode, queryString, result?.brandList);
        return result;
    }

    const getFilteringBrandList = async function(mode, queryString, brandList){
        const info = $QFn.getCurrentInfo();
        if(info.mGubun != 'CTGRY'){
            // 제외) 브랜드 필터 없는 경우(브랜드관, 특별관)
            return;
        }

        if(queryString.includes('productBrand=&')){
            $QFn.SESSION_STORAGE?.set('FILTERING_BRAND_LIST', brandList);
            console.log(`⚡[BRAND_FILTER] Set Filtering Session : ${brandList.length}`);
        }else{
            const sessionBrandList = $QFn.SESSION_STORAGE?.get('FILTERING_BRAND_LIST');
            if(sessionBrandList == null){
                /**
                 * 브랜드 필터 적용시, 해당 브랜드만 노출 현상 방지
                 * - 이전 적용된 세션 값 기준 조회
                 * - 세션 없을 시(URL로 접속), 브랜드 필터 삭제 후 재조회
                 */
                const queryString2 = modifyQueryString(queryString, 'productBrand', '');
                const result = await $QFn.fetchData('POST', `/filter/v2/count?mode=${mode}`, queryString2);
                $QFn.SESSION_STORAGE?.set('FILTERING_BRAND_LIST', result?.brandList);
                console.log(`⚡[BRAND_FILTER] Set Filtering Session(NEW) : ${brandList.length}`);
            }
        }
    }
    
    const modifyQueryString = function(queryString, target, value){
        const baseUrl = location.origin + location.pathname;
        const tempUrl = baseUrl + '?' + queryString;
        const urlObj = new URL(tempUrl);
        urlObj.searchParams.set(target, value);
        return urlObj.searchParams.toString();
    }
    
    // [exports]
    const scrollCtgry = function(){
        try {
            const scrollHere = document.querySelector('.scroll-here');
            if(scrollHere){
                let tuning = scrollHere.dataset.scrollTuning;
                tuning = tuning ? parseInt(tuning,10) : 0;
                const offsetTop = scrollHere.getBoundingClientRect().top + window.pageYOffset + tuning;
                window.scrollTo({top:offsetTop, behavior:'smooth'});
            }else{
                throw new Error('Non-existence scroll-target');
            }
        } catch (error) {
            console.warn('[ERROR] at scrollCtgryFilter...', error);
        }
    }
    
    // [exports]
    const scrollBack = function(type){
        switch(type){
            case 'set':
                sessionStorage.setItem('$QScroll', window.scrollY);
                break;
            case 'move':
                const position = sessionStorage.getItem('$QScroll');
                if(position){
                    window.scrollTo(0, parseInt(position, 10));
                    sessionStorage.removeItem('$QScroll');
                }
                break;
            case 'del':
                sessionStorage.removeItem('$QScroll');
                break;
        }
    }
    
    // [export]
    const frontState = function(type, value){
        const $frontState = document.querySelector('#ctgryNonParams [name="frontState"]');
    
        switch(type){
            case 'set':
                $frontState.value = value;
                break;
            case 'get':
                break;
        }
        
        return $frontState.value;
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
	exp.CTGRY = exp.CTGRY || {};

    exp.CTGRY.updateForm = updateForm;
    exp.CTGRY.updateURL = updateURL;
    exp.CTGRY.getGodsList = getGodsList;
    exp.CTGRY.getGodsListMore = getGodsListMore;
    exp.CTGRY.getReviewList = getReviewList;
    exp.CTGRY.getFilterCount = getFilterCount;
    exp.CTGRY.scrollCtgry = scrollCtgry;
    exp.CTGRY.scrollBack = scrollBack;
    exp.CTGRY.frontState = frontState;

    (()=>{
        window.addEventListener('beforeunload', () => {
            scrollBack('set');
        });
    })();
})(window.$QFn);