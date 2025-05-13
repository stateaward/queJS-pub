(()=>{
    const LnbDependencies = [
        `component/Lnb.js`,
        `component/LnbModal.js`
    ];

    // Lnb
    $Que.initUI('Lnb', LnbDependencies, async ()=>{
        const rendingNo = document.querySelector('#ctgryNonParams [name="rendingCtgryNo"]')?.value;
        const selectNo = document.querySelector('#ctgryParams [name="selectCtgryNo"]')?.value;

        const info = $QFn.getCurrentInfo();
        const response = await $QFn.fetchData('POST', '/category/v2/lnb', {rendingCtgryNo:rendingNo,mallGubun:info.mGubun,mallType:info.mType,ctgryType:info.cType});
        
        $QUI.Lnb._lnbData = $QFn.makeLnbData(response.ctgryList);
        $QUI.Lnb._startDepth = response.startDepth;
        $QUI.Lnb._excludeDict = response.excludeDict;

        if(info.page_name == 'PERFORMANCE') {
            $QUI.Lnb._lnbLang = 'ENG';
            // 카테고리별 상품 총 개수를 ...
            const responseCnt = await $QFn.fetchData('GET', '/category/v2/godTotCnt', {ctgryNo:rendingNo,mType:info.mType});
            $QFn.assignListToLnbData(responseCnt.result, $QUI.Lnb._lnbData, 'NO', {'CNT':'cnt'});
            
            // 퍼포먼스관 카테고리 셋팅
            $QUI.Pfm?.renderMd26Ctgry(selectNo);
        }
        
        $QUI.Lnb.renderLnb(selectNo);

        if(info.page_name == 'GENERAL' || info.page_name == 'NEW' || info.page_name == 'BEST'){
            // 일반/NEW/BEST 만 LNB Modal 생성
            const tempNo = (info.page_name == 'NEW' || info.page_name == 'BEST') ? rendingNo : selectNo;
            $QUI.Lnb.renderModal(tempNo);
        }

        // [GA4] 페이지뷰 셋팅
        $QUI.Lnb.ga4_tracking(selectNo, 'NO_EVENT_SEND');     // 이벤트는 미발생
    });
})();