(()=>{
    const LnbDependencies = [
        `component/Lnb.js`,
        `component/LnbChild.js`
    ];

    // Lnb
    $Que.initUI('Lnb', LnbDependencies, async ()=>{
        const rendingBrndId = document.querySelector('#ctgryNonParams [name="rendingBrndId"]')?.value;
        const mGubun = document.querySelector('#ctgryParams [name="mallGubun"]')?.value;
        const cType = document.querySelector('#ctgryParams [name="ctgryType"]')?.value;

        const response = await $QFn.fetchData('POST', '/category/v2/lnb', {rendingBrndId:rendingBrndId,mallGubun:mGubun,ctgryType:cType});

        $QUI.Lnb._lnbData = $QFn.transformToHierarchy(response.ctgryList);
        $QUI.Lnb._startDepth = response.startDepth;
        $QUI.Lnb._excludeDict = response.excludeDict;

        const selectNo = document.querySelector('#ctgryParams [name="selectCtgryNo"]')?.value;
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