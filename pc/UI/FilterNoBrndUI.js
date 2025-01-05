(()=>{
    const FilterDependencies = [
        `component/Filter.js`,
        `component/FilterPrice.js`,
        `component/FilterGod.js`,
        `component/FilterColor.js`,
    ];

    $Que.initUI('Filter', FilterDependencies, async ()=>{
        $QUI.Filter.COMP.FilterBrand = $QUI.Filter.COMP.FilterBrand || function(){return ''};
        
        $Que.render('Filter', $QUI.Filter.COMP.Filter());
        // 브랜드 필터 박스 hidden
        const $brndFtrHead = document.querySelector('#btnFilerBrand');
        $brndFtrHead.style.display = 'none';
        
        $QFn.CTGRY.getFilterCount('CTGRY');

        await $QUI.Filter.initPriceSlider();
        await $QUI.Filter.renewFilterParamToFilter();   // Param 셋팅하며, 카운트 조회
    });
})();