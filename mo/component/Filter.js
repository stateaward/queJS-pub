((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.FilterBtn = (isActive)=>{
        return `
            <button type="button" class="btn_filter ${isActive ? 'is_active' : ''}" onclick="$QUI.Filter.ui_modalControll('open', '#filterModalBottomSheet');">
                <span>상세필터</span>
            </button>
        `;
    };
    
    exp.COMP.FilterModal = ()=>{
        return `
            <!-- Filter Modal Bottomsheet -->
            <div class="modal_wrap" id="filterModalBottomSheet">
                <div class="modal modal_bottomsheet">
                    <!-- modal header -->
                    <div class="modal_header">                
                        <h3 class="modal_tit">상세필터</h3>    
                    </div>
                    <div class="modal_content">
                        ${$QUI.Filter.COMP.FilterPrice()}
                        ${$QUI.Filter.COMP.FilterGod()}
                        ${$QUI.Filter.COMP.FilterColor()}
                        ${$QUI.Filter.COMP.FilterBrand()}
                    </div>
                    <div class="btn_big_wrap line" data-que-component="FilterResult">
                        ${$QUI.Filter.COMP.FilterResult()}
                    </div>
                    <!-- //modal footer -->
                    <button type="button" id="filterModalClose" class="modal_close_btn exclude_ui_common" onclick="$QUI.Filter.ui_modalControll('close', '#filterModalBottomSheet')"><span class="blind">닫기</span></button>
                </div>
                <div class="dimmer exclude_ui_common" aria-hidden="true" onclick="$QUI.Filter.ui_modalControll('close', '#filterModalBottomSheet')"></div>
            </div>
            <!-- // Filter Modal Bottomsheet -->
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
    // [exports] 카테고리 필터 적용
    const updateFilterForm = function(object, type = 'none'){
        for (let key in object) {
            try {
                const $target = document.querySelector(`#ctgryFilterParams [name="${key}"]`);
                $target.value = object[key];

                // if(key != 'productBrand'){
                //     // 브랜드 필터 닫기
                //     $QUI.Filter.toggleBrandFilter('close');
                // }
            } catch (error) {
                console.warn(`⚡[queJS] Failed to updateFilterForm at ${key} -- ${error}`);
            }
        }

        $QUI.Filter.debouncedFilterBtnActive();
        debouncedFilterCount();
    }

    // 디바운싱
    const debouncedFilterCount = $QFn.debounce(function(){
        $QFn.CTGRY.getFilterCount('CTGRY');
    }, 100);

    // [exports] 카테고리 필터 다중 적용
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
        updateFilterForm({[name]:newData});
    }

    // [exports] (뒤로가기) 필터폼 -> 필터 적용
    const renewFilterParamToFilter = function(){
        // 상품
        const $gods = document.querySelectorAll('#ctgryFilterParams [group="filterGod"]');
        $gods.forEach(god => {
            try {
                const $target = document.querySelector(`#chk_${god.name}`);
                $target.checked = (god.value == 'Y') ? true : false;
            } catch (error) {
                console.warn(`⚡[queJS] Failed to renewFilterParamToFilter at ${god.name} -- ${error}`);
            }
        });

        // 브랜드 : 필터 클릭시 신규 랜더링

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
            $QUI.Filter.initBrandFilter();
        }
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
        $QUI.Filter.renewFilterParamToFilter();
        debouncedFilterBtnActive();

        if(type == 'getList'){
            $QFn.CTGRY.getGodsList();
        }
    }

    // [exports] 필터 적용 후 상품 조회
    const clickGetFilterGods = function(){
        $QFn.CTGRY.getFilterCount('CTGRY');
        $QFn.CTGRY.getGodsList();
        $QFn.CTGRY.scrollCtgry();
        $QUI.Filter.ui_modalControll('close', '#filterModalBottomSheet');
    }

    // [exports] 필터 버튼 활성화
    const debouncedFilterBtnActive = $QFn.debounce(function(){
        let isFilterApplied = false;
        const $filterForm = document.querySelectorAll('#ctgryFilterParams input');
        const {page_name} = $QFn.getCurrentInfo()

        $filterForm.forEach(item => {
            // 필터가 적용되었으면 적용으로 표시
            if(isFilterApplied) return;

            const group = item.getAttribute('group');
            if(group == 'filterGod'){
                isFilterApplied = (item.value == 'Y');
            }else if(group == 'filterPrice'){
                isFilterApplied = (item.value != '0,999999999');
            }else if(group == 'filterBrand'){
                if(page_name != 'BRND' && page_name != 'SIS'){
                    // Case) Not 브랜드관
                    isFilterApplied = (item.value != '');
                }
            }else{
                isFilterApplied = (item.value != '');
            }
        });

        $Que.render('FilterBtn', $QUI.Filter.COMP.FilterBtn(isFilterApplied));
    },100);

    // [exports] 모달 컨트롤
    const ui_modalControll = async function(type, id){
        function modalLayerClose(id) {
            const wrap = $(id);
            wrap.removeClass('is_visible');
            wrap.removeClass('is_active');
            //$('.custom_select_wrap').removeClass('is_active');

            // 남아있는 모달이 없는 경우 초기화
            if ($('.modal_wrap.is_visible').length == 0) {
                dimmHidden();
                $('.custom_select_wrap').removeClass('is_active');
                $('.option_list').hide();
            }

            if ($(".modal_wrap.is_visible").length == 0 ) $("html,body").removeClass("modalPop");
            $(".modal_bottomsheet .modal_content").scrollTop(0)
            $(".modal_content").scrollTop(0)
        }

        if(type == 'open'){
            $(id).css({ 'z-index': modalIdx++ });
            dimmVisible();
            $(id).addClass('is_visible is_active');
            setTimeout(()=>{
                toggleBrandFilter('open');
            }, 200);
        }else{
            await toggleBrandFilter('close');

            $(id).removeClass('is_visible');

            // 남아있는 모달이 없는 경우 초기화
            if ($('.modal_wrap.is_visible').length == 0) {
                dimmHidden();
                $("html,body").removeClass("modalPop");
            }
            modalLayerClose(id);
        }
    }

    // [exports] 브랜드 필터 토글
    const toggleBrandFilter = function(toggle){
        const $parent = document.querySelector('#filterModalBottomSheet .filterBrandModal');
        if($parent){
            const $title = $parent.querySelector('.tit_area.acc_header');
            const $brndList = $parent.querySelector('.brand_cont');
            if(toggle == 'open'){
                $brndList.style.display = 'block';
            }else{
                $brndList.style.display = 'none';
                $brndList.style.height = '0px';
                $title.classList.remove('is_active');
            }
        }
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.updateFilterForm = updateFilterForm;
    exp.updateFilterFormMultiple = updateFilterFormMultiple;
    exp.renewFilterParamToFilter = renewFilterParamToFilter;
    exp.resetFilter = resetFilter;
    exp.doResetFilter = doResetFilter;
    exp.clickGetFilterGods = clickGetFilterGods;
    exp.debouncedFilterBtnActive = debouncedFilterBtnActive;
    exp.ui_modalControll = ui_modalControll;
    exp.toggleBrandFilter = toggleBrandFilter;

})(window.$QUI.Filter);