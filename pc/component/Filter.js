((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.Filter = () => {
        return  `
            ${$QUI.Filter.COMP.FilterHead()}
            ${$QUI.Filter.COMP.FilterBody()}
        `;
    };
    
    exp.COMP.FilterHead = () => {
        return `
            <div class="filter_head">
                <button type="button" id="btnFilerGodOption" class="btn_select" onclick="$QUI.Filter.clickFilterTab(event)" data-tab="filterTab-01">
                    상품 정보&nbsp;
                    <span class="cnt"></span>
                </button>
                <button type="button" id="btnFilerBrand" class="btn_select" onclick="$QUI.Filter.clickFilterTab(event)" data-tab="filterTab-02">
                    브랜드&nbsp;
                    <span class="cnt"></span>
                </button>
                <button type="button" id="btnFilerPrice" class="btn_select" onclick="$QUI.Filter.clickFilterTab(event)" data-tab="filterTab-03">
                    가격
                </button>
                <button type="button" id="btnFilerColor" class="btn_select" onclick="$QUI.Filter.clickFilterTab(event)" data-tab="filterTab-04">
                    색상&nbsp
                    <span class="cnt"></span>
                </button>
                <button type="button" id="btnFilerRefresh" class="btn_reset" onclick="$QUI.Filter.doResetFilter('getList')">
                    <span class="blind">새로고침</span>
                </button>
            </div>
        `;
    };
    
    exp.COMP.FilterBody = () => {
        return `
            <div class="filter_cont" style="display:none">
                ${$QUI.Filter.COMP.FilterGod()}
                ${$QUI.Filter.COMP.FilterBrand()}
                ${$QUI.Filter.COMP.FilterPrice()}
                ${$QUI.Filter.COMP.FilterColor()}
                <div class="filter_btn" data-que-component="FilterResult">
                    ${$QUI.Filter.COMP.FilterResult()}
                </div>
            </div>
        `;
    };
    
    exp.COMP.FilterResult = (count = 0) => {
        const cntNum = Number(count);
        const cntText = cntNum.toLocaleString('ko-KR'); // 3자리 콤마
    
        return  `
            <button type="button" class="white" onclick="$QUI.Filter.doResetFilter()">초기화</button>
            <button type="button" name="btnSearchFilter" onclick="$QUI.Filter.clickGetFilterGods()" ${cntNum == 0 ? 'disabled' : ''}>
                ${cntText}개 상품 보기
            </button>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // [exports] 열려있는 탭 모두 닫기처리
    const resetFilterActive = function(){
        const $filterHeadActiveList = document.querySelectorAll('.filter_head .btn_select.is_active');
        $filterHeadActiveList.forEach(item => {
            item.classList.remove('is_active');
        });

        const $filterCont = document.querySelector('.filter_cont');
        $filterCont.style.display = 'none';

        const $filterContActiveList = document.querySelectorAll('.filter_cont .cont.is_active');
        $filterContActiveList.forEach(item => {
            item.classList.remove('is_active');
            item.style.display = 'none';
        });
    }

    // [exports] 필터 헤드 영역 클릭
    const clickFilterTab = function(event){

        event.stopPropagation();
        const $eventTarget = event.target?.closest('button');
        const eventTab = $eventTarget.getAttribute('data-tab');
        const is_active = $eventTarget.classList.contains('is_active');

        $QUI.Filter.resetFilterActive();    

        if(is_active == false){
            // 필터 상세 오픈
            const $filterCont = document.querySelector('.filter_cont');
            $filterCont.style.display = 'block';

            $eventTarget.classList.add('is_active');
            toggleFilterContTab('open', eventTab);

            if(eventTab == 'filterTab-02'){
                // 브랜드 필터 클릭시 -> 랜더링
                $QUI.Filter.initBrandFilter();
            }
        }else{
            // 필터 상세 닫기
            $eventTarget.classList.remove('is_active');
            toggleFilterContTab('close', eventTab);
        }
    }

    const toggleFilterContTab = function(type, tabId){
        const $filterContTab = document.querySelector(`.filter_cont .cont[data-id="${tabId}"]`);
        if(type === 'open'){
            $filterContTab.classList.add('is_active');
            $filterContTab.style.display = 'block';
        }else{
            $filterContTab.classList.remove('is_active');
            $filterContTab.style.display = 'none';
        }
    }

    // [exports] 카테고리 필터 적용
    const updateFilterForm = function(object, type = 'none'){
        for (let key in object) {
            try {
                const $target = document.querySelector(`#ctgryFilterParams [name="${key}"]`);
                $target.value = object[key];
            } catch (error) {
            }
        }

        updateFilterHeadAllCnt();
        debouncedFilterCount();
    }

    // 디바운싱
    const debouncedFilterCount = $QFn.debounce(function(){
        $QFn.CTGRY.getFilterCount('CTGRY');
    }, 100);

    // [exports]
    const updateFilterFormMultiple = function(name, type, value){
        const oldData = document.querySelector(`#ctgryFilterParams [name="${name}"]`)?.value || '';
        let oldArray = oldData ? oldData.split(',') : [];

        if(type === 'add'){
            if (!oldArray.includes(value)) {
                oldArray.push(value);
            }
        }else{
            oldArray = oldArray.filter(item => item !== value);
        }

        const newData = oldArray.join(',');
        $QUI.Filter.updateFilterForm({[name]:newData});
    }

    const updateFilterHeadAllCnt = function(){
        // 상품
        const $gods = document.querySelectorAll('#ctgryFilterParams [group="filterGod"]');
        let godCnt = 0;
        $gods.forEach(god => {
            godCnt += (god.value == 'Y') ? 1 : 0;
        });
        document.querySelector('#btnFilerGodOption .cnt').innerText = godCnt == 0 ? '' : `(${godCnt})`;

        // 브랜드
        const $brands = document.querySelector('#ctgryFilterParams [group="filterBrand"]');
        let brandCnt = ($brands.value == '') ? 0 : $brands.value.split(',').length;
        document.querySelector('#btnFilerBrand .cnt').innerText = brandCnt == 0 ? '' : `(${brandCnt})`;

        // 가격
        // 슬라이드에서 업데이트

        // 색상
        const $colors = document.querySelector('#ctgryFilterParams [group="filterColor"]');
        let colorCnt = ($colors.value == '') ? 0 : $colors.value.split(',').length;
        document.querySelector('#btnFilerColor .cnt').innerText = colorCnt == 0 ? '' : `(${colorCnt})`;
    }

    // [exports][뒤로가기] 필터폼 -> 필터 적용
    const renewFilterParamToFilter = function(){
        // 상품
        const $gods = document.querySelectorAll('#ctgryFilterParams [group="filterGod"]');
        $gods.forEach(god => {
            const $target = document.querySelector(`#chk_${god.name}`);
            $target.checked = (god.value == 'Y') ? true : false;
        });

        // 브랜드 : 필터 클릭시 랜더링

        // 가격
        const priceStr = document.querySelector('#ctgryFilterParams [group="filterPrice"]')?.value || '';
        $QUI.Filter.setPriceSlider(priceStr);

        // 색상
        const colorStr = document.querySelector('#ctgryFilterParams [group="filterColor"]')?.value || '';
        $QUI.Filter.setColorFilterByString(colorStr);
    }

    // [exports] 상세 필터 > 초기화 버튼 클릭
    const doResetFilter = function(param){
        resetFilter(param);
        
        const info = $QFn.getCurrentInfo();
        if(info.mGubun != 'CTGRY'){
            // 제외) 브랜드 필터 없는 경우(브랜드관, 특별관)
        }else{
            $Que.render('FilterBrandResult', '');   // 브랜드 결과 초기화(GA 체크 제외)
            $QUI.Filter.initBrandFilter();
        }

        // [GA4] 이벤트 태깅
        ga4_sendEventTag('초기화');
    }

    // [exports] 필터 초기화
    const resetFilter = function(type="none"){
        const reset = {
            exclusiveGodYn: '',
            dcGodYn: '',
            excludeSoldoutGodYn: '',
            preOrderGodYn: '',
            eqlOtltYn: '',
            price: '0,999999999',
            color: '',
        };

        const {page_name} = $QFn.getCurrentInfo();
        if(page_name == 'EXCLUSIVE'){
            // Case) EXCLUSIVE
            reset.exclusiveGodYn = 'Y';
        }
        if(page_name != 'BRND' && page_name != 'SIS'){
            // Case) Not 브랜드관
            reset.productBrand = '';
        }

        updateFilterForm(reset);
        renewFilterParamToFilter();

        if(type == 'getList'){
            $QFn.CTGRY.getGodsList();
        }
    }

    // [exports]
    const clickGetFilterGods = function(){
        $QFn.CTGRY.getFilterCount('CTGRY');
        $QFn.CTGRY.getGodsList();
        resetFilterActive();
        $QFn.CTGRY.scrollCtgry();

        // [GA4] 이벤트 태깅
        ga4_sendEventTag('상품 보기');
    }

    // [GA4] 이벤트 태깅 - 상세필터
    const ga4_sendEventTag = function(label){
        const {filterGods, filterColors, filterBrands} = GA4.EVENT.getFilterEvent();
        const priceText = document.querySelector('#ctgryFilterParams [name="price"]')?.value;
        const customParam = {
            ep_filter_Price : (priceText!='0,999999999') ? priceText.replace(',','~') : 'ALL' ,
            ep_filter_Info : (filterGods.length>0) ? filterGods.join('_') : 'ALL',
            ep_filter_Color : (filterColors.length>0) ? filterColors.join('_') : 'ALL',
            ep_filter_Brand : (filterBrands.length>0) ? filterBrands.join('_') : 'ALL',
        };

        const {category} = $QFn.GA.getEvnetParam('FILTER');
        GA4.EVENT.set2(category, '상세필터', label, customParam);
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.resetFilterActive = resetFilterActive;
    exp.clickFilterTab = clickFilterTab;
    exp.updateFilterForm = updateFilterForm;
    exp.updateFilterFormMultiple = updateFilterFormMultiple;
    exp.renewFilterParamToFilter = renewFilterParamToFilter;
    exp.resetFilter = resetFilter;
    exp.doResetFilter = doResetFilter;
    exp.clickGetFilterGods = clickGetFilterGods;
})(window.$QUI.Filter);