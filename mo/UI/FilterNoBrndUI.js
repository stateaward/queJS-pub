(()=>{
    const FilterDependencies = [
        `component/Filter.js`,
        `component/FilterPrice.js`,
        `component/FilterGod.js`,
        `component/FilterColor.js`,
    ];

    $Que.initUI('Filter', FilterDependencies, async ()=>{
        $QUI.Filter.COMP.FilterBrand = $QUI.Filter.COMP.FilterBrand || function(){return ''};

        $Que.render('FilterBtn', $QUI.Filter.COMP.FilterBtn(false));
        $Que.render('FilterModal', $QUI.Filter.COMP.FilterModal());

        await $QUI.Filter.initPriceSlider();
        await $QUI.Filter.renewFilterParamToFilter();   // Param 셋팅하며, 카운트 조회

        $QUI.Filter.debouncedFilterBtnActive();
    });
})();