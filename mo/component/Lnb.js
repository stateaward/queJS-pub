((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.Lnb = ({data, selectedNo, depth}) => {
        // SNB : 뎁스 2 / 일반 : 뎁스 3
        return  `
            <div class="tab_style1">
                ${data.map(item => $QUI.Lnb.COMP.LnbItem({item:item, selectedNo:selectedNo, depth:depth})).join('')}
            </div>
        `;
    };

    /**
     * [컴포넌트] Lnb 헤더의 Wrapper
     * @param {Object} data 뎁스 데이터
     * @param {String} selectedNo 현재 조회중인 번호
     * @returns {String} 메인 뎁스 랜더링 HTML
     */
    exp.COMP.LnbTop = ({data, selectedNo}) => {
        // 0뎁스(EQL) 부터 시작
        const newItem = {
            "no": "EQL",
            "name": "전체",
            "engName": "ALL",
            "depth": "1"
        };
        
        const newData = [...data];
        newData.unshift(newItem);

        return `
            <div class="tab_style1">
                ${newData.map(item => $QUI.Lnb.COMP.LnbItem({item:item, selectedNo:selectedNo, depth:1})).join('')}
            </div>
        `;
    };

    /**
     * [컴포넌트] Lnb 헤더의 개별 버튼
     * @param {Object} item 뎁스 데이터
     * @param {String} selectedNo 현재 조회중인 번호
     * @returns {String} 메인 뎁스 랜더링 HTML
     */
    exp.COMP.LnbItem = ({item, selectedNo, depth}) => {
        if(Object.values($QUI.Lnb._excludeDict).includes(item.no)) return '';

        const isActive = isPartOf(selectedNo, item.no, depth);
        const hasChild = (item.children?.length > 0);

        if(isActive && hasChild){
            renderLnbDepth(depth+1, selectedNo);
        }
        
        let name = '';
        if($QUI.Lnb._lnbLang == 'KOR'){
            name = (item.no === item.upperNo) ? '전체' : item.name;
        }else{
            name = (item.no === item.upperNo) ? 'ALL' : item.engName;
            if(name == null || name == '') name = item.name;
        }
        
        return `
            <button type="button" class="tab_btn ctgry ${isActive ? 'is_active' : ''}"
                data-dsp-ctgry-no="${item.no}"
                data-depth-cd="${item.depth}"
                data-sort="${item.sort}"
                onclick="$QUI.Lnb.clickLnb(event)"
            >${name}
            </button>
        `;
    };

    exp.COMP.LnbDepth = ({data, selectedNo, nowDepth}) => {
        return `
            <div class="tab_depth is_active">
                <div class="tab_sub no_scr is_active">
                    ${data.children.map(child => $QUI.Lnb.COMP.LnbDepthItem({item:child, selectedNo:selectedNo, nowDepth})).join('')}
                </div>
            </div>
        `;
    };
    
    exp.COMP.LnbDepthItem = ({item, selectedNo, nowDepth}) => {
        const isActive = isPartOf(selectedNo, item.no, nowDepth);
        const hasChild = (item.children?.length > 0);
    
        if(isActive && hasChild && nowDepth < 4){
            renderLnbDepth(nowDepth+1, selectedNo);
        }
        
        let name = '';
        if($QUI.Lnb._lnbLang == 'KOR'){
            name = (item.no === item.upperNo) ? '전체' : item.name;
        }else{
            name = (item.no === item.upperNo) ? 'ALL' : item.engName;
            if(name == null || name == '') name = item.name;
        }

        return `
            <button type="button" class="tab_btn ctgry ${isActive ? 'is_active' : ''}" data-dsp-ctgry-no="${item.no}" data-depth-cd="${item.depth}" data-sort="${item.sort}" onclick="$QUI.Lnb.clickLnb(event)">${name}</button>
        `;
    };

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    /**
     * [exports] 현재 뎁스가 파라미터로 전달된 뎁스의 하위 뎁스인지 확인
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
     * Lnb 클릭 이벤트
     * @param {Event} event 이벤트 객체
     * @description 클릭한 버튼의 데이터를 추출하여 메인 뎁스 랜더링 함수를 호출 + URL 파라미터 업데이트
     */
    const clickLnb = function(event){
        event.stopPropagation();
        const $eventTarget = event.target?.closest('button');
        const no = $eventTarget?.dataset.dspCtgryNo;
        const depthCd = Number($eventTarget?.dataset.depthCd);
        
        renderLnb(no);

        const {page_name} = $QFn.getCurrentInfo();
        if(page_name == 'GENERAL'){
            // 일반 카테고리만 모달영역 랜더링
            $QUI.Lnb.renderModal(no);
        }

        const sortCd = setSort($eventTarget);

        if(page_name == 'REVIEW'){
            $QFn.CTGRY.updateForm({selectCtgryNo:no,sort:sortCd,page:1,back:'N'}, 'none');
            $QFn.CTGRY.getReviewList();
        }else{
            $QFn.CTGRY.updateForm({selectCtgryNo:no,sort:sortCd,page:1,back:'N'}, 'getList', 'reset');
        }

        // [GA4] 트래킹 : 페이지뷰 + 맞춤 이벤트
        ga4_tracking(no);
    };

    /**
     * Lnb 랜더링하는 메인 함수
     * @param {String} no 현재 조회중인 번호
     */
    const renderLnb = function(no){
        const {page_name, mGubun} = $QFn.getCurrentInfo();
        const $target = document.querySelector('[data-que-component="LnbDepthTop"]');

        cleanUpLnbDepth();
        if(mGubun == 'CTGRY' && $QUI.Lnb._startDepth == 1){
            if(page_name == 'GENERAL'){
                const searchNo = no.substr(0, 9);
                const tempData = $QFn.findNodeInHierarchy(searchNo, $QUI.Lnb._lnbData);
                $target.innerHTML = $QUI.Lnb.COMP.Lnb({data:tempData.children, selectedNo:no, depth:3});
            }else{
                $target.innerHTML = $QUI.Lnb.COMP.Lnb({data:$QUI.Lnb._lnbData[0].children, selectedNo:no, depth:2});
            }
        }else{
            if(page_name == 'PERFORMANCE'){
                $target.innerHTML = $QUI.Lnb.COMP.Lnb({data:$QUI.Lnb._lnbData[0].children, selectedNo:no, depth:2});
                $QUI.Pfm.renderMd26NaviTop(no);
            }else{
                // 1뎁스(전체, 맨, 우먼, 라이프) 시작
                $target.innerHTML = $QUI.Lnb.COMP.LnbTop({data:$QUI.Lnb._lnbData, selectedNo:no});
            }
        }

        const $scrollTarget = $target.querySelector('.tab_style1 .tab_btn.is_active');
        ui_tabScroll($scrollTarget);
    }

    /**
     * 하위 뎁스 랜더링
     * @param {Number} targetDepth 랜더링 할 뎁스
     * @param {String} selectedNo 현재 조회중인 번호
     */
    const renderLnbDepth = function(targetDepth, selectedNo){
        cleanUpLnbDepth();

        const $target = document.querySelector(`[data-que-component="LnbDepth"][data-que-depth="${targetDepth}"]`);
        const searchNo = selectedNo.substr(0, targetDepth * 3);
        const lnbData = $QFn.findNodeInHierarchy(searchNo, $QUI.Lnb._lnbData);

        const html = $QUI.Lnb.COMP.LnbDepth({data:lnbData, selectedNo:selectedNo, nowDepth:targetDepth});
        $target.innerHTML = html;

        const $scrollTarget = $target.querySelector('.tab_depth .tab_btn.is_active');
        ui_tabScroll($scrollTarget);
    }


    /**
     * 하위 뎁스를 모두 제거(Clean Up)
     */
    const cleanUpLnbDepth = function(){
        const $target = document.querySelectorAll(`[data-que-component="LnbDepth"]`);
        $target.forEach(($item)=>{
            $item.innerHTML = '';
        });
    }

    const ui_tabScroll = function($tab){
        const scrollL = $tab.offsetLeft - (window.outerWidth - $tab.offsetWidth)/2;
        $tab.parentElement.scroll({top:0, left:scrollL, behavior:'auto'});
    }

    // [exports] 정렬 셋팅
    const setSort = function($eventTarget){
        // 기본 정렬값 셋팅
        const defaultsort = document.querySelector('#ctgryNonParams [name="defaultSort"]')?.value;
        let sortCd = '';
        if(defaultsort == 'LNB'){
            const lnbSortCd = $eventTarget?.dataset.sort;
            sortCd = $QUI.Sort.initSort(lnbSortCd);
        }else if(defaultsort == 'NONE') {
            sortCd = '';
        }else{
            sortCd = $QUI.Sort.initSort(defaultsort);
        }

        return sortCd;
    }

    // [exports] GA4 트래킹 : 페이지뷰 + 맞춤 이벤트
    /**
     * 
     * @param {string} selectNo : 조회하는 카테고리 번호
     * @param {string} eventType : 이벤트 전송 여부
     */
    const ga4_tracking = function(selectNo, eventType = 'EVENT_SEND', isSkipVirPageView = false){
        try {
            const depthArr = $QFn.findUpperNodeArray(selectNo, $QUI.Lnb._lnbData);
            const depthNames = depthArr.map(item => {return item.name});
            
            if(!depthNames) throw new Error('[GA4] No Category Depth');
            if(selectNo == 'EQL' && depthNames.length == 0){
                depthNames.push('전체');
            }
            
            const refererDepth = $QFn.GA.updateDomGA(depthNames);        // 현재 카테고리명을 DOM에 기록
            
            let isPageView = false;   // PageView 대상 체크
            const {page_name} = $QFn.getCurrentInfo();
            switch(page_name){
                case 'NEW':
                    depthNames.unshift('신상품');
                    isPageView = true;
                    break;
                case 'BEST':
                    depthNames.unshift('베스트');
                    isPageView = true;
                    break;
                case 'SNB':
                case 'GENERAL':
                    isPageView = true;
                    break;
                default:
                    // 그 외 페이지는 LNB 이동 시 페이지뷰 전송 X
                    isPageView = false;
                    break;
            }

            // [PageView]
            let isSendVirPageView = false;     // 가상페이지뷰 전송 대상
            if(isPageView == true){
                if(GA4.isInit() == false){
                    GA4.init(depthNames);
                    isSendVirPageView = false;
                }else{
                    isSendVirPageView = true;
                }
                $QFn.GA.flushGA4();
            }
            
            // [Event]
            if(eventType == 'NO_EVENT_SEND'){
            }else if(eventType == 'LNB_MODAL'){
                const {category, label} = $QFn.GA.getEvnetParam('LNB', depthNames, refererDepth);
                GA4.EVENT.set(category, 'Navigation', label);
            }else{
                const {category, action, label} = $QFn.GA.getEvnetParam('LNB', depthNames, refererDepth);
                GA4.EVENT.set(category, action, label);
            }

            // [PageView] 시점 조정
            if(isSendVirPageView == true && isSkipVirPageView == false){
                // LNB 이동 : 가상페이지뷰 전송
                const virUrl = location.pathname + location.search;
                GA4.PAGEVIEW.setVirtualObj(depthNames, virUrl);
            }
        } catch (error) {
            console.warn(`⚡[queJS][GA4] Failed to ga4_tracking `, error);
        }
    }

    /*
        =-=-=-=-=-= exports =-=-=-=-=-=
    */
    exp.renderLnb = renderLnb;
    exp.clickLnb = clickLnb;
    exp.isPartOf = isPartOf;
    exp.setSort = setSort;
    exp.ga4_tracking = ga4_tracking;

    exp._lnbData = [];
    exp._startDepth = 0;
    exp._excludeDict = {};
    exp._lnbLang = 'KOR';

})(window.$QUI.Lnb);