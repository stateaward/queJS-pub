(()=>{
    const LnbDependencies = [
        `component/Lnb.js`,
    ];

    // Lnb
    $Que.initUI('Lnb', LnbDependencies, async ()=>{
        const rendingBrndId = document.querySelector('#ctgryNonParams [name="rendingBrndId"]')?.value;
        const selectNo = document.querySelector('#ctgryParams [name="selectCtgryNo"]')?.value;

        const mGubun = document.querySelector('#ctgryParams [name="mallGubun"]')?.value;
        const cType = document.querySelector('#ctgryParams [name="ctgryType"]')?.value;

        const response = await $QFn.fetchData('POST', '/category/v2/lnb', {rendingBrndId:rendingBrndId,mallGubun:mGubun,ctgryType:cType});

        $QUI.Lnb._lnbData = $QFn.makeLnbData(response.ctgryList);
        $QUI.Lnb._startDepth = response.startDepth;
        $QUI.Lnb._excludeDict = response.excludeDict;
        
        $QUI.Lnb.renderLnb(selectNo);
    });
})();