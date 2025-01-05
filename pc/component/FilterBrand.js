((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.FilterBrand = () => {
        return  `
            <div class="cont" data-id="filterTab-02">
                <div class="search_wrap">
                    <h2 class="blind">검색</h2>
                    <div class="search_wrap">
                        <form action="" class="search_fillter_wrap">
                            <div class="search_tab_wrap">
                                <div class="search_input_wrap">
                                    <div class="search_header_wrap">
                                        <div class="input_clear search">
                                            <input id="searchInputText" type="text" title="브랜드를 검색하세요" placeholder="브랜드를 검색하세요." value="" onkeypress="javascript:if(event.keyCode == 13){$QUI.Filter.renderSearchBrand()}">
                                            <input type="text" style="display:none">
                                            <button type="button" class="clear_btn"><span class="blind">삭제</span></button>
                                        </div>
                                        <div class="filter_search_layer" data-que-component="FilterBrandSearchAuto">
                                        </div>
                                    </div>
                                </div>
    
                                <div class="search_brand_wrap tab_wrap1">
                                    <div class="tab_style7">
                                        <button id="en_brnd_tab" type="button" class="brandNavTab tab_btn is_active" data-tab="brandEnList" onclick="$QUI.Filter.clickBrandLangTab('brandEnList')">ABC</button>
                                        <button id="kr_brnd_tab" type="button" class="brandNavTab tab_btn" data-tab="brandKoList" onclick="$QUI.Filter.clickBrandLangTab('brandKoList')">ㄱㄴㄷ</button>
                                    </div>
                                    <div data-que-component="FilterBrandNavTab">
                                    </div>
                                </div>
    
                            </div>
                            <div class="search_result_wrap">
                                <!--선택된 브랜드 -->
                                <div class="search_txt_list type3 scroll mcus_scroll" data-que-component="FilterBrandSelectedResult">
                                </div>
                                
                                <!--브랜드 목록 -->
                                <div class="search_result_brand_wrap" data-que-component="FilterBrandResult">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    };

    exp.COMP.FilterBrandListItem = (brand) => {
        return `
            <li>
                <div class="checkbox form_list_check type1">
                    <input id="chk_${brand.brndId}" type="checkbox" name="filterBrndIds" 
                        value="${brand.brndId}"
                        data-brnd-nm="${brand.enName}"
                        data-brnd-nm-kor="${brand.krName}">
                    <label for="chk_${brand.brndId}">
                        <span class="tit">
                            <span>${brand.enName}</span>
                        </span>
                        <span class="value">${brand.krName}</span>
                    </label>
                </div>
            </li>
        `;
    };

    exp.COMP.FilterBrandResult = (lang, brandsResults, isNoData) => {
        return `
            ${isNoData == true ? `
                <div class="no_data" name="noSearchBrnd">
                    검색 결과가 없습니다.
                </div>
            ` : `
                <div class="auto_complete_wrap on">
                    <section id="brandEnList" class="tab_lang_wrap bPd0 ${lang == 'ENG' ? 'is_active' : ''}" data-tab="tab_e" style="display: ${lang == 'ENG' ? 'block' : 'none'}">
                        ${lang == 'ENG' ? `${brandsResults.map((brand) => $QUI.Filter.COMP.FilterBrandWordList(lang, brand)).join('')}` : ''}
                    </section>
                    <section id="brandKoList" class="tab_lang_wrap bPd0 ${lang == 'KOR' ? 'is_active' : ''}" data-tab="tab_k" style="display: ${lang == 'KOR' ? 'block' : 'none'}">
                        ${lang == 'KOR' ? `${brandsResults.map((brand) => $QUI.Filter.COMP.FilterBrandWordList(lang, brand)).join('')}` : ''}
                    </section>
                </div>
            `}
        `;
    }

    exp.COMP.FilterBrandWordList = (lang, {id, word, elems}) => {
        return `
            ${elems.length == 0 ? '' : `
            <section class="section_gap1 brndList_${lang}" data-start-word="${word}" id="${lang}_${id}">
                <p class="tit_brand">${word}</p>
                <ul>
                    ${elems.join('')}
                </ul>
            </section>
            `}
        `;
    };

    exp.COMP.FilterBrandNavTab = (lang, brandList) => {
        return `
            <div class="search_brand_lang_wrap ${lang == 'ENG' ? 'is_active' : ''}" data-lang-id="tab_e" >
                <div class="tab_style">
                    <div id="brandEnIndexChar">
                        ${lang == 'ENG' ? brandList.map((brand) => $QUI.Filter.COMP.FilterBrandNavTabBtn(lang, brand)).join('') : ''}
                    </div>
                </div>
            </div>
            <div class="search_brand_lang_wrap ${lang == 'KOR' ? 'is_active' : ''}" data-lang-id="tab_k" >
                <div class="tab_style">
                    <div id="brandKoIndexChar">
                        ${lang == 'KOR' ? brandList.map((brand) => $QUI.Filter.COMP.FilterBrandNavTabBtn(lang, brand)).join('') : ''}
                    </div>
                </div>
            </div>
        `;
    }

    exp.COMP.FilterBrandNavTabBtn = (lang, {id, word, elems}) => {
        return `
            <button type="button" data-target="${lang}_${id}" data-start-word="${word}" ${elems.length == 0 ? 'disabled' : ''}>${word}</button>
        `;
    }

    exp.COMP.FilterBrandSearchAuto = (data) => {
        return  `
            ${data.length > 0 ? `
                <ul class="mcus_scroll">
                    ${data.slice(0, 5).map(item=>$QUI.Filter.COMP.FilterBrandSearchResult(item.id, item.html)).join('')}
                </ul>
            ` : ''}
        `;
    };
    
    exp.COMP.FilterBrandSearchResult = (id, html) => {
        return `
            <li data-brnd-id="${id}" onclick="$QUI.Filter.renderSearchBrand('${id}')">
                ${html}
            </li>
        `;
    };
    
    exp.COMP.FilterBrandSelectedResult = (brandList) => {
        return `
            ${brandList.length > 0 ? `
                <div class="inner" name="filterTagDiv">
                    ${brandList.map(item => $QUI.Filter.COMP.FilterBrandSelectedResultItem(item.brndId, item.enName)).join('')}
                </div>
            ` : `
                <div class="no_data" name="noSelectBrnd">
                    선택한 브랜드가 없습니다.
                </div>
            `}
        `;
    };
    
    exp.COMP.FilterBrandSelectedResultItem = (id, name) => {
        return `
            <button type="button" class="search_txt_item" name="brandTag" data-brnd-id="${id}">
                <span class="option"><span>${name}</span></span><span class="btn_del" onclick="$QUI.Filter.unselectedBrand('${id}')"><span class="blind">지우기</span></span>
            </button>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // [exports](브랜드 목록) 브랜드 목록 초기화
    const initBrandFilter = async function(){
        showLoadingPopup2();
        const renderQueue = await pushRenderQueue();
        renderBrandList(renderQueue);
        hideLoadingPopup2();
    }

    // (브랜드 목록) 전체 브랜드 사전 조회 및 생성
    const makeBrandDict = async function(){
        const filterData = await $QFn.fetchData('POST', '/filter/v2/brandList', {mode:'CTGRY', code:'EQL'});
        const totalBrndDict = await mergeBrandList(filterData.brandList);
        $QFn.SESSION_STORAGE?.set('TOTAL_BRAND_DICTIONARY', totalBrndDict);
    }

    // (브랜드 목록) 국문/영문 데이터 병합
    const mergeBrandList = function({brndGroupList, brndKorGroupList}){
        const totalBrndDict = {};
        let count = 0;

        brndGroupList.forEach((brnd, enIdx) => {
            const krIdx = brndKorGroupList.findIndex(kor => kor.brndId === brnd.brndId);
            if (krIdx !== -1) {
                try {
                    const enWord = brnd.startWord || "123";
                    const krWord = brndKorGroupList[krIdx].startWord || "123";

                    totalBrndDict[brnd.brndId] = {
                        brndId: brnd.brndId,
                        enIdx: enIdx,
                        enWord: enWord,
                        enName: brnd.brndNm,
                        krIdx: krIdx,
                        krWord: krWord,
                        krName: brnd.brndNmKor
                    };
                    count++;
                } catch (error) {
                    console.warn(`💥${brnd.brndId}:${error}`);
                }
            }
        });
        totalBrndDict.metadata = {
            updated: new Date().getTime(),
            count: count
        };

        return totalBrndDict;
    }

    // (브랜드 목록) 세션 정보 바탕 -> 랜더링 큐 생성
    const pushRenderQueue = async function(){
        showLoadingPopup2();
        try {
            $QUI.Filter._renderQueue = [];

            let total_brnd_dict = $QFn.SESSION_STORAGE?.get('TOTAL_BRAND_DICTIONARY');
            if(!total_brnd_dict){
                await makeBrandDict();
                total_brnd_dict = $QFn.SESSION_STORAGE?.get('TOTAL_BRAND_DICTIONARY');
            }
    
            let filtering_brnd_list = $QFn.SESSION_STORAGE?.get('FILTERING_BRAND_LIST');
            if(!filtering_brnd_list){
                await $QFn.CTGRY.getFilterCount('CTGRY');
                filtering_brnd_list = $QFn.SESSION_STORAGE?.get('FILTERING_BRAND_LIST');
            }

            // 필터링된 브랜드 목록의 전체 정보를 랜더링 큐에 추가
            filtering_brnd_list.forEach(({brndId}) => {
                const brndInfo = total_brnd_dict[brndId];
                if(typeof brndInfo == 'undefined') return;

                $QUI.Filter._renderQueue.push(brndInfo);
            });
            return $QUI.Filter._renderQueue;
        } catch (error) {
            console.warn('⚡[queJS][ERROR] at pushRenderQueue...', error);
        } finally {
            hideLoadingPopup2();
        }
    }

    /**
     * [exports] 브랜드 목록 랜더링
     * @param {Array} paramQueue 랜더링 대상 브랜드 목록 
     */
    const renderBrandList = async function(paramQueue){
        console.groupCollapsed('⚡[BRAND_FILTER] Render');
        console.time('total');
        showLoadingPopup2();
        try {
            if(typeof paramQueue == 'undefined'){
                throw new Error('RenderQueue is undefined');
            }
            
            console.log(`render_count : ${paramQueue.length}`);
            sortRenderQueue(paramQueue);      // 현재 언어대로 정렬

            const langCd = getSearchLang();
            const renderHtmlList = await makeDOM_BrandList(langCd, paramQueue);

            const isNoData = renderHtmlList.every(item => item.elems.length === 0);
            $Que.render('FilterBrandResult', $QUI.Filter.COMP.FilterBrandResult(langCd, renderHtmlList, isNoData));
            $Que.render('FilterBrandNavTab', $QUI.Filter.COMP.FilterBrandNavTab(langCd, renderHtmlList));
            
            if(!isNoData){
                $.brandSticky();
                // 활성화된 첫번째 NavTab 클릭
                const $firstNavTab = document.querySelectorAll('.navTab.active');
                $firstNavTab[0]?.click();

                // 체크여부 일괄 업데이트
                batch_updateBrandCheckBox();
                // 선택된 브랜드 목록 업데이트
                updateSelectedBrandList();
            }
        } catch (error) {
            console.warn('⚡[queJS][ERROR] at renderBrandList...', error);
        } finally {
            hideLoadingPopup2();
            console.timeEnd('total');
            console.groupEnd();
        }
    }

    /**
     * 현재 언어에 맞게 큐 정렬
     * @param {Array} renderQueue 랜더링 대상 브랜드 목록 
     */
    const sortRenderQueue = function(renderQueue){
        console.time('sort');
        const langCd = getSearchLang();
        if(langCd == 'ENG'){
            renderQueue.sort((a, b) => a.enIdx - b.enIdx);
        }else{
            renderQueue.sort((a, b) => a.krIdx - b.krIdx);
        }
        console.timeEnd('sort');
    }

    /**
     * 랜더링 대상 브랜드 HTML 생성 및 랜더용 LIST PUSH
     * @param {String} langCd 현재 언어 코드
     * @param {Array} renderQueue 랜더링 대상 브랜드 목록 
     */
    const makeDOM_BrandList = async function(langCd, renderQueue){
        console.time('makeDOM');
        const RENDER_LIST = setDefaultRenderList(langCd);
        try {
            renderQueue.forEach((brand) => {
                try {
                    const word = langCd == 'ENG' ? brand.enWord : brand.krWord;
                    const html = $QUI.Filter.COMP.FilterBrandListItem(brand);
                    const minifiedHtml = $QFn.minifyHtml(html);
        
                    RENDER_LIST.find(item => item.word == word).elems.push(minifiedHtml);
                } catch (error) {
                }
            });
        } catch (error) {
            console.warn('⚡[queJS][ERROR] at makeDOM_BrandList...', error);
        }
        console.timeEnd('makeDOM');
        return RENDER_LIST;
    }

    const getSearchLang = function(){
        const $target = document.querySelector('.brandNavTab.is_active');
        const langCd = $target.getAttribute('data-tab') == 'brandEnList' ? 'ENG' : 'KOR';
        return langCd;
    }

    // 브랜드 체크박스 일괄 업데이트
    const batch_updateBrandCheckBox = function(){
        const formBrndStr = document.querySelector('#ctgryFilterParams [name="productBrand"]')?.value || '';
        let selectedBrands = formBrndStr ? formBrndStr.split(',') : [];
    
        // 기존 선택 초기화
        const $resetTargets = document.querySelectorAll('.auto_complete_wrap .checkbox input:checked');
        $resetTargets.forEach(item => {
            item.checked = false;
        });
    
        let cnt = 0;
        if(selectedBrands.length > 0){
            selectedBrands.forEach(brndId => {
                try {
                    const $checkTarget = document.querySelector(`.auto_complete_wrap .checkbox input#chk_${brndId}`);
                    if($checkTarget){
                        cnt++;
                        setTimeout(()=>{
                            $checkTarget.checked = true;
                        },100);
                    }
                } catch (error) {
                    console.warn(`⚡[queJS][ERROR] batch_updateBrandCheckBox : ${error}`);
                }
            });
        }
        console.log(`update Checkbox : ${cnt} of ${selectedBrands.length}`);
    }

    // [exports](브랜드 목록) 언어 탭 클릭
    const clickBrandLangTab = function(tabNm){
        const $parent = document.querySelector('.search_brand_wrap');
        const otherTabNm = tabNm == 'brandEnList' ? 'brandKoList' : 'brandEnList';
        
        const $target = $parent.querySelector(`.brandNavTab[data-tab="${tabNm}"]`);
        const $other = $parent.querySelector(`.brandNavTab[data-tab="${otherTabNm}"]`);
        $other.classList.remove('is_active');
        $target.classList.add('is_active');

        if($QUI.Filter._renderSearchQueue.length > 0){
            renderBrandList($QUI.Filter._renderSearchQueue);
        }else{
            renderBrandList($QUI.Filter._renderQueue);
        }
    }

    const setDefaultRenderList = function(langCd){
        if(langCd == 'ENG'){
            return [
                {id:"1",word:"A",elems:[]},
                {id:"2",word:"B",elems:[]},
                {id:"3",word:"C",elems:[]},
                {id:"4",word:"D",elems:[]},
                {id:"5",word:"E",elems:[]},
                {id:"6",word:"F",elems:[]},
                {id:"7",word:"G",elems:[]},
                {id:"8",word:"H",elems:[]},
                {id:"9",word:"I",elems:[]},
                {id:"10",word:"J",elems:[]},
                {id:"11",word:"K",elems:[]},
                {id:"12",word:"L",elems:[]},
                {id:"13",word:"M",elems:[]},
                {id:"14",word:"N",elems:[]},
                {id:"15",word:"O",elems:[]},
                {id:"16",word:"P",elems:[]},
                {id:"17",word:"Q",elems:[]},
                {id:"18",word:"R",elems:[]},
                {id:"19",word:"S",elems:[]},
                {id:"20",word:"T",elems:[]},
                {id:"21",word:"U",elems:[]},
                {id:"22",word:"V",elems:[]},
                {id:"23",word:"W",elems:[]},
                {id:"24",word:"X",elems:[]},
                {id:"25",word:"Y",elems:[]},
                {id:"26",word:"Z",elems:[]},
                {id:"27",word:"123",elems:[]}
            ]
        }else{
            return [
                {id:"1",word:"ㄱ",elems:[]},
                {id:"2",word:"ㄴ",elems:[]},
                {id:"3",word:"ㄷ",elems:[]},
                {id:"4",word:"ㄹ",elems:[]},
                {id:"5",word:"ㅁ",elems:[]},
                {id:"6",word:"ㅂ",elems:[]},
                {id:"7",word:"ㅅ",elems:[]},
                {id:"8",word:"ㅇ",elems:[]},
                {id:"9",word:"ㅈ",elems:[]},
                {id:"10",word:"ㅊ",elems:[]},
                {id:"11",word:"ㅋ",elems:[]},
                {id:"12",word:"ㅌ",elems:[]},
                {id:"13",word:"ㅍ",elems:[]},
                {id:"14",word:"ㅎ",elems:[]},
                {id:"15",word:"123",elems:[]}
            ]
        }
    }
    
    // 선택된 브랜드 목록 업데이트
    const updateSelectedBrandList = async function(){
        const selectedBrndLStr = document.querySelector('#ctgryFilterParams [name="productBrand"]')?.value || '';
        let selectedBrndList = selectedBrndLStr ? selectedBrndLStr.split(',') : [];
        
        if(selectedBrndList.length > 0){
            let total_brnd_dict = $QFn.SESSION_STORAGE?.get('TOTAL_BRAND_DICTIONARY');
            if(!total_brnd_dict){
                await makeBrandDict();
                total_brnd_dict = $QFn.SESSION_STORAGE?.get('TOTAL_BRAND_DICTIONARY');
            }
            const brandList = selectedBrndList.map(brndId => total_brnd_dict[brndId]);
            $Que.render('FilterBrandSelectedResult', $QUI.Filter.COMP.FilterBrandSelectedResult(brandList));
        }else{
            $Que.render('FilterBrandSelectedResult', $QUI.Filter.COMP.FilterBrandSelectedResult([]));
        }
    }

    // [exports]
    const unselectedBrand = async function(brndId) {
        await $QUI.Filter.updateFilterFormMultiple('productBrand', 'remove', brndId);
        await updateSelectedBrandList();
        batch_updateBrandCheckBox();
    }

    // (검색) 한글 자음만 검색 체크
    const isKorConsonant = function(str){
        const korConsonantDict = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
        return str.split('').every(char => korConsonantDict.includes(char));
    }

    // [exports](검색) 검색어(keyword) 검색 디바운싱
    const doSearchBrand = $QFn.debounce(function(event){
        const searchText = event.target.value;
        searchBrand(searchText);
    }, 50);

    // (검색) 검색어(keyword) 검색
    const searchBrand = function(keyword){
        let skip = false;
        if(keyword.length == 0) skip = true;

        if (isKorConsonant(keyword)) {
            skip = true;
        }
        
        const autoSearchResult = [];
        $QUI.Filter._renderSearchQueue = [];

        if(!skip){
            const patternHtml = new RegExp(`(${keyword}|${keyword.toUpperCase()}|${keyword.toLowerCase()})`, 'g');
            const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(keyword);
            const upperKeyword = keyword.toUpperCase();
        
            for(let i = 0; i < $QUI.Filter._renderQueue.length; i++) {
                const item = $QUI.Filter._renderQueue[i];
                try {
                    const brndNm = `${item.enName}${item.krName}`.toUpperCase();
                    if(brndNm.includes(upperKeyword)){
                        let html = isKorean ? item.krName.replace(patternHtml, "<em>$1</em>") : item.enName.replace(patternHtml, "<em>$1</em>");
                        autoSearchResult.push({id:item.brndId, html:html});
                        $QUI.Filter._renderSearchQueue.push(item);
                    }
                } catch (error) {
                    console.warn(`⚡[queJS][ERROR]searchBrand :: ${error}`, item);
                }
            }
        }

        // if(autoSearchResult.length == 0 || skip){
        //     ui_inputWordOff();
        // }
        $Que.render('FilterBrandSearchAuto', $QUI.Filter.COMP.FilterBrandSearchAuto(autoSearchResult));
    }

    // [exports](검색) 검색 결과 랜더링(Enter || 자동완성된 브랜드 선택)
    const renderSearchBrand = function(clickedBrndId) {
        if(typeof clickedBrndId == 'undefined'){
            // Enter 입력시 -> 전체 검색
            const keyword = document.querySelector('#searchInputText').value;
            if(keyword.length > 0){
                renderBrandList($QUI.Filter._renderSearchQueue);
            }else{
                renderBrandList($QUI.Filter._renderQueue);
            }
        }else{
            // 자동완성된 브랜드를 선택 했을 경우 -> 해당 브랜드 검색
            $QUI.Filter._renderSearchQueue = [];
            $QUI.Filter._renderSearchQueue.push($QUI.Filter._renderQueue.find(item => item.brndId == clickedBrndId));
            renderBrandList($QUI.Filter._renderSearchQueue);
        }
        ui_inputWordOff();
    }

    // (검색) 검색 초기화
    const resetSearch = function(){
        $QUI.Filter._renderSearchQueue = [];
        renderBrandList($QUI.Filter._renderQueue);
    }


    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp._renderQueue = [];
    exp._renderSearchQueue = [];
    
    exp.initBrandFilter = initBrandFilter;
    exp.renderBrandList = renderBrandList;
    exp.clickBrandLangTab = clickBrandLangTab;

    exp.doSearchBrand = doSearchBrand;
    exp.renderSearchBrand = renderSearchBrand;
    exp.unselectedBrand = unselectedBrand;

    /*
        =-=-=-=-=-= event =-=-=-=-=-=
    */
    // (검색) 검색창>검색어 Keyup
    $(document).on("keyup", "#searchInputText", $QUI.Filter.doSearchBrand);

    // (검색) 검색창>초기화 버튼 클릭
    $(document).on("click mousedown", ".input_clear .clear_btn", function() {
        resetSearch();
    });

    // (브랜드 목록) 체크박스 클릭
    $(document).on("click", ".auto_complete_wrap.on div.checkbox input", async function(event){
        event.stopPropagation();
        // 1. 클릭 처리는 자동
        // 2. ctgryParamFilter에 업데이트
        // 3. 선택한 브랜드 목록에 추가
        const $target = event.target.closest('input');
    
        if($target.checked == true){
            await $QUI.Filter.updateFilterFormMultiple('productBrand', 'add', $target.value);
        }else{
            await $QUI.Filter.updateFilterFormMultiple('productBrand', 'remove', $target.value);
        }
    
        await updateSelectedBrandList();
    });

})(window.$QUI.Filter);