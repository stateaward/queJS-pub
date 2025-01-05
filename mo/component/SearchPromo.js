((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.TabWrapper = (nowTabCd)=>{
        return `
            <div class="tab_style1" >
                ${$QUI.Promo._tabList.map((tab)=>{
                    return $QUI.Promo.COMP.Tab(tab, nowTabCd);
                }).join('')}
            </div>
        `;
    };
    
    exp.COMP.Tab = (tab, nowTabCd)=>{
        return `
            <button type="button" class="tab_btn ${tab.cd === nowTabCd ? 'is_active' : ''}"
                data-tab="${tab.cd}"
                onclick="$QUI.Promo.clickTab('${tab.cd}'); GPGA.EVENT.setLabel('${tab.kor}','탭메뉴');"
                id="tabKind_${tab.cd}"
                data-theme-cd="${tab.cd}"
                data-view-type=""
            >${tab.kor}</button>
        `;
    };
    
    exp.COMP.SearchPromoResult = (response)=>{
        const isNoData = response.pageInfo.totalCount == 0 || response.data.length == 0;
        const searchWord = document.querySelector('#reKeyword')?.value;
    
        return `
            ${isNoData ? `
                <!-- 결과 없음 -->
                <div class="no_data" id="noEventList">
                    <em class="keyword">' ${searchWord} '</em> 에 대한 검색 결과가 없습니다. <br>
                    다른 검색어로 검색해 보세요.
                </div>
            ` : `
                <!-- 결과 존재 -->
                <ul class="product_list_evt product_info grid1" data-que-component="SearchPromoResultList">
                    ${$QUI.Promo.COMP.SearchPromoResultList(response)}
                </ul>
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

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // [exports]
    const clickTab = function(tabCd){
        // $Que.render('SearchPromoTab', $QUI.Promo.COMP.TabWrapper(tabCd));
        updateForm({'tab':tabCd, 'page':1}, 'getList');
        scrollMove();
    };
    
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
        const $eventParams = document.querySelector('#eventParams');
        for (let key in object) {
            try {
                const $target = $eventParams.querySelector(`[name="${key}"]`);
                if($target) $target.value = object[key];
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
        const $target = document.querySelector(`.product_list_evt .promo-cursor[data-next="${nextCursor}"]`);
    
        if($target){
            $target.insertAdjacentHTML('afterend', $QUI.Promo.COMP.SearchPromoResultList(response));
        }
    }
    
    const getEventListMore = function(){
        const $page = document.querySelector('#eventList [name="page"]');
        const _page = Number($page.value) + 1;
        
        updateForm({'page': _page}, 'more');
    }
    
    const getEventList = function(type){
        const searchWord = document.querySelector('#reKeyword')?.value;
    
        const $eventList = document.querySelector('#eventList');
        const tab = $eventList.querySelector('[name="tab"]')?.value || 'ALL';
        const page = $eventList.querySelector('[name="page"]')?.value || 1;
        const limit = $eventList.querySelector('[name="limit"]')?.value || 40;
    
        const chApiDomain = document.querySelector('#chApiDomain')?.value;
        const apiUrl = `${chApiDomain}v1/promotion/search?q=${searchWord}&category=${tab == 'ALL' ? '' : tab}&limit=${limit}&page=${page}&device=m`;
        
        return new Promise((resolve, reject)=>{
            $.ajax({
                type: 'GET',
                url: apiUrl,
                success : function(result) {
                    if(type == 'MORE'){
                        // 더보기
                        renderListMore(result);
                    }else{
                        // 신규 조회
                        $Que.render('SearchPromoResult', $QUI.Promo.COMP.SearchPromoResult(result));
                    }
                    
                    setupInfScroll(result.pageInfo.nowPageNumber);
                    resolve(result);
                },
                error : function(e) {
                    showAlert2('시스템 오류가 발생하였습니다. 잠시후 다시 시도해주세요.');
                    console.error(e.responseText);
                    reject(e);
                },
                complete: function () {
                    comm.setTimerBadge();
                }
            })
        })
    }
    
    const setupInfScroll = function(nowPage){
        function observerCB(entries, observer){
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    getEventListMore();
                    observer.unobserve(entry.target);
                }
            });
        }
        const preCatch = '700px';
        const io = new IntersectionObserver(observerCB, {threshold: 0, rootMargin: preCatch});
        const $target = document.querySelector(`.promo-cursor[data-now="${nowPage}"]`);
    
        if($target && $target.dataset.next != ''){
            io.observe($target);
        }
    };
    
    const scrollMove = function(){
        try {
            const scrollHere = document.querySelector('.scroll-here');
            if(scrollHere){
                let tuning = scrollHere.dataset.scrollTuning;
                tuning = tuning ? parseInt(tuning,10) : 0;
                const offsetTop = scrollHere.getBoundingClientRect().top + window.pageYOffset + tuning;
                window.scrollTo({top:offsetTop, behavior:'auto'});
            }else{
                throw new Error('Non-existence scroll-target');
            }
        } catch (error) {
            console.warn('[ERROR] at scrollMove...', error);
        }
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.clickTab = clickTab;
    exp.makeTabList = makeTabList;
    exp.getEventList = getEventList;
    
})(window.$QUI.Promo);