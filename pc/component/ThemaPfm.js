((exp)=>{
    /*
        테마관>퍼포먼스관 컴포넌트
    */
    $QUI.Pfm = $QUI.Pfm || {};
	$QUI.Pfm.COMP = $QUI.Pfm.COMP || {};
    
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.Md26NaviTop = ({depthArr, godCnt, desc}) => {
        if(depthArr.length == 0) return '';

        return  `
            <div class="pfm_product_top">
                <h4>
                    <span class="depth">${depthArr.map(item => `<span>${item.engName}</span>`).join('')}</span>
                    <span class="num">(+${godCnt})</span>
                </h4>
                ${desc == null || desc == '' ? '' : `
                    <div class="category_desc">${desc}</div>
                `}
            </div>
        `;
    };
    
    exp.COMP.Md26Ctgry = ({data, selectedNo, depth}) => {
        return  `
            <ul class="category_depth1">
                ${data.map(item => $QUI.Pfm.COMP.Md26CtgryItem({item:item, selectedNo:selectedNo, depth:depth})).join('')}
            </ul>
        `;
    };

    /**
     * [컴포넌트] ThemaPfm 개별 아이템
     * @param {Object} item 뎁스 데이터
     * @param {String} selectedNo 현재 조회중인 번호
     * @param {Number} depth 현재 뎁스
     * @returns {String} 카테고리 아이템 HTML
     */
    exp.COMP.Md26CtgryItem = ({item, selectedNo, depth}) => {
        // 4뎁스가 아닌 경우에만 ALL 카테고리 스킵
        if(item.no === item.upperNo && Number(item.depth) !== 4) return '';
        
        const isActive = isPartOf(selectedNo, item.no, depth);
        const hasChild = (item.children?.length > 0);
        const name = (item.no === item.upperNo && Number(item.depth) === 4) ? 'ALL' : item.engName;
        const cnt = item.cnt || 0;

        let isLeafDepth = (depth+1 == 3 && hasChild && isActive);

        let childrenHtml = '';
        if(isLeafDepth){
            const newChildren = Array.isArray(item.children) ? [...item.children] : [];
            const newItem = JSON.parse(JSON.stringify(item));
            newItem.name = '전체';
            newItem.engName = 'ALL';
            newChildren.unshift(newItem);

            childrenHtml = `
                <ul class="category_depth${depth+1}">
                    ${newChildren.map(child => $QUI.Pfm.COMP.Md26CtgryItem({item:child, selectedNo:selectedNo, depth:depth+1})).join('')}
                </ul>
            `;
        }else if(hasChild && isActive){
            childrenHtml = `
                <ul class="category_depth${depth+1}">
                    ${item.children.map(child => $QUI.Pfm.COMP.Md26CtgryItem({item:child, selectedNo:selectedNo, depth:depth+1})).join('')}
                </ul>
            `;
        }

        return `
            <li class="${isActive && depth+1 < 4 ? 'active' : ''}">
                <button data-dsp-ctgry-no="${item.no}" data-depth-cd="${item.depth}" onclick="$QUI.Pfm.clickMd26Ctgry(event)">
                    <span>${name}</span>
                    <em>(${cnt})</em>
                </button>
                ${childrenHtml}
            </li>
        `;
    };

    // 클릭시 최초 렌더링
    exp.COMP.Md22BrandResult = (renderBrandsArr, totalBrandsLength, currentLetter = '') => {
        if (!renderBrandsArr || renderBrandsArr.length === 0) {
            return `
                <div class="no_data">Stay tuned for more brand updates!</div>
            `;
        }
        
        return `
            <ul>
                ${renderBrandsArr.map(brand => $QUI.Pfm.COMP.Md22BrandResultItem(brand)).join('')}
            </ul>
            ${totalBrandsLength > ITEM_PER_PAGE ? `
            <div class="btn_big_wrap medium">
                <button type="button" class="white view-more-btn" 
                    data-current-page="1"
                    data-now-index="${renderBrandsArr.length}"
                    data-current-letter="${currentLetter}"
                    onclick="$QUI.Pfm.loadMoreBrands(this)">
                    View more
                </button>
            </div>
            ` : ''}
        `;
    };

    exp.COMP.Md22BrandResultItem = (brand) => {
        const isOffBrand = brand.offBrndYn === 'Y';
        return `
            <li class="${isOffBrand ? 'store' : ''}">
                <a class="brand_name" href="/brands/main?brndCategoryNumber=${brand.dspCtgryNo}">
                    ${brand.brndNm}
                </a>
                <span class="sync-brnd-god-cnt" data-sync-state="wait" data-brnd-id="${brand.brndId}" data-sync-format="(data)"></span>
            </li>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    /**
     * 현재 뎁스가 파라미터로 전달된 뎁스의 하위 뎁스인지 확인
     * @param {String} selectedNo 현재 조회중인 번호
     * @param {String} parentNo 상위 뎁스 번호
     * @param {Number} nowDepth 현재 뎁스
     * @returns {Boolean} 현재 뎁스가 파라미터로 전달된 뎁스의 하위 뎁스인지 여부
     */
    const isPartOf = function(selectedNo, parentNo, nowDepth){
        const componentDepth = Number(nowDepth) * 3;
        let result = false;

        if(parentNo?.length === componentDepth){
            result = (selectedNo === parentNo);
        }else{
            result = selectedNo.startsWith(parentNo);
        }
        
        return result;
    };

    /**
     * 카테고리 클릭 이벤트
     * @param {Event} event 이벤트 객체
     * @description 클릭한 버튼의 데이터를 추출하여 랜더링 함수를 호출
     */
    const clickMd26Ctgry = function(event){
        event.stopPropagation();
        const $eventTarget = event.target?.closest('button');
        const no = $eventTarget?.dataset.dspCtgryNo;
        const name = $eventTarget?.querySelector('span').textContent;
        const depthCd = Number($eventTarget?.dataset.depthCd || 0);

        let isALL = (depthCd == 3 && name == 'ALL');
        
        // 펼쳐져있는 카테고리 클릭시, 렌더링 작업 중단
        const isFolded = toggleCategoryFold(no, depthCd, $eventTarget);
        if (isFolded) {
            return;
        }
        
        // 클릭 시 모든 active 클래스 제거
        cleanUpActiveClass();
        renderMd26Ctgry(no);
        
        // 4뎁스 카테고리인 경우 추가 처리
        if(depthCd === 4 || isALL) {
            $QUI.Lnb.renderLnb(no.substr(0,12));
            const data = $QFn.findNodeInHierarchy(no.substr(0,12), $QUI.Lnb._lnbData);
            $QUI.Lnb.renderLnbDepth4(data, no);

            renderMd26NaviTop(no);
            $QFn.CTGRY.updateForm({selectCtgryNo:no,page:1,back:'N'}, 'getList', 'reset');
            ModalOpen('#ModalProductList');
        }
    };

    /**
     * 모든 active 클래스 제거
     */
    const cleanUpActiveClass = function() {
        const $target = document.querySelector('[data-que-component="PfmMd26Ctgry"]');
        if(!$target) return;
        
        const activeElements = $target.querySelectorAll('.active');
        activeElements.forEach(el => {
            el.classList.remove('active');
        });
    };

    /**
     * 카테고리 접기/펼치기 토글 기능
     * @param {String} no 카테고리 번호
     * @param {Number} depthCd 카테고리 뎁스
     * @param {HTMLElement} $eventTarget 클릭한 버튼 요소
     * @returns {Boolean} 접힌 상태로 변경된 경우 true, 펼친 상태로 변경된 경우 false
     */
    const toggleCategoryFold = function(no, depthCd, $eventTarget){
        // false : 펼침 상태로 변경됨
        // true : 접힘 상태로 변경됨

        // 클릭한 버튼 요소 확인
        if(!$eventTarget) {
            return false;
        }
        
        // ALL 카테고리 여부 확인 (4뎁스에 있는 ALL 카테고리는 특별 처리)
        const name = $eventTarget.querySelector('span')?.textContent;
        if(name === 'ALL' && depthCd === 4) {
            return false; // 4뎁스 ALL 카테고리는 접기 기능 적용하지 않음
        }
        
        // 2. li가 이미 active 클래스를 가지고 있는지 확인
        const $parent = $eventTarget.closest('li');
        if(!$parent) {
            return false;
        }

        // 3. 이미 active 상태인 경우 (펼쳐진 상태)
        const isActive = $parent.classList.contains('active');
        if(isActive) {
            // active 클래스 제거하여 접기
            $parent.classList.remove('active');
            return true;
        }
        return false;
    };

    /**
     * Md26 카테고리 뎁스 렌더링
     * @param {String} no 현재 조회중인 번호
     */
    const renderMd26Ctgry = function(no){
        // 데이터 찾기
        let data = $QUI.Lnb._lnbData[0].children;
        if(!data || !data.length) return;

        $Que.render('PfmMd26Ctgry', $QUI.Pfm.COMP.Md26Ctgry({data:data, selectedNo:no, depth:1}));
    };
    
    /**
     * 퍼포먼스관 Md26 상단 현재 네비게이션 카테고리 랜더링
     * @param {String} no 현재 조회중인 번호 
     */
    const renderMd26NaviTop = function(no){
        const nowDepth = $QFn.findNodeInHierarchy(no, $QUI.Lnb._lnbData);
        const depthArr = $QFn.findUpperNodeArray(no, $QUI.Lnb._lnbData);
        const displayDepth = depthArr.slice(2);     // 마지막 두개 뎁스만 추출

        // 설명은 3뎁스로 출력
        $Que.render('PfmNaviTop', $QUI.Pfm.COMP.Md26NaviTop({depthArr:displayDepth, godCnt:nowDepth.cnt, desc:displayDepth[0]?.desc}));
    }

    const ITEM_PER_PAGE = 999;       // 페이지당 표시 개수

    /**
     * 브랜드 데이터 초기화 및 그룹화
     * @param {Object} data 브랜드 데이터 객체
     */
    const initThemaPfmTab = function(data) {
        try {
            if (!data) {
                console.warn('⚡[queJS][ERROR] Invalid brand data format');
                return;
            }
            
            // 알파벳별로 브랜드 그룹화
            groupBrandsByLetter(data);

            toggleBrandResultType('manual');    // 수동 지정 영역을 기본으로 보여줌
            syncBrndGodCnt();   // Sync : 브랜드별 상품 개수 싱크
        } catch (error) {
            console.warn('⚡[queJS][ERROR] at initThemaPfmTab...', error);
        }
    };

    /**
     * 브랜드 데이터를 알파벳별로 그룹화
     * @param {Array} brands 브랜드 데이터 배열
     */
    const groupBrandsByLetter = function(brands) {
        $QUI.Pfm._brandGroups = {};
        
        // A-Z까지 빈 배열로 초기화
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            $QUI.Pfm._brandGroups[letter] = [];
        }
        
        // 숫자 그룹 초기화
        $QUI.Pfm._brandGroups['123'] = [];
        
        // 브랜드 데이터 그룹화
        brands.forEach(brand => {
            if (!brand.brndNm) return;
            $QUI.Pfm._brandGroups[brand.startWord].push(brand);
        });
    };

    /**
     * 알파벳 버튼 클릭 이벤트
     * @param {Event} event 이벤트 객체
     */
    const clickBrandNaviLetter = function(event) {
        event.preventDefault();
        const letter = event.target.dataset.letter;
        if (!letter) return;
        
        if (letter === 'manual') {
            toggleBrandResultType('manual');
            return;
        }
        
        // 선택된 알파벳에 해당하는 브랜드 렌더링
        toggleBrandResultType('word');
        renderThemaPfmTabByLetter(letter);
        syncBrndGodCnt();   // Sync : 브랜드별 상품 개수 싱크
    };

    /**
     * 브랜드 결과 영역 전환
     * @param {String} type 
     */
    const toggleBrandResultType = function(type){
        const $manual = document.querySelector('.manual_brand_list');
        const $word = document.querySelector('.word_brand_list');
        if(type == 'manual'){
            $manual.style.display = 'block';
            $word.style.display = 'none';
        }else{
            $manual.style.display = 'none';
            $word.style.display = 'block';
        }
    }

    /**
     * 더 많은 브랜드 로드
     * @param {HTMLElement} button 클릭된 버튼 요소
     */
    const loadMoreBrands = function(button) {
        if (!button) return;
        
        // 버튼의 dataset에서 정보 가져오기
        const nowIndex = parseInt(button.dataset.nowIndex, 10) || 0;
        const currentPage = parseInt(button.dataset.currentPage, 10) || 1;
        const currentLetter = button.dataset.currentLetter || '';
        
        if (!currentLetter) return;
        
        const nextPage = currentPage + 1;
        const brandsInLetter = $QUI.Pfm._brandGroups[currentLetter] || [];
        
        // 다음 페이지에 표시할 브랜드 계산
        const endIndex = Math.min(nowIndex + ITEM_PER_PAGE, brandsInLetter.length);
        const nextBrands = brandsInLetter.slice(nowIndex, endIndex);
        
        if (nextBrands.length === 0) return;
        
        // 브랜드 목록에 추가
        const $ul = document.querySelector('[data-que-component="Md22BrandResult"] ul');
        if ($ul) {
            $ul.insertAdjacentHTML('beforeend', nextBrands.map(brand => $QUI.Pfm.COMP.Md22BrandResultItem(brand)).join(''));
            
            button.dataset.currentPage = nextPage;
            button.dataset.nowIndex = nowIndex + nextBrands.length;
            
            if (endIndex >= brandsInLetter.length) {
                button.closest('.btn_big_wrap').style.display = 'none';
            }

            syncBrndGodCnt();   // Sync : 브랜드별 상품 개수 싱크
        }
    };

    /**
     * 선택된 알파벳에 해당하는 브랜드 렌더링
     */
    const renderThemaPfmTabByLetter = function(letter) {
        if (!letter) return;
        
        // 전역 변수에서 브랜드 그룹 가져오기
        const brandsInLetter = $QUI.Pfm._brandGroups[letter] || [];
        const renderBrandsArr = brandsInLetter.slice(0, ITEM_PER_PAGE) || [];   // 최초 렌더링 시 10개까지만
        
        // 브랜드 목록 렌더링
        $Que.render('Md22BrandResult', $QUI.Pfm.COMP.Md22BrandResult(renderBrandsArr, brandsInLetter.length, letter));
    };

    // 브랜드 ID 대상 캡쳐
    const captureSyncBrndTarget = function(){
        const $syncTargets = document.querySelectorAll('.sync-brnd-god-cnt[data-sync-state="wait"]');
        const brndIdList = [];
        
        // 전체 요소 대상
        $syncTargets.forEach($target => {
            // 데이터 속성에서 브랜드 ID 가져오기
            const brndId = $target.dataset.brndId;
            if(brndId) {
                // 대기 상태로 설정
                $target.dataset.syncState = 'pending';
                brndIdList.push(brndId);
            }
        });

        return brndIdList;
    }

    // [exports] 브랜드별 상품 개수 동기화
    const syncBrndGodCnt = async function(){
        const chunkSize = 20;
        const brndIdList = captureSyncBrndTarget();
        console.log(`⚡[PfmBrandSync] syncBrndGodCnt : ${brndIdList.length}`);

        if(brndIdList.length === 0) return;

        for(let i = 0; i < brndIdList.length; i+=chunkSize){
            const dividedList = brndIdList.slice(i, i+chunkSize);
            await processBrndGodCnt(dividedList);
        }

        // 결과가 없는 요소들은 0으로 처리
        updateRemainingElements();
    }

    // 브랜드별 상품 개수 결과값 처리 -> fetch + update DOM
    const processBrndGodCnt = async function(brndIdList){
        try {
            const response = await $QFn.fetchData("POST", "/sync/v2/brndGodCnt", {brndIds: brndIdList, mType:'PERFORMANCE'});
            
            if(response.resultCd === 'SUCCESS' && response.result.length > 0){
                // 결과가 있는 경우 각 항목 업데이트
                response.result.forEach(item => {
                    try {
                        const $targets = document.querySelectorAll(`.sync-brnd-god-cnt[data-brnd-id="${item.BRND_ID}"][data-sync-state="pending"]`);
                        if($targets && $targets.length > 0){
                            $targets.forEach($target => {
                                updateBrndSync($target, item.GOD_CNT || 0);
                            });
                        }
                    } catch (error) {
                        console.warn(`⚡[queJS] Failed to update brand count -- ${error}`);
                    }
                });
            } else {
                // 결과가 없는 경우 모든 대상을 0으로 설정
                brndIdList.forEach(brndId => {
                    const $targets = document.querySelectorAll(`.sync-brnd-god-cnt[data-brnd-id="${brndId}"][data-sync-state="pending"]`);
                    if($targets && $targets.length > 0){
                        $targets.forEach($target => {
                            updateBrndSync($target, 0);
                        });
                    }
                });
                console.warn(`⚡[queJS] No brand count data found or error occurred -- ${response.resultMsg}`);
            }
        } catch (error) {
            console.error(`⚡[queJS] Failed to processBrndGodCnt -- ${error}`);
            // 오류 발생 시 모든 대상을 0으로 설정
            brndIdList.forEach(brndId => {
                const $targets = document.querySelectorAll(`.sync-brnd-god-cnt[data-brnd-id="${brndId}"][data-sync-state="pending"]`);
                if($targets && $targets.length > 0){
                    $targets.forEach($target => {
                        updateBrndSync($target, 0);
                    });
                }
            });
        }
    }

    // 브랜드 상품 개수 업데이트
    const updateBrndSync = function($dom, godCnt){
        try {
            const format = $dom.dataset.syncFormat;
            let text = '';
            if(format){
                text = format.replace('data', $QFn.addCommas(godCnt));
            }else{
                text = $QFn.addCommas(godCnt);
            }
            $dom.textContent = text;
            $dom.dataset.syncState = 'done';
        } catch (error) {
            console.warn(`⚡[queJS] Failed to updateBrndSync -- ${error}`);
            $dom.textContent = '(0)';
            $dom.dataset.syncState = 'error';
        }
    }

    // 남은 요소들 0으로 처리
    const updateRemainingElements = function(){
        const $pendingTargets = document.querySelectorAll(`.sync-brnd-god-cnt[data-sync-state="pending"]`);
        
        if($pendingTargets && $pendingTargets.length > 0){
            console.log(`⚡[queJS] Setting remaining elements to 0: ${$pendingTargets.length}`);
            
            // 처리되지 않은 항목 0으로 설정
            $pendingTargets.forEach($target => {
                $target.textContent = '(0)';
                $target.dataset.syncState = 'done';
            });
        }
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.renderMd26Ctgry = renderMd26Ctgry;
    exp.clickMd26Ctgry = clickMd26Ctgry;
    exp.renderMd26NaviTop = renderMd26NaviTop;

    exp.initThemaPfmTab = initThemaPfmTab;
    exp.clickBrandNaviLetter = clickBrandNaviLetter;
    exp.loadMoreBrands = loadMoreBrands;

    exp.syncBrndGodCnt = syncBrndGodCnt;

})($QUI.Pfm = $QUI.Pfm || {});