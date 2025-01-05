(()=>{
    const LnbDependencies = [
        `component/Lnb.js`,
        `component/LnbModal.js`
    ];

    // Lnb
    $Que.initUI('Lnb', LnbDependencies, async ()=>{
        const rendingNo = document.querySelector('#ctgryNonParams [name="rendingCtgryNo"]')?.value;
        const selectNo = document.querySelector('#ctgryParams [name="selectCtgryNo"]')?.value;

        const mGubun = document.querySelector('#ctgryParams [name="mallGubun"]')?.value;
        const mType = document.querySelector('#ctgryParams [name="mallType"]')?.value;
        const cType = document.querySelector('#ctgryParams [name="ctgryType"]')?.value;

        const response = await $QFn.fetchData('POST', '/category/v2/lnb', {rendingCtgryNo:rendingNo,mallGubun:mGubun,mallType:mType,ctgryType:cType});

        $QUI.Lnb._lnbData = $QFn.makeLnbData(response.ctgryList);
        $QUI.Lnb._startDepth = response.startDepth;
        $QUI.Lnb._excludeDict = response.excludeDict;
        
        $QUI.Lnb.renderLnb(selectNo);

        const {page_name} = $QFn.getCurrentInfo();
        if(page_name == 'GENERAL' || page_name == 'NEW' || page_name == 'BEST'){
            // 일반/NEW/BEST 만 LNB Modal 생성
            const tempNo = (page_name == 'NEW' || page_name == 'BEST') ? rendingNo : selectNo;
            $QUI.Lnb.renderModal(tempNo);
        }
    });
})();