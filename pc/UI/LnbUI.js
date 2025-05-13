(()=>{
    const LnbDependencies = [
        `component/Lnb.js`,
        `component/LnbChild.js`
    ];

    // Lnb
    $Que.initUI('Lnb', LnbDependencies, async ()=>{
        const rendingNo = document.querySelector('#ctgryNonParams [name="rendingCtgryNo"]')?.value;
        const selectNo = document.querySelector('#ctgryParams [name="selectCtgryNo"]')?.value;

        const info = $QFn.getCurrentInfo();
        const response = await $QFn.fetchData('POST', '/category/v2/lnb', {rendingCtgryNo:rendingNo,mallGubun:info.mGubun,mallType:info.mType,ctgryType:info.cType});
        
        $QUI.Lnb._lnbData = $QFn.transformToHierarchy(response.ctgryList);
        $QUI.Lnb._startDepth = response.startDepth;
        $QUI.Lnb._excludeDict = response.excludeList;

        if(info.page_name == 'PERFORMANCE') {
            $QUI.Lnb._lnbLang = 'ENG';
            // 카테고리별 상품 총 개수를 ...
            const responseCnt = await $QFn.fetchData('GET', '/category/v2/godTotCnt', {ctgryNo:rendingNo,mType:info.mType});
            $QFn.assignListToLnbData(responseCnt.result, $QUI.Lnb._lnbData, 'NO', {'CNT':'cnt'});

            // 퍼포먼스관 카테고리 셋팅
            $QUI.Pfm?.renderMd26Ctgry(selectNo);
        }

        if(selectNo.length >= 12){
            // 조회중인 카테고리가 4뎁스인 경우 : 4뎁스 오픈 처리 + LNB는 3뎁스로 조회
            const data = $QFn.findNodeInHierarchy(selectNo.substr(0,12), $QUI.Lnb._lnbData);
            $QUI.Lnb.renderLnbDepth4(data, selectNo);
        }
        $QUI.Lnb.renderLnb(selectNo);
        
        // [GA4] 페이지뷰 셋팅
        $QUI.Lnb.ga4_tracking(selectNo, 'NO_EVENT_SEND');     // 이벤트는 미발생
    });
})();