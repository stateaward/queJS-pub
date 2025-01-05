(()=>{
    const SearchPromoDependencies = [
        `component/PromoItem.js`,
        `component/SearchPromo.js`
    ];

    $Que.initUI('Promo', SearchPromoDependencies, async ()=>{
        // 1-이벤트 목록 조회
        const response = await $QUI.Promo.getEventList();

        // 2-카테고리 탭 생성
        $QUI.Promo.makeTabList(response.categoryList);
        $Que.render('SearchPromoTab', $QUI.Promo.COMP.TabWrapper('ALL'));
        $.tab();

        // 3-결과 카운트 반영
        const $promoCount = document.querySelector('#promo-count');
        $promoCount.textContent = response?.pageInfo?.totalCount || 0;
    });
})();