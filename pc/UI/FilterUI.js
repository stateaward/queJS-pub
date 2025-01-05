(()=>{
    const FilterDependencies = [
        `component/Filter.js`,
        `component/FilterGod.js`,
        `component/FilterBrand.js`,
        `component/FilterPrice.js`,
        `component/FilterColor.js`,
    ];

    $Que.initUI('Filter', FilterDependencies, async ()=>{
        $Que.render('Filter', $QUI.Filter.COMP.Filter());        
        await $QFn.CTGRY.getFilterCount('CTGRY');
        
        await $QUI.Filter.initPriceSlider();
        await $QUI.Filter.renewFilterParamToFilter();
    });
})();