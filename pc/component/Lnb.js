((exp)=>{
    /*
        =-=-=-=-=-= component =-=-=-=-=-=
    */
    exp.COMP.Lnb = ({data, selectedNo}) => {
        const newItem = {
            "no": data[0]?.no.substr(0,6),
            "name": "전체",
            "engName": "ALL",
            "depth": data[0].depth,
            "sort": data[0].sort || null
        };
        
        const newData = [...data];
        newData.unshift(newItem);
    
        return  `
            <ul class="left_menu">
                ${newData.map(item => $QUI.Lnb.COMP.LnbDepth2({item:item, selectedNo:selectedNo})).join('')}
            </ul>
        `;
    };
    
    exp.COMP.LnbTop = ({data, selectedNo}) => {
        // 0뎁스(EQL) 부터 시작
        const newItem = {
            "no": "EQL",
            "name": "전체",
            "engName": "ALL",
            "depth": "1",
            "sort": null
        };
        
        const newData = [...data];
        newData.unshift(newItem);
    
        return  `
            <ul class="left_menu">
                ${newData.map(item => $QUI.Lnb.COMP.LnbDepth1({item:item, selectedNo:selectedNo})).join('')}
            </ul>
        `;
    };
        

    /*
        =-=-=-=-=-= private =-=-=-=-=-=
    */
    // [exports]
    const isPartOf = (selectedNo, parentNo, nowDepth) => {
        const componentDepth = Number(nowDepth) * 3;
        let result = false;

        if(parentNo?.length === componentDepth){
            result = (selectedNo === parentNo);
        }else{
            result = selectedNo.startsWith(parentNo);
        }
        return result;
    };

    // [exports]
    const clickLnb = function(event){
        event.stopPropagation();
        const $eventTarget = event.target?.closest('li');
        const no = $eventTarget?.dataset.dspCtgryNo;
        const depthCd = Number($eventTarget?.dataset.depthCd);
        
        renderLnb(no);

        if(depthCd === 3 && no.length >= 12){
            // 4depth 생성
            const data = $QFn.findNodeInHierarchy(no, $QUI.Lnb._lnbData);
            renderLnbDepth4(data, no);
        }else{
            // 4depth 삭제
            const $target = document.querySelector('[data-que-component="LnbDepth4"]');
            $target.innerHTML = '';
        }

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

        const {page_name} = $QFn.getCurrentInfo();
        if(page_name == 'REVIEW'){
            $QFn.CTGRY.updateForm({selectCtgryNo:no,sort:sortCd,page:1,back:'N'}, 'none');
            $QFn.CTGRY.getReviewList();
        }else{
            $QFn.CTGRY.updateForm({selectCtgryNo:no,sort:sortCd,page:1,back:'N'}, 'getList', 'reset');
        }

        // [GA4] 페이지뷰 전송
        ga4_tracking(no);
    };

    // [exports]
    const renderLnb = function(no){
        const {page_name, mGubun} = $QFn.getCurrentInfo();

        const $target = document.querySelector('[data-que-component="Lnb"]');
        if(mGubun == 'CTGRY' && $QUI.Lnb._startDepth == 1){
            $target.innerHTML = $QUI.Lnb.COMP.Lnb({data:$QUI.Lnb._lnbData[0].children, selectedNo:no});
        }else{
            if(page_name == 'PERFORMANCE'){
                $target.innerHTML = $QUI.Lnb.COMP.Lnb({data:$QUI.Lnb._lnbData[0].children, selectedNo:no, depth:2});
                $QUI.Pfm.renderMd26NaviTop(no);
            }else{
                // 1뎁스(전체, 맨, 우먼, 라이프) 시작
                $target.innerHTML = $QUI.Lnb.COMP.LnbTop({data:$QUI.Lnb._lnbData, selectedNo:no});
            }
        }
    }

    // [exports]
    const renderLnbDepth4 = function(data, no){
        const $target = document.querySelector('[data-que-component="LnbDepth4"]');
        $target.innerHTML = $QUI.Lnb.COMP.LnbDepth4({item:data, selectedNo:no});
        
        const {page_name} = $QFn.getCurrentInfo();
        if(page_name == 'PERFORMANCE'){
            $QUI.Pfm.renderMd26NaviTop(no);
        }
    }

    // [exports] GA4 트래킹 : 페이지뷰 + 맞춤 이벤트
    /**
     * 
     * @param {string} selectNo : 조회하는 카테고리 번호
     * @param {string} eventType : 이벤트 전송 여부
     */
    const ga4_tracking = function(selectNo, eventType = 'EVENT_SEND'){
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
            }else{
                const {category, action, label} = $QFn.GA.getEvnetParam('LNB', depthNames, refererDepth);
                GA4.EVENT.set(category, action, label);
            }

            // [PageView] 시점 조정
            if(isSendVirPageView == true){
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
    exp.isPartOf = isPartOf;
    exp.clickLnb = clickLnb;
    exp.renderLnb = renderLnb;
    exp.renderLnbDepth4 = renderLnbDepth4;
    exp.ga4_tracking = ga4_tracking;

    exp._lnbData = [];
    exp._startDepth = 0;
    exp._excludeDict = {};
    exp._lnbLang = 'KOR';
})(window.$QUI.Lnb);

