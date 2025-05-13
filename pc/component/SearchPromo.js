((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.TabWrapper = (nowTabCd)=>{
        return `
            <div class="tab_style2 col_gray ga_event_search_10" >
                ${$QUI.Promo._tabList.map((tab)=>{
                    return $QUI.Promo.COMP.Tab(tab, nowTabCd);
                }).join('')}
            </div>
        `;
    };
    
    exp.COMP.Tab = (tab, nowTabCd)=>{
        return `
            <button type="button" class="tab_btn ${tab.cd === nowTabCd ? 'is_active' : ''}" data-tab="${tab.cd}" data-cnt="2" onclick="$QUI.Promo.clickTab('${tab.cd}'); GPGA.EVENT.setLabel('${tab.kor}','탭메뉴');" id="tabKind_${tab.cd}" data-theme-cd="${tab.cd}" data-view-type="">${tab.kor}</button>
        `;
    };
    
    exp.COMP.SearchPromoResult = (response)=>{
        const isNoData = response.pageInfo.totalCount == 0 || response.data.length == 0;
        const searchWord = document.querySelector('#reKeyword')?.value;
    
        return `
            ${isNoData ? `
                <!-- 결과 없음 -->
                <div id="nodata" class="no_data type2">
                    <span class="keyword">' ${searchWord} '</span> 에 대한 검색 결과가 없습니다.<br>
                    다른 검색어로 검색해 보세요.
                </div>
            ` : `
                <!-- 결과 존재 -->
                <ul class="product_info product_list_evt" data-que-component="SearchPromoResultList">
                    ${$QUI.Promo.COMP.SearchPromoResultList(response)}
                </ul>
                <div data-que-component="SearchPromoResultMore"></div>
            `}
        `;
    };
    
    exp.COMP.SearchPromoResultList = (response)=>{
        const isMorePage = Number(response.pageInfo.totalPageCount) > Number(response.pageInfo.nowPageNumber);
        const nextPage = isMorePage ? Number(response.pageInfo.nowPageNumber) + 1 : '';
    
        return `
            ${response.data.map(promo => $QUI.Promo.COMP.PromoItem(promo)).join('')}
            <div class="promo-cursor" data-now="${response.pageInfo.nowPageNumber}" data-next="${nextPage}" style="visibility: hidden;"></div>
        `;
    };
    
    exp.COMP.SearchPromoResultMore = (type)=>{
        return `
            ${type == 'delete' ? `` : `
                <div class="more_wrap">
                    <div class="btn_sub_l white">
                        <button type="button" onclick="$QUI.Promo.getEventListMore(); return false;">더 보기</button>
                    </div>
                </div>
            `}
        `;
    }
    

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // [exports]
    const clickTab = function(tabCd){
        $Que.render('SearchPromoTab', $QUI.Promo.COMP.TabWrapper(tabCd));
        updateForm({'tab':tabCd, 'page':1}, 'getList');
    };
    
    // [exports]
    const makeTabList = function(data){
        $QUI.Promo._tabList = [];
        $QUI.Promo._tabList.push({cd: 'ALL', kor: '전체'});
        for (const [cd, kor] of Object.entries(data)) {
            const tabItem = {
                cd: cd,
                kor: kor
            };
            $QUI.Promo._tabList.push(tabItem);
        }
    };
    
    const updateForm = function(object, type = 'none'){
        for (let key in object) {
            try {
                const $target = document.querySelector(`#eventParams [name="${key}"]`);
                $target.value = object[key];
            } catch (error) {
                console.warn(`[ERROR] at updateForm ${key}... ${error}`, error);
            }
        }
    
        if(type != 'none'){
            if(type == 'getList'){
                // 신규 조회
                getEventList();
            }else if(type == 'more'){
                // 더보기
                getEventList('MORE');
            }
        }
    }
    
    const renderListMore = function(response){
        const nextCursor = Number(response.pageInfo.nowPageNumber);
        const $target = document.querySelector(`.product_list_wrap .promo-cursor[data-next="${nextCursor}"]`);
    
        $target.insertAdjacentHTML('afterend', $QUI.Promo.COMP.SearchPromoResultList(response));
    }
    
    // [exports]
    const getEventListMore = function(){
        const $page = document.querySelector('#eventList [name="page"]');
        const _page = Number($page.value) + 1;
        
        updateForm({'page': _page}, 'more');
    }
    
    // [exports]
    let _isProcessing = false;
    const getEventList = function(type){
        if(_isProcessing) return;
        _isProcessing = true;
    
        const searchWord = document.querySelector('#reKeyword')?.value;
        const tab = document.querySelector('#eventList [name="tab"]')?.value || 'ALL';
        const page = document.querySelector('#eventList [name="page"]')?.value || 1;
        const limit = document.querySelector('#eventList [name="limit"]')?.value || 40;
    
        const chApiDomain = document.querySelector('#chApiDomain')?.value;
        const apiUrl = `${chApiDomain}v1/promotion/search?q=${searchWord}&category=${tab == 'ALL' ? '' : tab}&limit=${limit}&page=${page}&device=p`;
        
        return new Promise((resolve, reject)=>{
            $.ajax({
                type: 'GET',
                url: apiUrl,
                beforeSend: function (request){
                    if(type == 'FIRST_ENTRY'){
                    }else{
                        showLoadingPopup2(false, 999);
                    }
                },
                success : function(result) {
                    if(type == 'MORE'){
                        // 더보기
                        renderListMore(result);
                    }else{
                        // 신규 조회
                        $Que.render('SearchPromoResult', $QUI.Promo.COMP.SearchPromoResult(result));
                    }
                    const totalCount = Number(result.pageInfo.totalCount);
                    if(totalCount > 0){
                        const isMorePage = Number(result.pageInfo.totalPageCount) > Number(result.pageInfo.nowPageNumber);
                        if(isMorePage){
                            $Que.render('SearchPromoResultMore', $QUI.Promo.COMP.SearchPromoResultMore());
                        }else{
                            $Que.render('SearchPromoResultMore', $QUI.Promo.COMP.SearchPromoResultMore('delete'));
                        }
                    }
                    resolve(result);
                },
                error : function(e) {
                    showAlert2('시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.');
                    console.error(e.responseText);
                    reject(e);
                },
                complete: function () {
                    _isProcessing = false;
                    hideLoadingPopup2();
                    comm.setTimerBadge();
                }
            })
        })
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.clickTab = clickTab;
    exp.makeTabList = makeTabList;
    exp.getEventList = getEventList;
    exp.getEventListMore = getEventListMore;
})(window.$QUI.Promo);